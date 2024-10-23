import { genAllColorValues } from '../color-conversion/conversion';
import { random } from '../utils/color-randomizer';
import { populateColorTextOutputBox } from '../dom/dom-main';
import * as types from '../index';

export function genMonochromaticPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	if (numBoxes < 2) {
		window.alert(
			'To generate a monochromatic palette, please select a number of swatches greater than 1'
		);
		return [];
	}

	const colors: types.Color[] = [];
	const baseColorValues = customColor
		? genAllColorValues(customColor)
		: genAllColorValues(random.randomColor(initialColorSpace));
	const baseHSL = baseColorValues.hsl as types.HSL;

	if (!baseHSL) {
		throw new Error(
			'Base HSL value is required for a monochromatic palette.'
		);
	}

	colors.push(baseHSL);

	for (let i = 1; i < numBoxes; i++) {
		const slValues = random.randomSL();
		const monoColorValues = genAllColorValues({
			value: {
				hue: baseHSL.value.hue,
				saturation: slValues.value.saturation,
				lightness: slValues.value.lightness
			},
			format: 'hsl'
		});

		const monoHSL = monoColorValues.hsl as types.HSL;

		colors.push(monoHSL);

		const colorBox = document.getElementById(`color-box-${i + 1}`);
		if (colorBox) {
			const hexColor = monoColorValues.hex as types.Hex;
			colorBox.style.backgroundColor = hexColor.value.hex;

			populateColorTextOutputBox(monoHSL, i + 1);
		}
	}

	return colors;
}
