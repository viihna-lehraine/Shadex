// File: common/utils/palette.js

import {
	Color,
	Color_StringProps,
	CommonFn_MasterInterface,
	Palette,
	PaletteItem
} from '../../types/index';
import { coreUtils } from '../core.js';
import { createLogger } from '../../logger/index.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'common/utils/palette.js';

const logger = await createLogger();

function createObject(
	type: string,
	items: PaletteItem[],
	swatches: number,
	paletteID: number,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Palette {
	return {
		id: `${type}_${paletteID}`,
		items,
		metadata: {
			name: '',
			timestamp: coreUtils.getFormattedTimestamp(),
			swatches,
			type,
			flags: {
				limitDarkness: limitDark,
				limitGrayness: limitGray,
				limitLightness: limitLight
			}
		}
	};
}

export async function populateOutputBox(
	color: Color | Color_StringProps,
	boxNumber: number
): Promise<void> {
	const thisMethod = 'populateOutputBox()';

	try {
		const clonedColor: Color = coreUtils.guards.isColor(color)
			? coreUtils.base.clone(color)
			: await coreUtils.convert.colorStringToColor(color);

		if (!coreUtils.validate.colorValues(clonedColor)) {
			if (logMode.error)
				logger.error(
					'Invalid color values.',
					`${thisModule} > ${thisMethod}`
				);

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor =
			await coreUtils.convert.colorToCSSColorString(clonedColor);

		if (!mode.quiet && logMode.info && logMode.verbosity > 0)
			logger.info(
				`Adding CSS-formatted color to DOM ${stringifiedColor}`,
				`${thisModule} > ${thisMethod}`
			);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to populate color text output box: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return;
	}
}

export const paletteUtils: CommonFn_MasterInterface['utils']['palette'] = {
	createObject,
	populateOutputBox
} as const;
