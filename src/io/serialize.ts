// File: io/deserialize.js

import { IOFn_MasterInterface, Palette } from '../types/index.js';
import { createLogger } from '../logger/index.js';
import { modeData as mode } from '../data/mode.js';

const logMode = mode.logging;

const thisModule = 'io/serialize.js';

const logger = await createLogger();

async function toCSS(palette: Palette): Promise<string> {
	const thisMethod = 'toCSS()';

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
					--limitDarkness: ${palette.metadata.flags.limitDarkness};
					--limitGrayness: ${palette.metadata.flags.limitGrayness};
					--limitLightness: ${palette.metadata.flags.limitLightness};
				}`.trim();

			// 2. serialize palette items
			const items = palette.items
				.map(item => {
					const backgroundColor = item.colors.css.hsl;

					return `
					/* Palette Item */
					.color {
						--cmyk-color: "${item.colors.css.cmyk}";
						--hex-color: "${item.colors.css.hex}";
						--hsl-color: "${item.colors.css.hsl}";
						--hsv-color: "${item.colors.css.hsv}";
						--lab-color: "${item.colors.css.lab}";
						--rgb-color: "${item.colors.css.rgb}";
						--xyz-color: "${item.colors.css.xyz}";
						background-color: ${backgroundColor};
					}`.trim();
				})
				.join('\n\n');

			// 3. combine CSS data
			const cssData = [metadata, items].filter(Boolean).join('\n\n');

			// 4. resolve serialized CSS data
			resolve(cssData.trim());
		} catch (error) {
			if (logMode.error) {
				if (logMode.verbosity > 1) {
					logger.error(
						`Failed to convert palette to CSS: ${error}`,
						`${thisModule} > ${thisMethod}`
					);
				} else {
					logger.error(
						'Failed to convert palette to CSS',
						`${thisModule} > ${thisMethod}`
					);
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
	const thisMethod = 'toJSON()';

	return new Promise((resolve, reject) => {
		try {
			const jsonData = JSON.stringify(palette, null, 2);

			resolve(jsonData);
		} catch (error) {
			if (logMode.error) {
				if (logMode.verbosity > 2) {
					logger.error(
						`Failed to convert palette to JSON: ${error}`,
						`${thisModule} > ${thisMethod}`
					);
				} else {
					logger.error(
						'Failed to convert palette to JSON',
						`${thisModule} > ${thisMethod}`
					);
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
	const thisMethod = 'toXML()';

	return new Promise((resolve, reject) => {
		try {
			// 1. serialize palette metadata
			const metadata = `
				<Metadata>
					<Name>${palette.metadata.name ?? 'Unnamed Palette'}</Name>
					<Timestamp>${palette.metadata.timestamp}</Timestamp>
					<Swatches>${palette.metadata.swatches}</Swatches>
					<Type>${palette.metadata.type}</Type>
					<Flags>
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
							<Main>
								<CMYK>${item.colors.main.cmyk}</CMYK>
								<Hex>${item.colors.main.hex}</Hex>
								<HSL>${item.colors.main.hsl}</HSL>
								<HSV>${item.colors.main.hsv}</HSV>
								<LAB>${item.colors.main.lab}</LAB>
								<RGB>${item.colors.main.rgb}</RGB>
								<XYZ>${item.colors.main.xyz}</XYZ>
							</Main>
							<CSS>
								<CMYK>${item.colors.css.cmyk}</CMYK>
								<Hex>${item.colors.css.hex}</Hex>
								<HSL>${item.colors.css.hsl}</HSL>
								<HSV>${item.colors.css.hsv}</HSV>
								<LAB>${item.colors.css.lab}</LAB>
								<RGB>${item.colors.css.rgb}</RGB>
								<XYZ>${item.colors.css.xyz}</XYZ>
							</CSS>
						</Colors>
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
			if (logMode.error) {
				if (logMode.verbosity > 2) {
					logger.error(
						`Failed to convert palette to XML: ${error}`,
						`${thisModule} > ${thisMethod}`
					);
				} else {
					logger.error(
						'Failed to convert palette to XML',
						`${thisModule} > ${thisMethod}`
					);
				}
			}

			if (mode.stackTrace) {
				console.trace('Stack Trace:');
			}

			reject(new Error(`Failed to convert palette to XML: ${error}`));
		}
	});
}

export const serialize: IOFn_MasterInterface['serialize'] = {
	toCSS,
	toJSON,
	toXML
};
