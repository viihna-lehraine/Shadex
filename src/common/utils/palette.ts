// File: src/common/utils/palette.ts

import {
	Color,
	ColorString,
	CommonUtilsFnPalette,
	HSL,
	Palette,
	PaletteItem
} from '../../index';
import { core } from '../core';
import { data } from '../../data';
import { helpers } from '../helpers';

const mode = data.mode;

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
		const clonedColor: Color = core.guards.isColor(color)
			? core.base.clone(color)
			: core.convert.toColor(color);

		if (!core.validate.colorValues(clonedColor)) {
			if (mode.errorLogs) console.error('Invalid color values.');

			helpers.dom.showToast('Invalid color.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = core.convert.toCSSColorString(clonedColor);

		if (!mode.quiet)
			console.log(
				`Adding CSS-formatted color to DOM ${stringifiedColor}`
			);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		if (mode.errorLogs)
			console.error('Failed to populate color text output box:', error);

		return;
	}
}

export const palette: CommonUtilsFnPalette = {
	createObject,
	populateOutputBox
} as const;
