import { random } from '../utils/color-randomizer';
import { genAllColorValues } from '../color-conversion/conversion';
import { populateColorTextOutputBox } from '../dom/dom-main';
import * as types from '../index';

export function genTetradicHues(baseHue: number) {
	const tetradicHues = [];
	const hue1 = baseHue;
	const hue2 = (hue1 + 180) % 360;
	const randomOffset = Math.floor(Math.random() * 46) + 20;
	const distance = 90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);
	const hue3 = (hue1 + distance) % 360;
	const hue4 = (hue3 + 180) % 360;

	tetradicHues.push(hue1, hue2, hue3, hue4);

	console.log('tetradicHues: ', tetradicHues);

	return tetradicHues;
}

export function genTetradicPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	if (numBoxes < 4) {
		window.alert(
			'To generate a tetradic palette, please select a number of swatches greater than 3'
		);
		return [];
	}

	const colors: types.Color[] = [];
	let baseColor: types.Color;

	if (customColor) {
		baseColor = customColor;
	} else {
		const randomColor = random.randomColor(initialColorSpace);
		const colorValues = genAllColorValues(randomColor);

		baseColor =
			colorValues[initialColorSpace] ?? Object.values(colorValues)[0];

		if (!baseColor) {
			throw new Error(
				`Failed to generate a valid color in ${initialColorSpace}`
			);
		}
	}

	const tetradicHues = genTetradicHues((baseColor as types.HSL).value.hue);

	// add the base color
	colors.push(baseColor);

	// generate main tetradic colors (2-4)
	tetradicHues.slice(1).forEach(hue => {
		const {
			value: { saturation, lightness }
		} = random.randomSL();
		const tetradicColor = genAllColorValues({
			value: {
				hue,
				saturation,
				lightness
			},
			format: 'hsl'
		}).hsl;

		if (tetradicColor) {
			colors.push(tetradicColor);
		}
	});

	// generate additional variations if needed
	while (colors.length < numBoxes) {
		const baseColorIndex = Math.floor(Math.random() * 4);
		const baseHue = tetradicHues[baseColorIndex];
		const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;

		let {
			value: { saturation, lightness }
		} = random.randomSL();

		saturation = Math.min(100, Math.max(0, saturation));
		lightness = Math.min(100, Math.max(0, lightness));

		const additionalColor = genAllColorValues({
			value: {
				hue,
				saturation,
				lightness
			},
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
			colorBox.style.backgroundColor = hexColor.value.hex;

			if (color.format === 'hsl') {
				populateColorTextOutputBox(color as types.HSL, index + 1);
			} else {
				console.warn(`Skipping non-HSL color at index ${index + 1}`);
			}
		}
	});

	return colors;
}
