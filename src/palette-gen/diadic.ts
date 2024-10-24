import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import * as types from '../index/types';
import { paletteHelpers } from '../helpers/palette';
import { random } from '../utils/color-randomizer';

export function genDiadicHues(baseHue: number): number[] {
	try {
		const diadicHues = [];
		const randomDistance = paletteHelpers.getWeightedRandomInterval();
		const hue1 = baseHue;
		const hue2 = (hue1 + randomDistance) % 360;

		diadicHues.push(hue1, hue2);

		return diadicHues;
	} catch (error) {
		console.error(`Error generating diadic hues: ${error}`);
		return [];
	}
}

export function genDiadicPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		if (numBoxes < 2) {
			window.alert(
				'To generate a diadic palette, please select a number of swatches greater than 1'
			);
			return [];
		}

		const colors: types.Color[] = [];

		// generate or retrieve base color
		const baseColorValues = genAllColorValues(
			customColor ?? random.randomColor(initialColorSpace)
		);
		const baseColor = baseColorValues[initialColorSpace] as types.Color;

		if (!baseColor) {
			throw new Error('Base color is missing in the generated values');
		}

		// add base color to the palette
		colors.push(baseColor);

		// generate diadic hues based on the base hue
		const baseHSL = baseColorValues.hsl as types.HSL;
		const diadicHues = baseHSL
			? genDiadicHues(baseHSL.value.hue)
			: [0, 180];

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
		const diadicColor = diadicColorValues[initialColorSpace] as types.Color;

		if (diadicColor) {
			colors.push(diadicColor);
		}

		// if additional boxes are needed, generate variations
		while (colors.length < numBoxes) {
			const baseColorIndex = Math.floor(Math.random() * 2); // select base or diadic color
			const baseHue = diadicHues[baseColorIndex];

			const newHue =
				(baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;
			const {
				value: { saturation, lightness }
			} = random.randomSL();

			const newColorValues = genAllColorValues({
				value: { hue: newHue, saturation, lightness },
				format: 'hsl'
			});

			const newColor = newColorValues[initialColorSpace] as types.Color;
			if (newColor) {
				colors.push(newColor);
			}
		}

		// update the DOM with generated colors
		colors.forEach((color, index) => {
			const colorBox = document.getElementById(`color-box-${index + 1}`);
			const colorValues = genAllColorValues(color);

			const hexColor = colorValues.hex as types.Hex;
			if (colorBox && hexColor) {
				colorBox.style.backgroundColor = hexColor.value.hex;
				dom.populateColorTextOutputBox(color, index + 1);
			}
		});

		return colors;
	} catch (error) {
		console.error(`Error generating diadic palette: ${error}`);
		return [];
	}
}
