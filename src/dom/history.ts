import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as palette from '../index/palette';

let paletteHistory: palette.Palette[] = [];

function addPaletteToHistory(palette: palette.Palette): void {
	paletteHistory.unshift(palette);

	if (paletteHistory.length >= 50) paletteHistory.pop();
}

function renderPaletteHistory(displayFormat: colors.ColorSpace): void {
	paletteHistory.forEach(palette => {
		console.log(`Palette ID: ${palette.id}`);

		console.log(`${displayFormat}`);

		// palette.items.forEach(item => {
		// 	const colorString = palette.items.
		// });
	});
}

export const history: fnObjects.History = {
	addPaletteToHistory,
	renderPaletteHistory
};
