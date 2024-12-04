// File: src/common/utils/palette.ts

import { Color, ColorString, HSL, Palette, PaletteItem } from '../../index';
import { config } from '../../config';
import { core } from '../core';
import { helpers } from '../helpers';

const mode = config.mode;

function createObject(
	type: string,
	items: PaletteItem[],
	baseColor: HSL,
	numBoxes: number,
	paletteID: number,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Palette {
	return {
		id: `${type}_${paletteID}`,
		items,
		flags: {
			enableAlpha: enableAlpha,
			limitDarkness: limitDark,
			limitGrayness: limitGray,
			limitLightness: limitLight
		},
		metadata: {
			numBoxes,
			paletteType: type,
			customColor: {
				hslColor: baseColor,
				convertedColors: items[0]?.colors || {}
			},
			timestamp: Date.now()
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
			if (mode.logErrors) console.error('Invalid color values.');

			helpers.dom.showToast('Invalid color.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = core.getCSSColorString(clonedColor);

		if (!mode.quiet)
			console.log(
				`Adding CSS-formatted color to DOM ${stringifiedColor}`
			);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		if (mode.logErrors)
			console.error('Failed to populate color text output box:', error);

		return;
	}
}

export const palette = { createObject, populateOutputBox } as const;
