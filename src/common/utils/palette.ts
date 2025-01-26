// File: src/common/utils/palette.js

import {
	Color,
	ColorString,
	CommonFunctionsMasterInterface,
	Palette,
	PaletteItem
} from '../../types/index';
import { core } from '../core/index.js';
import { createLogger } from '../../logger/index.js';
import { mode } from '../data/base.js';
import { helpers } from '../helpers/index.js';

const logger = await createLogger();

const logMode = mode.logging;

function createObject(
	type: string,
	items: PaletteItem[],
	swatches: number,
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
			swatches,
			type,
			flags: {
				enableAlpha: enableAlpha,
				limitDarkness: limitDark,
				limitGrayness: limitGray,
				limitLightness: limitLight
			},
			customColor: {
				colors: items[0]?.colors || {},
				colorStrings: items[0]?.colorStrings || {},
				cssStrings: items[0]?.cssStrings || {}
			}
		}
	};
}

export async function populateOutputBox(
	color: Color | ColorString,
	boxNumber: number
): Promise<void> {
	try {
		const clonedColor: Color = core.guards.isColor(color)
			? core.base.clone(color)
			: await core.convert.colorStringToColor(color);

		if (!core.validate.colorValues(clonedColor)) {
			if (logMode.error)
				logger.error(
					'Invalid color values.',
					'common > utils > palette > populateOutputBox()'
				);

			helpers.dom.showToast('Invalid color.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor =
			await core.convert.colorToCSSColorString(clonedColor);

		if (!mode.quiet && logMode.info && logMode.verbosity > 0)
			logger.info(
				`Adding CSS-formatted color to DOM ${stringifiedColor}`,
				'common > utils > palette > populateOutputBox()'
			);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to populate color text output box: ${error}`,
				'common > utils > palette > populateOutputBox()'
			);

		return;
	}
}

export const palette: CommonFunctionsMasterInterface['utils']['palette'] = {
	createObject,
	populateOutputBox
} as const;
