import { genAllColorValues } from '../color-conversion/conversion';
import { populateColorTextOutputBox } from '../dom/dom-main';
import { random } from '../utils/color-randomizer';
import * as types from '../index';

export function genHexadicHues(hsl: types.HSL): number[] {
	const hexadicHues: number[] = [];
	const baseHue = hsl.hue;
	const hue1 = baseHue;
	const hue2 = (hue1 + 180) % 360;
	const randomDistance = Math.floor(Math.random() * 71 + 10);
	const hue3 = (hue1 + randomDistance) % 360;
	const hue4 = (hue3 + 180) % 360;
	const hue5 = (hue1 + 360 - randomDistance) % 360;
	const hue6 = (hue5 + 180) % 360;

	hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);

	return hexadicHues;
}

export function genHexadicPalette(
	numBoxes: number,
	customColor: types.ColorData | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.ColorData[] {
	if (numBoxes < 6) {
		window.alert(
			'To generate a hexadic palette, please select a number of swatches greater than 5'
		);
		return [];
	}

	const colors: types.ColorData[] = [];

	let baseColorValues = customColor
		? genAllColorValues(customColor)
		: genAllColorValues(random.randomColor(initialColorSpace));

	const baseHSL = baseColorValues.hsl as types.HSL;

	if (!baseHSL) {
		throw new Error(
			'HSL values are required to generate the hexadic palette'
		);
	}

	colors.push(baseHSL);

	const hexadicHues = genHexadicHues(baseHSL);

	for (let i = 0; i < numBoxes; i++) {
		const hue = hexadicHues[i % 6];
		let { saturation, lightness } = random.randomSL();

		const hexadicColorValues = genAllColorValues({
			hue,
			saturation,
			lightness,
			format: 'hsl'
		});
		const hexadicHSL = hexadicColorValues.hsl as types.HSL;

		colors.push(hexadicHSL);

		const colorBox = document.getElementById(`color-box-${i + 1}`);

		if (colorBox) {
			const hexColor = hexadicColorValues.hex as types.Hex;
			colorBox.style.backgroundColor = hexColor.hex;

			populateColorTextOutputBox(hexadicHSL, i + 1);
		}
	}

	return colors;
}
