// File: src/dom/history.js

import { ColorSpace, DOMHistoryFnInterface, Palette } from '../index/index.js';

let paletteHistory: Palette[] = [];

function addPalette(palette: Palette): void {
	paletteHistory.unshift(palette);

	if (paletteHistory.length >= 50) paletteHistory.pop();
}

function renderPalette(displayFormat: ColorSpace): void {
	paletteHistory.forEach(palette => {
		console.log(`Palette ID: ${palette.id}`);

		console.log(`${displayFormat}`);

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
