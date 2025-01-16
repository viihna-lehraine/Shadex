// File: src/common/utils/palette.js

import {
	Color,
	ColorString,
	CommonUtilsFnPalette,
	HSL,
	Palette,
	PaletteItem
} from '../../index';
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { log } from '../../classes/logger/index.js';

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
			if (logMode.errors) log.error('Invalid color values.');

			helpers.dom.showToast('Invalid color.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = core.convert.toCSSColorString(clonedColor);

		if (!mode.quiet && logMode.info && logMode.verbosity > 0)
			log.info(`Adding CSS-formatted color to DOM ${stringifiedColor}`);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		if (logMode.errors)
			log.error(`Failed to populate color text output box: ${error}`);

		return;
	}
}

export const palette: CommonUtilsFnPalette = {
	createObject,
	populateOutputBox
} as const;
