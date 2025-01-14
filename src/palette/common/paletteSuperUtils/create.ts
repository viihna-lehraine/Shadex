// File: src/palette/common/paletteSuperUtils/create.js

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
	PaletteCommon_SuperUtils_Create,
	PaletteItem,
	RGB,
	RGBString,
	SL,
	XYZ,
	XYZString
} from '../../../index/index.js';
import { convert, core, utils } from '../../../common/index.js';
import { idbInstance } from '../../../idb/index.js';
import { paletteHelpers } from '../paletteHelpers/index.js';

const limits = paletteHelpers.limits;
const update = paletteHelpers.update;

const hslTo = convert.hslTo;

function baseColor(customColor: HSL | null, enableAlpha: boolean): HSL {
	const color = core.base.clone(customColor ?? utils.random.hsl(enableAlpha));

	return color as HSL;
}

async function paletteItem(
	color: HSL,
	enableAlpha: boolean
): Promise<PaletteItem> {
	const clonedColor = core.base.clone(color) as HSL;
	const nextPaletteID = await idbInstance.getNextPaletteID();

	clonedColor.value.alpha = enableAlpha
		? core.brand.asAlphaRange(Math.random())
		: core.brand.asAlphaRange(1);

	return {
		id: `${color.format}_${nextPaletteID}`,
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
			cmykCSSString: core.convert.toCSSColorString(
				hslTo(clonedColor, 'cmyk')
			),
			hexCSSString: core.convert.toCSSColorString(
				hslTo(clonedColor, 'hex')
			),
			hslCSSString: core.convert.toCSSColorString(clonedColor),
			hsvCSSString: core.convert.toCSSColorString(
				hslTo(clonedColor, 'hsv')
			),
			labCSSString: core.convert.toCSSColorString(
				hslTo(clonedColor, 'lab')
			),
			rgbCSSString: core.convert.toCSSColorString(
				hslTo(clonedColor, 'rgb')
			),
			xyzCSSString: core.convert.toCSSColorString(
				hslTo(clonedColor, 'xyz')
			)
		}
	};
}

async function paletteItemArray(
	baseColor: HSL,
	hues: number[],
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<PaletteItem[]> {
	const paletteItems: PaletteItem[] = [
		await paletteItem(baseColor, enableAlpha)
	];

	for (const [i, hue] of hues.entries()) {
		let newColor: HSL | null = null;

		do {
			const sl = utils.random.sl(enableAlpha) as SL;

			newColor = utils.conversion.genAllColorValues({
				value: {
					hue: core.brand.asRadial(hue),
					...sl.value
				},
				format: 'hsl'
			}).hsl as HSL;
		} while (
			newColor &&
			((limitGray && limits.isTooGray(newColor)) ||
				(limitDark && limits.isTooDark(newColor)) ||
				(limitLight && limits.isTooLight(newColor)))
		);

		if (newColor) {
			const newPaletteItem = await paletteItem(newColor, enableAlpha);

			paletteItems.push(newPaletteItem);

			update.colorBox(newColor, i + 1);
		}
	}

	return paletteItems;
}

export const create: PaletteCommon_SuperUtils_Create = {
	baseColor,
	paletteItem,
	paletteItemArray
} as const;
