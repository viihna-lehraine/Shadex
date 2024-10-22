import { genAllColorValues } from '../color-conversion/conversion';
import { populateColorTextOutputBox } from '../dom/dom-main';
import { random } from '../utils/color-randomizer';
import * as types from '../index';
import { paletteHelpers } from '../helpers/palette';

export function genComplementaryPalette(
	numBoxes: number,
	baseColor: types.ColorData | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.ColorData[] {
	if (numBoxes < 2) {
		window.alert(
			'To generate a complementary palette, please select a number of swatches greater than 1'
		);

		return [];
	}

	const colors = [];

	const baseColorValues = baseColor
		? genAllColorValues(baseColor)
		: genAllColorValues(random.randomColor(initialColorSpace));
	const baseHSL = baseColorValues.hsl as types.HSL;

	if (!baseHSL) {
		throw new Error('Base HSL color is missing in the generated values');
	}

	colors.push(baseHSL);

	const complementaryHue = (baseHSL.hue + 180) % 360;

	for (let i = 2; i <= numBoxes; i++) {
		const adjustedHSLColor = paletteHelpers.adjustSL({
			hue: complementaryHue,
			saturation: baseHSL.saturation,
			lightness: baseHSL.lightness,
			format: 'hsl'
		});

		const complementaryColorValues = genAllColorValues(adjustedHSLColor);
		const complementaryHSL = complementaryColorValues.hsl as types.HSL;

		if (complementaryHSL) {
			colors.push(complementaryHSL);
		}

		const colorBox = document.getElementById(`color-box-${i}`);

		if (colorBox) {
			const hexValue = complementaryColorValues.hex as
				| types.Hex
				| undefined;
			colorBox.style.backgroundColor = hexValue ? hexValue.hex : '';

			populateColorTextOutputBox(complementaryHSL, i);
		}
	}

	return colors;
}
