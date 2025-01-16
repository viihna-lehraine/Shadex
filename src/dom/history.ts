// File: src/dom/history.js

import { ColorSpace, DOMHistoryFnInterface, Palette } from '../index/index.js';
import { data } from '../data/index.js';
import { log } from '../classes/logger/index.js';

const logMode = data.mode.logging;
const mode = data.mode;

let paletteHistory: Palette[] = [];

function addPalette(palette: Palette): void {
	paletteHistory.unshift(palette);

	if (paletteHistory.length >= 50) paletteHistory.pop();
}

function renderPalette(displayFormat: ColorSpace): void {
	paletteHistory.forEach(palette => {
		if (logMode.info && mode.debug) {
			log.info(`Palette ID: ${palette.id}`);
			log.info(`${displayFormat}`);
		}

		// *DEV-NOTE* FINISH THIS
		// palette.items.forEach(item => {
		// 	const colorString = palette.items.
		// });
	});
}

export const history: DOMHistoryFnInterface = {
	addPalette,
	renderPalette
};
