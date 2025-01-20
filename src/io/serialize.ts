// File: src/io/deserialize.ts

import { IO_Interface, Palette } from '../types/index.js';
import { data } from '../data/index.js';
import { logger } from '../logger/index.js';

const logMode = data.mode.logging;
const mode = data.mode;

async function toCSS(palette: Palette): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			// 1. serialize metadata
			const metadata = `
				/* Palette Metadata */
				.palette {
					--id: "${palette.id}";
					--name: "${palette.metadata.name ?? 'Unnamed Palette'}";
					--swatches: ${palette.metadata.swatches};
					--type: "${palette.metadata.type}";
					--timestamp: "${palette.metadata.timestamp}";
					--enableAlpha: ${palette.metadata.flags.enableAlpha};
					--limitDarkness: ${palette.metadata.flags.limitDarkness};
					--limitGrayness: ${palette.metadata.flags.limitGrayness};
					--limitLightness: ${palette.metadata.flags.limitLightness};
				}`.trim();

			// 2. serialize custom color if present
			const customColor = palette.metadata.customColor
				? `
				/* Optional Custom Color */
				.palette-custom {
					--custom-hsl-color: "hsl(${palette.metadata.customColor.hslColor.value.hue}, ${
						palette.metadata.customColor.hslColor.value.saturation
					}%, ${palette.metadata.customColor.hslColor.value.lightness}%)";
					--custom-cmyk-color: "${palette.metadata.customColor.convertedColors.cmyk}";
					--custom-hex-color: "${palette.metadata.customColor.convertedColors.hex}";
					--custom-hsv-color: "${palette.metadata.customColor.convertedColors.hsv}";
					--custom-lab-color: "${palette.metadata.customColor.convertedColors.lab}";
					--custom-rgb-color: "${palette.metadata.customColor.convertedColors.rgb}";
					--custom-xyz-color: "${palette.metadata.customColor.convertedColors.xyz}";
				}`.trim()
				: '';

			// 3. serialize palette items
			const items = palette.items
				.map(item => {
					const backgroundColor = item.cssStrings.hslCSSString;

					return `
					/* Palette Item: ${item.id} */
					.color-${item.id} {
						--id: "${item.id}";
						--cmyk-color: "${item.cssStrings.cmykCSSString}";
						--hex-color: "${item.cssStrings.hexCSSString}";
						--hsl-color: "${item.cssStrings.hslCSSString}";
						--hsv-color: "${item.cssStrings.hsvCSSString}";
						--lab-color: "${item.cssStrings.labCSSString}";
						--rgb-color: "${item.cssStrings.rgbCSSString}";
						--xyz-color: "${item.cssStrings.xyzCSSString}";
						background-color: ${backgroundColor};
					}`.trim();
				})
				.join('\n\n');

			// 4. combine CSS data
			const cssData = [metadata, customColor, items]
				.filter(Boolean)
				.join('\n\n');

			// 5. resolve serialized CSS data
			resolve(cssData.trim());
		} catch (error) {
			if (!mode.quiet && logMode.errors) {
				if (logMode.verbosity > 1) {
					logger.error(`Failed to convert palette to CSS: ${error}`);
				} else {
					logger.error('Failed to convert palette to CSS');
				}
			}

			if (mode.stackTrace) {
				console.trace('Stack Trace:');
			}

			reject(new Error(`Failed to convert palette to CSS: ${error}`));
		}
	});
}

async function toJSON(palette: Palette): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const jsonData = JSON.stringify(palette, null, 2);

			resolve(jsonData);
		} catch (error) {
			if (!mode.quiet && logMode.errors) {
				if (logMode.verbosity > 1) {
					logger.error(`Failed to convert palette to JSON: ${error}`);
				} else {
					logger.error('Failed to convert palette to JSON');
				}
			}

			if (mode.stackTrace) {
				console.trace('Stack Trace:');
			}

			reject(new Error(`Failed to convert palette to JSON: ${error}`));
		}
	});
}

async function toXML(palette: Palette): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			// 1. serialize palette metadata
			const customColorXML = palette.metadata.customColor
				? `
				<CustomColor>
					<CMYK>${palette.metadata.customColor.convertedColors.cmyk}</CMYK>
					<Hex>${palette.metadata.customColor.convertedColors.hex}</Hex>
					<HSL>${palette.metadata.customColor.convertedColors.hsl}</HSL>
					<HSV>${palette.metadata.customColor.convertedColors.hsv}</HSV>
					<LAB>${palette.metadata.customColor.convertedColors.lab}</LAB>
					<RGB>${palette.metadata.customColor.convertedColors.rgb}</RGB>
					<XYZ>${palette.metadata.customColor.convertedColors.xyz}</XYZ>
				</CustomColor>`.trim()
				: '<CustomColor>false</CustomColor>';

			const metadata = `
				<Metadata>
					<Name>${palette.metadata.name ?? 'Unnamed Palette'}</Name>
					<Timestamp>${palette.metadata.timestamp}</Timestamp>
					<Swatches>${palette.metadata.swatches}</Swatches>
					<Type>${palette.metadata.type}</Type>
					${customColorXML}
					<Flags>
						<EnableAlpha>${palette.metadata.flags.enableAlpha}</EnableAlpha>
						<LimitDarkness>${palette.metadata.flags.limitDarkness}</LimitDarkness>
						<LimitGrayness>${palette.metadata.flags.limitGrayness}</LimitGrayness>
						<LimitLightness>${palette.metadata.flags.limitLightness}</LimitLightness>
					</Flags>
				</Metadata>`.trim();

			// 2. serialize palette items
			const xmlItems = palette.items
				.map((item, index) =>
					`
					<PaletteItem id="${index + 1}">
						<Colors>
							<CMYK>${item.colors.cmyk}</CMYK>
							<Hex>${item.colors.hex}</Hex>
							<HSL>${item.colors.hsl}</HSL>
							<HSV>${item.colors.hsv}</HSV>
							<LAB>${item.colors.lab}</LAB>
							<RGB>${item.colors.rgb}</RGB>
							<XYZ>${item.colors.xyz}</XYZ>
						</Colors>
						<CSS_Colors>
							<CMYK_CSS>${item.cssStrings.cmykCSSString}</CMYK_CSS>
							<Hex_CSS>${item.cssStrings.hexCSSString}</Hex_CSS>
							<HSL_CSS>${item.cssStrings.hslCSSString}</HSL_CSS>
							<HSV_CSS>${item.cssStrings.hsvCSSString}</HSV_CSS>
							<LAB_CSS>${item.cssStrings.labCSSString}</LAB_CSS>
							<RGB_CSS>${item.cssStrings.rgbCSSString}</RGB_CSS>
							<XYZ_CSS>${item.cssStrings.xyzCSSString}</XYZ_CSS>
						</CSS_Colors>
					</PaletteItem>`.trim()
				)
				.join('\n');

			// 3. combine metadata and items into the palette XML
			const xmlData = `
				<Palette id=${palette.id}>
					${metadata}
					<Items>
						${xmlItems}
					</Items>
				</Palette>`.trim();

			resolve(xmlData.trim());
		} catch (error) {
			if (!mode.quiet && logMode.errors) {
				if (logMode.verbosity > 1) {
					logger.error(`Failed to convert palette to XML: ${error}`);
				} else {
					logger.error('Failed to convert palette to XML');
				}
			}

			if (mode.stackTrace) {
				console.trace('Stack Trace:');
			}

			reject(new Error(`Failed to convert palette to XML: ${error}`));
		}
	});
}

export const serialize: IO_Interface['serialize'] = {
	toCSS,
	toJSON,
	toXML
};
