import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';

export function genSplitComplementaryHues(baseHue: number): number[] {
	try {
		const modifier = Math.floor(Math.random() * 11) + 20;

		return [
			(baseHue + 180 + modifier) % 360,
			(baseHue + 180 - modifier + 360) % 360
		];
	} catch (error) {
		console.error(`Error generating split complementary hues: ${error}`);
		return [];
	}
}

export function genSplitComplementaryPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		if (numBoxes < 3) {
			window.alert(
				'To generate a split complementary palette, please select at least 3 swatches.'
			);
			return [];
		}

		const colors: types.Color[] = [];
		let baseColor: types.Color;

		// retrieve base color, either from input or randomly generated
		baseColor = customColor ?? random.randomColor(initialColorSpace);

		const baseColorValues = genAllColorValues(baseColor);
		const baseHSL = baseColorValues.hsl as types.HSL;

		if (!baseHSL) {
			throw new Error('Base HSL color is required for this palette.');
		}

		colors.push(baseHSL);

		// generate split complementary hues
		const splitHues = genSplitComplementaryHues(baseHSL.value.hue);

		// generate the complementary colors and push them to the palette
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

		// generate additional colors if needed to match `numBoxes`
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

		// update the DOM with the generated colors
		colors.forEach((color, index) => {
			const colorBox = document.getElementById(`color-box-${index + 1}`);

			if (colorBox) {
				const hexColor = genAllColorValues(color).hex as types.Hex;
				colorBox.style.backgroundColor = hexColor.value.hex;

				dom.populateColorTextOutputBox(color, index + 1);
			}
		});

		return colors;
	} catch (error) {
		console.error('Error generating split complementary palette:', error);
		return [];
	}
}
