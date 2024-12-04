// File: src/palette/common/paletteSuperUtils/create.ts

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
} from '../../../index';
import { core, utils } from '../../../common';
import { IndexedDB } from '../../../idb';
import { paletteHelpers } from '../paletteHelpers';
import { paletteUtils } from '../paletteUtils';

const limits = paletteHelpers.limits;
const update = paletteHelpers.update;

const hslTo = paletteUtils.convert.hslTo;

const idb = IndexedDB.getInstance();

function baseColor(customColor: HSL | null, enableAlpha: boolean): HSL {
	const color = core.clone(customColor ?? utils.random.hsl(enableAlpha));

	return color as HSL;
}

function paletteItem(color: HSL, enableAlpha: boolean): PaletteItem {
	const clonedColor = core.clone(color) as HSL;

	clonedColor.value.alpha = enableAlpha ? Math.random() : 1;

	return {
		id: `${color.format}_${idb.getNextPaletteID()}`,
		colors: {
			cmyk: (hslTo(clonedColor, 'cmyk') as CMYK).value,
			hex: (hslTo(clonedColor, 'hex') as Hex).value,
			hsl: clonedColor.value,
			hsv: (hslTo(clonedColor, 'hsv') as HSV).value,
			lab: (hslTo(clonedColor, 'lab') as LAB).value,
			rgb: (hslTo(clonedColor, 'rgb') as RGB).value,
			xyz: (hslTo(clonedColor, 'xyz') as XYZ).value
		},
		colorStrings: {
			cmykString: (
				utils.color.colorToColorString(
					hslTo(clonedColor, 'cmyk')
				) as CMYKString
			).value,
			hexString: (
				utils.color.colorToColorString(
					hslTo(clonedColor, 'hex')
				) as HexString
			).value,
			hslString: (
				utils.color.colorToColorString(clonedColor) as HSLString
			).value,
			hsvString: (
				utils.color.colorToColorString(
					hslTo(clonedColor, 'hsv')
				) as HSVString
			).value,
			labString: (
				utils.color.colorToColorString(
					hslTo(clonedColor, 'lab')
				) as LABString
			).value,
			rgbString: (
				utils.color.colorToColorString(
					hslTo(clonedColor, 'rgb')
				) as RGBString
			).value,
			xyzString: (
				utils.color.colorToColorString(
					hslTo(clonedColor, 'xyz')
				) as XYZString
			).value
		},
		cssStrings: {
			cmykCSSString: core.getCSSColorString(hslTo(clonedColor, 'cmyk')),
			hexCSSString: core.getCSSColorString(hslTo(clonedColor, 'hex')),
			hslCSSString: core.getCSSColorString(clonedColor),
			hsvCSSString: core.getCSSColorString(hslTo(clonedColor, 'hsv')),
			labCSSString: core.getCSSColorString(hslTo(clonedColor, 'lab')),
			rgbCSSString: core.getCSSColorString(hslTo(clonedColor, 'rgb')),
			xyzCSSString: core.getCSSColorString(hslTo(clonedColor, 'xyz'))
		}
	};
}

function paletteItemArray(
	baseColor: HSL,
	hues: number[],
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): PaletteItem[] {
	const paletteItems: PaletteItem[] = [paletteItem(baseColor, enableAlpha)];

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
				(limitLight && limits.isTooLight(newColor)))
		);

		if (newColor) {
			paletteItems.push(paletteItem(newColor, enableAlpha));

			update.colorBox(newColor, i + 1);
		}
	});

	return paletteItems;
}

export const create = {
	baseColor,
	paletteItem,
	paletteItemArray
} as const;
