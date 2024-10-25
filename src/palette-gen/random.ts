import { genAllColorValues } from '../color-conversion/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';

export function genRandomPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	colorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		let clonedCustomColor: types.Color | null = null;

		if (customColor) {
			if (!paletteHelpers.validateColorValues(customColor)) {
				console.error(
					`Invalid custom color value ${JSON.stringify(customColor)}`
				);

				return [];
			}

			clonedCustomColor = core.clone(customColor);
		}

		const colors: types.Color[] = [];

		for (let i = 0; i < numBoxes; i++) {
			const colorValues =
				i === 0 && clonedCustomColor
					? genAllColorValues(clonedCustomColor)
					: genAllColorValues(random.randomColor(colorSpace));
			const selectedColor = colorValues[colorSpace];

			if (selectedColor) {
				colors.push(selectedColor);
			} else {
				console.warn(
					`Skipping color at index ${i} due to missing ${colorSpace} value.`
				);
			}
		}

		console.log(`Generated random palette: ${JSON.stringify(colors)}`);

		return colors;
	} catch (error) {
		console.error(`Error generating random palette: ${error}`);

		return [];
	}
}
