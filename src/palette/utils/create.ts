// File: src/palette/utils/create.ts

import {
	CMYK,
	CMYKString,
	Hex,
	HexString,
	HSL,
	HSLString,
	HSV,
	HSVString,
	LAB,
	LABString,
	PaletteItem,
	RGB,
	RGBString,
	SL,
	XYZ,
	XYZString
} from '../../index';
import { sub as paletteSubUtils } from './sub';
import { convert } from './convert';
import { idb } from '../../idb';
import { core, utils } from '../../common';

const limits = paletteSubUtils.limits;
const update = paletteSubUtils.update;

function createBaseColor(customColor: HSL | null, enableAlpha: boolean): HSL {
	const color = core.clone(customColor ?? utils.random.hsl(enableAlpha));

	return color as HSL;
}

function createPaletteItem(color: HSL, enableAlpha: boolean): PaletteItem {
	const clonedColor = core.clone(color) as HSL;

	clonedColor.value.alpha = enableAlpha ? Math.random() : 1;

	return {
		id: `${color.format}_${idb.getNextPaletteID()}`,
		colors: {
			cmyk: (convert.hslToCMYK(clonedColor) as CMYK).value,
			hex: (convert.hslToHex(clonedColor) as Hex).value,
			hsl: clonedColor.value,
			hsv: (convert.hslToHSV(clonedColor) as HSV).value,
			lab: (convert.hslToLAB(clonedColor) as LAB).value,
			rgb: (convert.hslToRGB(clonedColor) as RGB).value,
			xyz: (convert.hslToXYZ(clonedColor) as XYZ).value
		},
		colorStrings: {
			cmykString: (
				utils.color.colorToColorString(
					convert.hslToCMYK(clonedColor)
				) as CMYKString
			).value,
			hexString: (
				utils.color.colorToColorString(
					convert.hslToHex(clonedColor)
				) as HexString
			).value,
			hslString: (
				utils.color.colorToColorString(clonedColor) as HSLString
			).value,
			hsvString: (
				utils.color.colorToColorString(
					convert.hslToHSV(clonedColor)
				) as HSVString
			).value,
			labString: (
				utils.color.colorToColorString(
					convert.hslToLAB(clonedColor)
				) as LABString
			).value,
			rgbString: (
				utils.color.colorToColorString(
					convert.hslToRGB(clonedColor)
				) as RGBString
			).value,
			xyzString: (
				utils.color.colorToColorString(
					convert.hslToXYZ(clonedColor)
				) as XYZString
			).value
		},
		cssStrings: {
			cmykCSSString: core.getCSSColorString(
				convert.hslToCMYK(clonedColor)
			),
			hexCSSString: convert.hslToHex(clonedColor).value.hex,
			hslCSSString: core.getCSSColorString(clonedColor),
			hsvCSSString: core.getCSSColorString(convert.hslToHSV(clonedColor)),
			labCSSString: core.getCSSColorString(convert.hslToLAB(clonedColor)),
			rgbCSSString: core.getCSSColorString(convert.hslToRGB(clonedColor)),
			xyzCSSString: core.getCSSColorString(convert.hslToXYZ(clonedColor))
		}
	};
}

function createPaletteItemArray(
	baseColor: HSL,
	hues: number[],
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitBright: boolean
): PaletteItem[] {
	const paletteItems: PaletteItem[] = [
		createPaletteItem(baseColor, enableAlpha)
	];

	hues.forEach((hue, i) => {
		let newColor: HSL | null = null;

		do {
			const sl = utils.random.sl(enableAlpha) as SL;
			newColor = utils.conversion.genAllColorValues({
				value: { hue, ...sl.value },
				format: 'hsl'
			}).hsl as HSL;
		} while (
			newColor &&
			((limitGray && limits.isTooGray(newColor)) ||
				(limitDark && limits.isTooDark(newColor)) ||
				(limitBright && limits.isTooBright(newColor)))
		);

		if (newColor) {
			paletteItems.push(createPaletteItem(newColor, enableAlpha));

			update.colorBox(newColor, i + 1);
		}
	});

	return paletteItems;
}

export const create = {
	baseColor: createBaseColor,
	paletteItem: createPaletteItem,
	paletteItemArray: createPaletteItemArray
};
