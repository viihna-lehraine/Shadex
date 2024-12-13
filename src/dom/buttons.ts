// File: src/dom/buttons.js

import { DOMButtonsFnInterface, PaletteOptions } from '../index/index.js';
import { core, superUtils } from '../common/index.js';
import { data } from '../data/index.js';
import { mode } from '../data/mode/index.js';
import { start } from '../palette/index.js';

const buttonDebounce = data.consts.debounce.button || 300;

function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const button = document.getElementById(id);

	if (button) {
		button.addEventListener(eventType, callback);
	} else if (mode.warnLogs) {
		if ((mode.debug || mode.verbose) && mode.warnLogs)
			console.warn(`Button with id "${id}" not found.`);
	}
}

const handlePaletteGen = core.base.debounce(() => {
	try {
		const params = superUtils.dom.getGenButtonArgs();

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

		start.genPalette(options);
	} catch (error) {
		console.error(`Failed to handle generate button click: ${error}`);
	}
}, buttonDebounce);

export const buttons: DOMButtonsFnInterface = {
	addEventListener,
	handlePaletteGen
};
