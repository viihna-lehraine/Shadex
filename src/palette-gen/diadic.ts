import { genAllColorValues } from '../color-conversion/conversion';
import { populateColorTextOutputBox } from '../dom/dom-main';
import { random } from '../utils/color-randomizer';
import * as types from '../index';
import { paletteHelpers } from '../helpers/palette';

export function genDiadicHues(baseHue: number): number[] {
	const diadicHues = [];
	const randomDistance = paletteHelpers.getWeightedRandomInterval();
	const hue1 = baseHue;
	const hue2 = (hue1 + randomDistance) % 360;

	diadicHues.push(hue1, hue2);

	return diadicHues;
}

export function genDiadicPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	if (numBoxes < 2) {
		window.alert(
			'To generate a diadic palette, please select a number of swatches greater than 1'
		);
		return [];
	}

	const colors: types.Color[] = [];

	// generate or retrieve base color
	const baseColorValues = customColor
		? genAllColorValues(customColor)
		: genAllColorValues(random.randomColor(initialColorSpace));

	const baseHSL = baseColorValues.hsl as types.HSL;

	if (!baseHSL) {
		throw new Error('Base HSL color is missing');
	}

	// add base color to the palette
	colors.push(baseHSL);

	// generate diadic hues based on the base hue
	const diadicHues = genDiadicHues(baseHSL.value.hue);

	// generate the second diadic color
	const hue = diadicHues[1];
	const sl = random.randomSL();
	const diadicColorValues = genAllColorValues({
		value: {
			hue,
			saturation: sl.value.saturation,
			lightness: sl.value.lightness
		},
		format: 'hsl'
	});

	const diadicHSL = diadicColorValues.hsl as types.HSL;
	colors.push(diadicHSL);

	// if additional boxes are needed, generate variations
	while (colors.length < numBoxes) {
		const baseColorIndex = Math.floor(Math.random() * 2); // select base or diadic color
		const baseHue = diadicHues[baseColorIndex];

		const newHue =
			(baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;
		let {
			value: { saturation, lightness }
		} = random.randomSL();

		const newColorValues = genAllColorValues({
			value: {
				hue: newHue,
				saturation,
				lightness
			},
			format: 'hsl'
		});

		const newHSL = newColorValues.hsl as types.HSL;
		colors.push(newHSL);
	}

	// update the DOM with generated colors
	colors.forEach((color, index) => {
		const colorBox = document.getElementById(`color-box-${index + 1}`);
		const colorValues = genAllColorValues(color);
		const hslColor = colorValues.hsl as types.HSL;

		if (!hslColor) {
			console.warn(
				`Skipping color at index ${index} due to missing HSL value.`
			);
			return;
		}

		if (colorBox) {
			const hexColor = colorValues.hex as types.Hex;
			colorBox.style.backgroundColor = hexColor.value.hex;

			populateColorTextOutputBox(hslColor, index + 1);
		}
	});

	return colors;
}
