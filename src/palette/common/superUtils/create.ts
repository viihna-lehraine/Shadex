// File: palette/common/superUtils/create.js

import {
	CMYK,
	CMYK_StringProps,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	PaletteItem,
	RGB,
	RGB_StringProps,
	SL,
	XYZ,
	XYZ_StringProps
} from '../../../types/index.js';
import {
	coreConversionUtils,
	coreUtils,
	utils
} from '../../../common/index.js';
import { helpers as paletteHelpers } from '../helpers/index.js';

const limits = paletteHelpers.limits;
const update = paletteHelpers.update;

const hslTo = coreConversionUtils.hslTo;

function baseColor(customColor: HSL | null): HSL {
	const color = coreUtils.base.clone(customColor);

	return color as HSL;
}

async function paletteItem(color: HSL): Promise<PaletteItem> {
	const clonedColor = coreUtils.base.clone(color) as HSL;

	return {
		colors: {
			main: {
				cmyk: (hslTo(clonedColor, 'cmyk') as CMYK).value,
				hex: (hslTo(clonedColor, 'hex') as Hex).value,
				hsl: clonedColor.value,
				hsv: (hslTo(clonedColor, 'hsv') as HSV).value,
				lab: (hslTo(clonedColor, 'lab') as LAB).value,
				rgb: (hslTo(clonedColor, 'rgb') as RGB).value,
				xyz: (hslTo(clonedColor, 'xyz') as XYZ).value
			},
			stringProps: {
				cmyk: (
					utils.color.colorToColorString(
						hslTo(clonedColor, 'cmyk')
					) as CMYK_StringProps
				).value,
				hex: (
					utils.color.colorToColorString(
						hslTo(clonedColor, 'hex')
					) as Hex_StringProps
				).value,
				hsl: (
					utils.color.colorToColorString(
						clonedColor
					) as HSL_StringProps
				).value,
				hsv: (
					utils.color.colorToColorString(
						hslTo(clonedColor, 'hsv')
					) as HSV_StringProps
				).value,
				lab: (
					utils.color.colorToColorString(
						hslTo(clonedColor, 'lab')
					) as LAB_StringProps
				).value,
				rgb: (
					utils.color.colorToColorString(
						hslTo(clonedColor, 'rgb')
					) as RGB_StringProps
				).value,
				xyz: (
					utils.color.colorToColorString(
						hslTo(clonedColor, 'xyz')
					) as XYZ_StringProps
				).value
			},
			css: {
				cmyk: await coreUtils.convert.colorToCSSColorString(
					hslTo(clonedColor, 'cmyk')
				),
				hex: await coreUtils.convert.colorToCSSColorString(
					hslTo(clonedColor, 'hex')
				),
				hsl: await coreUtils.convert.colorToCSSColorString(clonedColor),
				hsv: await coreUtils.convert.colorToCSSColorString(
					hslTo(clonedColor, 'hsv')
				),
				lab: await coreUtils.convert.colorToCSSColorString(
					hslTo(clonedColor, 'lab')
				),
				rgb: await coreUtils.convert.colorToCSSColorString(
					hslTo(clonedColor, 'rgb')
				),
				xyz: await coreUtils.convert.colorToCSSColorString(
					hslTo(clonedColor, 'xyz')
				)
			}
		}
	};
}

async function paletteItemArray(
	baseColor: HSL,
	hues: number[],
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<PaletteItem[]> {
	const paletteItems: PaletteItem[] = [await paletteItem(baseColor)];

	for (const [i, hue] of hues.entries()) {
		let newColor: HSL | null = null;

		do {
			const sl = utils.random.sl() as SL;

			newColor = utils.conversion.genAllColorValues({
				value: {
					hue: coreUtils.brand.asRadial(hue),
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
			const newPaletteItem = await paletteItem(newColor);

			paletteItems.push(newPaletteItem);

			update.colorBox(newColor, i + 1);
		}
	}

	return paletteItems;
}

export const create = {
	baseColor,
	paletteItem,
	paletteItemArray
} as const;
