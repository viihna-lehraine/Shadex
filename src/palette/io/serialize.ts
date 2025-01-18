// File: src/palette/io/deserialize.ts

import {
	ColorSpace,
	Palette,
	PaletteSerializeFnInterface
} from '../../index/index.js';

function toCSS(palette: Palette, colorSpace: ColorSpace = 'hsl'): string {
	return palette.items
		.map(item => {
			const colorValue =
				item.cssStrings[
					(colorSpace + 'CSSString') as keyof typeof item.cssStrings
				] || item.cssStrings.hslCSSString;

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
}

function toJSON(palette: Palette): string {
	return JSON.stringify(palette, null, 2);
}

function toXML(palette: Palette): string {
	const xmlItems = palette.items
		.map(
			item => `
			<PaletteItem id="${item.id}">
				<Colors>
					<CMYK>${item.colors.cmyk}</CMYK>
					<Hex>${item.colors.hex}</Hex>
					<HSL>${item.colors.hsl}</HSL>
					<HSV>${item.colors.hsv}</HSV>
					<LAB>${item.colors.lab}</LAB>
					<RGB>${item.colors.rgb}</RGB>
				</Colors>
			</PaletteItem>`
		)
		.join('');
	return `
		<Palette id="${palette.id}">
			<Flags>
				<EnableAlpha>${palette.flags.enableAlpha}</EnableAlpha>
				<LimitDarkness>${palette.flags.limitDarkness}</LimitDarkness>
				<LimitGrayness>${palette.flags.limitGrayness}</LimitGrayness>
				<LimitLightness>${palette.flags.limitLightness}</LimitLightness>
			</Flags>
			<Metadata>
				<CustomColor>
					<HSLColor>${palette.metadata.customColor?.hslColor || null}</HSLColor>
					<ConvertedColors>${palette.metadata.customColor?.convertedColors || null}</ConvertedColors>
				</CustomColor>
				<NumBoxes>${palette.metadata.numBoxes}</NumBoxes>
				<PaletteType>${palette.metadata.paletteType}</PaletteType>
			</Metadata>
			${xmlItems}
		</Palette>`;
}

export const serialize: PaletteSerializeFnInterface = {
	toCSS,
	toJSON,
	toXML
};
