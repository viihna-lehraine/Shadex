import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';

export function genTriadicHues(baseHue: number): number[] {
	try {
		return [120, 240].map(increment => (baseHue + increment) % 360);
	} catch (error) {
		console.error(`Error generating triadic hues: ${error}`);
		return [];
	}
}

export function genTriadicPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		if (numBoxes < 3) {
			window.alert(
				'To generate a triadic palette, please select at least 3 swatches.'
			);
			return [];
		}

		const colors: types.Color[] = [];
		const baseColor = customColor ?? random.randomColor(initialColorSpace);

		const baseColorValues = genAllColorValues(baseColor);
		const baseHSL = baseColorValues.hsl as types.HSL;

		if (!baseHSL) {
			throw new Error('Base HSL value is required.');
		}

		colors.push(baseHSL);

		const triadicHues = genTriadicHues(baseHSL.value.hue);

		// generate triadic colors and add to palette
		triadicHues.forEach(hue => {
			const sl = random.randomSL();
			const color = genAllColorValues({
				value: { hue, ...sl.value },
				format: 'hsl'
			}).hsl;

			if (color) {
				colors.push(color);
			}
		});

		// generate additional colors if needed
		while (colors.length < numBoxes) {
			const baseHue = triadicHues[Math.floor(Math.random() * 3)];
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

		// update the DOM with generated colors
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
		console.error(`Error generating triadic palette: ${error}`);
		return [];
	}
}
