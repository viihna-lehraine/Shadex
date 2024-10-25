import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';

export function genSplitComplementaryHues(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);
		const modifier = Math.floor(Math.random() * 11) + 20;

		return [
			(clonedBaseHue + 180 + modifier) % 360,
			(clonedBaseHue + 180 - modifier + 360) % 360
		];
	} catch (error) {
		console.error(`Error generating split complementary hues: ${error}`);

		return [];
	}
}

export function genSplitComplementaryPalette(
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

		if (numBoxes < 3) {
			window.alert(
				'To generate a split complementary palette, please select at least 3 swatches.'
			);

			return [];
		}

		const colors: types.Color[] = [];
		let baseColor: types.Color;

		baseColor = clonedCustomColor ?? random.randomColor(colorSpace);

		const baseColorValues = genAllColorValues(baseColor);
		const baseHSL = baseColorValues.hsl as types.HSL;

		if (!baseHSL) {
			throw new Error('Base HSL color is required for this palette.');
		}

		colors.push(baseHSL);

		const splitHues = genSplitComplementaryHues(baseHSL.value.hue);

		splitHues.forEach(hue => {
			const sl = random.randomSL();
			const complementaryColor = genAllColorValues({
				value: { hue, ...sl.value },
				format: 'hsl'
			}).hsl;

			if (complementaryColor) {
				colors.push(complementaryColor);
			}
		});

		while (colors.length < numBoxes) {
			const randomIndex = Math.floor(Math.random() * 2) + 1;
			const baseHue = splitHues[randomIndex - 1];
			const hue =
				(baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;
			const sl = random.randomSL();
			const additionalColor = genAllColorValues({
				value: { hue, ...sl.value },
				format: 'hsl'
			}).hsl;

			if (additionalColor) {
				colors.push(additionalColor);
			}
		}

		colors.forEach((color, index) => {
			const colorBox = document.getElementById(`color-box-${index + 1}`);

			if (colorBox) {
				const hexColor = genAllColorValues(color).hex as types.Hex;

				colorBox.style.backgroundColor = hexColor.value.hex;

				dom.populateColorTextOutputBox(color, index + 1);
			}
		});

		console.log(
			`Generated split complementary palette: ${JSON.stringify(colors)}`
		);

		return colors;
	} catch (error) {
		console.error('Error generating split complementary palette:', error);

		return [];
	}
}
