import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';

export function genComplementaryPalette(
	numBoxes: number,
	baseColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		if (numBoxes < 2) {
			window.alert(
				'To generate a complementary palette, please select a number of swatches greater than 1'
			);

			return [];
		}

		const colors = [];

		const baseColorValues = genAllColorValues(
			baseColor ?? random.randomColor(initialColorSpace)
		);
		const baseHSL = baseColorValues.hsl as types.HSL;

		if (!baseHSL) {
			throw new Error(
				'Base HSL color is missing in the generated values'
			);
		}

		colors.push(baseHSL);

		const complementaryHue = (baseHSL.value.hue + 180) % 360;

		for (let i = 2; i <= numBoxes; i++) {
			const adjustedHSLColor = paletteHelpers.adjustSL({
				value: {
					hue: complementaryHue,
					saturation: baseHSL.value.saturation,
					lightness: baseHSL.value.lightness
				},
				format: 'hsl'
			});

			const complementaryColorValues =
				genAllColorValues(adjustedHSLColor);
			const complementaryColor = complementaryColorValues[
				initialColorSpace
			] as types.Color;

			if (complementaryColor) {
				colors.push(complementaryColor);
			}

			const colorBox = document.getElementById(`color-box-${i}`);

			if (colorBox) {
				const hexValue = complementaryColorValues.hex as
					| types.Hex
					| undefined;
				colorBox.style.backgroundColor = hexValue
					? hexValue.value.hex
					: '';

				dom.populateColorTextOutputBox(complementaryColor, i);
			}
		}

		return colors;
	} catch (error) {
		console.error('Error generating complementary palette:', error);
		return [];
	}
}
