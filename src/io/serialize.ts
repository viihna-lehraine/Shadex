// File: src/io/deserialize.ts

import { IO_Fn_SerializeInterface, Palette } from '../index/index.js';

async function toCSS(palette: Palette): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const cssData = palette.items
				.map(item => {
					// default to HSL if color space isn't specified
					const colorValue =
						item.cssStrings['hslCSSString'] ||
						item.cssStrings.hslCSSString;

					return `
					/* Palette Item: ${item.id} */
					.color-${item.id} {
						cmyk-color: ${item.cssStrings.cmykCSSString};
						hex-color: ${item.cssStrings.hexCSSString};
						hsl-color: ${item.cssStrings.hslCSSString};
						hsv-color: ${item.cssStrings.hsvCSSString};
						lab-color: ${item.cssStrings.labCSSString};
						rgb-color: ${item.cssStrings.rgbCSSString};
						xyz-color: ${item.cssStrings.xyzCSSString};
						background-color: ${colorValue};
					}`;
				})
				.join('\n');

			resolve(cssData.trim());
		} catch (error) {
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
			reject(new Error(`Failed to convert palette to JSON: ${error}`));
		}
	});
}

async function toXML(palette: Palette): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const xmlItems = palette.items
				.map(
					item => `
					<PaletteItem id="${item.id}">
						<Colors>
							<CMYK>${JSON.stringify(item.colors.cmyk)}</CMYK>
							<Hex>${JSON.stringify(item.colors.hex)}</Hex>
							<HSL>${JSON.stringify(item.colors.hsl)}</HSL>
							<HSV>${JSON.stringify(item.colors.hsv)}</HSV>
							<LAB>${JSON.stringify(item.colors.lab)}</LAB>
							<RGB>${JSON.stringify(item.colors.rgb)}</RGB>
							<XYZ>${JSON.stringify(item.colors.xyz)}</XYZ>
						</Colors>
						<ColorStrings>
							<CMYKString>${JSON.stringify(item.colorStrings.cmykString)}</CMYKString>
							<HexString>${JSON.stringify(item.colorStrings.hexString)}</HexString>
							<HSLString>${JSON.stringify(item.colorStrings.hslString)}</HSLString>
							<HSVString>${JSON.stringify(item.colorStrings.hsvString)}</HSVString>
							<LABString>${JSON.stringify(item.colorStrings.labString)}</LABString>
							<RGBString>${JSON.stringify(item.colorStrings.rgbString)}</RGBString>
							<XYZString>${JSON.stringify(item.colorStrings.xyzString)}</XYZString>
						</ColorStrings>
					</PaletteItem>`
				)
				.join('');

			const xmlData = `
				<Palette id="${palette.id}">
					<Flags>
						<EnableAlpha>${palette.flags.enableAlpha}</EnableAlpha>
						<LimitDarkness>${palette.flags.limitDarkness}</LimitDarkness>
						<LimitGrayness>${palette.flags.limitGrayness}</LimitGrayness>
						<LimitLightness>${palette.flags.limitLightness}</LimitLightness>
					</Flags>
					<Metadata>
						<CustomColor>
							<HSLColor>${JSON.stringify(
								palette.metadata.customColor?.hslColor || null
							)}</HSLColor>
							<ConvertedColors>${JSON.stringify(
								palette.metadata.customColor?.convertedColors ||
									null
							)}</ConvertedColors>
						</CustomColor>
						<NumBoxes>${palette.metadata.numBoxes}</NumBoxes>
						<PaletteType>${palette.metadata.paletteType}</PaletteType>
						<Timestamp>${palette.metadata.timestamp}</Timestamp>
					</Metadata>
					<Items>
						${xmlItems}
					</Items>
				</Palette>`;

			resolve(xmlData.trim());
		} catch (error) {
			reject(new Error(`Failed to convert palette to XML: ${error}`));
		}
	});
}

export const serialize: IO_Fn_SerializeInterface = {
	toCSS,
	toJSON,
	toXML
};
