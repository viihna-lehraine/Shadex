// File: src/common/utils/palette.ts

import { Color, ColorString, HSL, Palette, PaletteItem } from '../../index';
import { core } from '../core';
import { helpers } from '../helpers';

function createObject(
	type: string,
	items: PaletteItem[],
	baseColor: HSL,
	numBoxes: number,
	paletteID: number,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Palette {
	return {
		id: `${type}_${paletteID}`,
		items,
		flags: {
			enableAlpha: enableAlpha,
			limitDark: limitDark,
			limitGray: limitGray,
			limitLight: limitBright
		},
		metadata: {
			numBoxes,
			paletteType: type,
			customColor: {
				hslColor: baseColor,
				convertedColors: items[0]?.colors || {}
			}
		}
	};
}

export function populateOutputBox(
	color: Color | ColorString,
	boxNumber: number
): void {
	try {
		const clonedColor: Color = core.isColor(color)
			? core.clone(color)
			: core.colorStringToColor(color);

		if (!core.validateColorValues(clonedColor)) {
			console.error('Invalid color values.');

			helpers.dom.showToast('Invalid color values.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = core.getCSSColorString(clonedColor);

		console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		console.error('Failed to populate color text output box:', error);

		return;
	}
}

export const palette = { createObject, populateOutputBox };
