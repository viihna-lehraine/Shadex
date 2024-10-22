import { genAllColorValues } from '../color-conversion/conversion';
import { populateColorTextOutputBox } from '../dom/dom-main';
import { random } from '../utils/color-randomizer';
import * as types from '../index';

export function genTriadicHues(baseHue: number): number[] {
	const triadicHues: number[] = [];
	const increments = [120, 240];

	increments.forEach(increment => {
		triadicHues.push((baseHue + increment) % 360);
	});

	return triadicHues;
}

export function genTriadicPalette(
	numBoxes: number,
	customColor: types.ColorData | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.ColorData[] {
	if (numBoxes < 3) {
		window.alert(
			'To generate a triadic palette, please select a number of swatches greater than 2'
		);
		return [];
	}

	const colors: types.ColorData[] = [];
	let baseColor: types.ColorData;

	// generate or use the custom base color
	if (customColor) {
		baseColor = customColor;
	} else {
		const randomColor = random.randomColor(initialColorSpace);
		const colorValues = genAllColorValues(randomColor);

		const generatedColor = colorValues[initialColorSpace];
		if (!generatedColor) {
			throw new Error(
				`Failed to generate a valid color in ${initialColorSpace}`
			);
		}

		baseColor = generatedColor;
	}

	const triadicHues = genTriadicHues((baseColor as types.HSL).hue);

	// add the base color to the palette
	colors.push(baseColor);

	// generate the main triadic colors
	triadicHues.forEach(hue => {
		const { saturation, lightness } = random.randomSL();
		const color = genAllColorValues({
			hue,
			saturation,
			lightness,
			format: 'hsl'
		}).hsl;

		if (color) {
			colors.push(color);
		}
	});

	// generate additional colors if needed
	while (colors.length < numBoxes) {
		const baseColorIndex = Math.floor(Math.random() * 3); // randomly select one of the first three colors
		const baseHue = triadicHues[baseColorIndex];
		const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;

		let { saturation, lightness } = random.randomSL();
		saturation = Math.min(100, Math.max(0, saturation));
		lightness = Math.min(100, Math.max(0, lightness));

		const additionalColor = genAllColorValues({
			hue,
			saturation,
			lightness,
			format: 'hsl'
		}).hsl;

		if (additionalColor) {
			colors.push(additionalColor);
		}
	}

	// update the DOM with generated colors
	colors.forEach((color, index) => {
		const colorBox = document.getElementById(`color-box-${index + 1}`);
		if (colorBox) {
			const hexColor = genAllColorValues(color).hex as types.Hex;
			colorBox.style.backgroundColor = hexColor.hex;
			populateColorTextOutputBox(color as types.HSL, index + 1);
		}
	});

	return colors;
}
