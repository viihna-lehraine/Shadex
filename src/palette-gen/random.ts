import { genAllColorValues } from '../color-conversion/conversion';
import { random } from '../utils/color-randomizer';
import * as types from '../index';

export function genRandomPalette(
	numBoxes: number,
	customColor: types.ColorData | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.ColorData[] {
	const colors: types.ColorData[] = [];

	for (let i = 0; i < numBoxes; i++) {
		let colorValues: Partial<Record<types.ColorFormats, types.ColorData>>;

		if (i === 0 && customColor) {
			colorValues = genAllColorValues(customColor);
		} else {
			const baseColor = random.randomColor(initialColorSpace);
			colorValues = genAllColorValues(baseColor);
		}

		const selectedColor = colorValues[initialColorSpace];

		if (selectedColor) {
			colors.push(selectedColor);
		}
	}

	return colors;
}
