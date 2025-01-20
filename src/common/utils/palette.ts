// File: src/common/utils/palette.js

import {
	Color,
	ColorString,
	CommonUtilsFnPalette,
	HSL,
	Palette,
	PaletteItem
} from '../../types/index';
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { logger } from '../../logger/index.js';

const mode = data.mode;
const logMode = mode.logging;

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
		metadata: {
			name: '',
			timestamp: core.getFormattedTimestamp(),
			swatches: numBoxes,
			type,
			flags: {
				enableAlpha: enableAlpha,
				limitDarkness: limitDark,
				limitGrayness: limitGray,
				limitLightness: limitLight
			},
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
		const clonedColor: Color = core.guards.isColor(color)
			? core.base.clone(color)
			: core.convert.colorStringToColor(color);

		if (!core.validate.colorValues(clonedColor)) {
			if (logMode.errors) logger.error('Invalid color values.');

			helpers.dom.showToast('Invalid color.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor =
			core.convert.colorToCSSColorString(clonedColor);

		if (!mode.quiet && logMode.info && logMode.verbosity > 0)
			logger.info(
				`Adding CSS-formatted color to DOM ${stringifiedColor}`
			);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		if (logMode.errors)
			logger.error(`Failed to populate color text output box: ${error}`);

		return;
	}
}

export const palette: CommonUtilsFnPalette = {
	createObject,
	populateOutputBox
} as const;
