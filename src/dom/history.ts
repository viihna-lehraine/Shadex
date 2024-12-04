import { ColorSpace } from '../index/colors';
import { Palette } from '../index/palette';

let paletteHistory: Palette[] = [];

export function addPaletteToHistory(palette: Palette): void {
	paletteHistory.unshift(palette);

	if (paletteHistory.length >= 50) paletteHistory.pop();
}

export function renderPaletteHistory(displayFormat: ColorSpace): void {
	paletteHistory.forEach(palette => {
		console.log(`Palette ID: ${palette.id}`);

		console.log(`${displayFormat}`);

		// palette.items.forEach(item => {
		// 	const colorString = palette.items.
		// });
	});
}
