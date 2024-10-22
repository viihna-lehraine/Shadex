import { genAllColorValues } from '../color-conversion/conversion';
import { getWeightedRandomInterval } from '../utils/math';
import { populateColorTextOutputBox } from '../dom/dom-main';
import { random } from '../utils/color-randomizer';
import * as types from '../index';

export function genDiadicHues(baseHue: number): number[] {
	const diadicHues = [];
	const randomDistance = getWeightedRandomInterval();
	const hue1 = baseHue;
	const hue2 = (hue1 + randomDistance) % 360;

	diadicHues.push(hue1, hue2);

	return diadicHues;
}

export function genDiadicPalette(
	numBoxes: number,
	customColor: types.ColorData | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.ColorData[] {
	if (numBoxes < 2) {
		window.alert(
			'To generate a diadic palette, please select a number of swatches greater than 1'
		);
		return [];
	}

	const colors: types.ColorData[] = [];

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
	const diadicHues = genDiadicHues(baseHSL.hue);

	// generate the second diadic color
	const hue = diadicHues[1];
	const sl = random.randomSL();
	const diadicColorValues = genAllColorValues({
		hue,
		saturation: sl.saturation,
		lightness: sl.lightness,
		format: 'hsl'
	});

	const diadicHSL = diadicColorValues.hsl as types.HSL;
	colors.push(diadicHSL);

	// if additional boxes are needed, generate variations
	while (colors.length < numBoxes) {
		const baseColorIndex = Math.floor(Math.random() * 2); // Select base or diadic color
		const baseHue = diadicHues[baseColorIndex];

		const newHue =
			(baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;
		let { saturation, lightness } = random.randomSL();

		const newColorValues = genAllColorValues({
			hue: newHue,
			saturation,
			lightness,
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
			colorBox.style.backgroundColor = hexColor.hex;

			populateColorTextOutputBox(hslColor, index + 1);
		}
	});

	return colors;
}
