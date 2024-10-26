import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';

export function genComplementaryPalette(
	numBoxes: number,
	customColor: colors.Color | null = null,
	colorSpace: colors.ColorSpace = 'hex'
): colors.Color[] {
	try {
		let clonedCustomColor: colors.Color | null = null;

		if (customColor) {
			if (!paletteHelpers.validateColorValues(customColor)) {
				console.error(
					`Invalid custom color value ${JSON.stringify(customColor)}`
				);

				return [];
			}

			clonedCustomColor = core.clone(customColor);
		}

		if (numBoxes < 2) {
			window.alert(
				'To generate a complementary palette, please select a number of swatches greater than 1'
			);

			return [];
		}

		const colors = [];

		const baseColorValues = genAllColorValues(
			clonedCustomColor ?? random.randomColor(colorSpace)
		);
		const baseHSL = baseColorValues.hsl as colors.HSL;

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
				colorSpace
			] as colors.Color;

			if (complementaryColor) {
				colors.push(complementaryColor);
			}

			const colorBox = document.getElementById(`color-box-${i}`);

			if (colorBox) {
				const hexValue = complementaryColorValues.hex as
					| colors.Hex
					| undefined;
				colorBox.style.backgroundColor = hexValue
					? hexValue.value.hex
					: '';

				dom.populateColorTextOutputBox(complementaryColor, i);
			}
		}

		console.log(
			`Generated complementary palette: ${JSON.stringify(colors)}`
		);

		return colors;
	} catch (error) {
		console.error('Error generating complementary palette:', error);
		return [];
	}
}
