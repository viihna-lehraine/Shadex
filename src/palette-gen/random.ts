import { genAllColorValues } from '../color-conversion/conversion';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';

export function genRandomPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		const colors: types.Color[] = [];

		for (let i = 0; i < numBoxes; i++) {
			const colorValues =
				i === 0 && customColor
					? genAllColorValues(customColor)
					: genAllColorValues(random.randomColor(initialColorSpace));

			const selectedColor = colorValues[initialColorSpace];

			if (selectedColor) {
				colors.push(selectedColor);
			} else {
				console.warn(
					`Skipping color at index ${i} due to missing ${initialColorSpace} value.`
				);
			}
		}

		return colors;
	} catch (error) {
		console.error(`Error generating random palette: ${error}`);
		return [];
	}
}
