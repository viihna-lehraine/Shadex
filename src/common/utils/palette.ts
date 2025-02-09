// File: common/utils/palette.js

import {
	Color,
	Color_StringProps,
	CommonFn_MasterInterface,
	Palette,
	PaletteArgs
} from '../../types/index';
import { coreUtils } from '../core/core.js';
import { createLogger } from '../../logger/index.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'common/utils/palette.js';

const logger = await createLogger();

function createObject(args: PaletteArgs): Palette {
	return {
		id: `${args.type}_${args.paletteID}`,
		items: args.items,
		metadata: {
			name: '',
			timestamp: coreUtils.getFormattedTimestamp(),
			swatches: args.swatches,
			type: args.type,
			flags: {
				limitDark: args.limitDark,
				limitGray: args.limitGray,
				limitLight: args.limitLight
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

		if (logMode.verbosity > 1)
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
