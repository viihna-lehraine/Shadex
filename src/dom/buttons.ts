// File: src/dom/buttons.ts

import { PaletteOptions } from '../index';
import { core, superUtils } from '../common';
import { config } from '../config';
import { start } from '../palette/start';

const buttonDebounce = config.consts.debounce.button || 300;

export const handlePaletteGen = core.debounce(() => {
	try {
		const params = superUtils.dom.getGenButtonParams();

		if (!params) {
			console.error('Failed to retrieve generateButton parameters');

			return;
		}

		const {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = params;

		if (!paletteType || !numBoxes) {
			console.error('paletteType and/or numBoxes are undefined');

			return;
		}

		const options: PaletteOptions = {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		};

		start.paletteGen(options);
	} catch (error) {
		console.error(`Failed to handle generate button click: ${error}`);
	}
}, buttonDebounce);

export const buttons = {
	handlePaletteGen
};
