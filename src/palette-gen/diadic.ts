import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import * as types from '../index/types';
import { paletteHelpers } from '../helpers/palette';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';

export function genDiadicHues(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);
		const diadicHues = [];
		const randomDistance = paletteHelpers.getWeightedRandomInterval();
		const hue1 = clonedBaseHue;
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
	colorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		let clonedCustomColor: types.Color | null = null;

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
				'To generate a diadic palette, please select a number of swatches greater than 1'
			);
			return [];
		}

		const colors: types.Color[] = [];

		const baseColorValues = genAllColorValues(
			clonedCustomColor ?? random.randomColor(colorSpace)
		);
		const baseColor = baseColorValues[colorSpace] as types.Color;

		if (!baseColor) {
			throw new Error('Base color is missing in the generated values');
		}

		colors.push(baseColor);

		const baseHSL = baseColorValues.hsl as types.HSL;
		const diadicHues = baseHSL
			? genDiadicHues(baseHSL.value.hue)
			: [0, 180];
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
		const diadicColor = diadicColorValues[colorSpace] as types.Color;

		if (diadicColor) {
			colors.push(diadicColor);
		}

		while (colors.length < numBoxes) {
			const baseColorIndex = Math.floor(Math.random() * 2);
			const baseHue = diadicHues[baseColorIndex];
			const newHue =
				(baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;
			const {
				value: { saturation, lightness }
			} = random.randomSL();
			const newClonedHSL: types.HSL = core.clone({
				value: { hue: newHue, saturation, lightness },
				format: 'hsl'
			});
			const newColorValues = genAllColorValues(newClonedHSL);
			const newColor = newColorValues[colorSpace] as types.Color;

			if (newColor) {
				colors.push(newColor);
			}
		}

		colors.forEach((color, index) => {
			const colorBox = document.getElementById(`color-box-${index + 1}`);
			const colorValues = genAllColorValues(color);

			const hexColor = colorValues.hex as types.Hex;
			if (colorBox && hexColor) {
				colorBox.style.backgroundColor = hexColor.value.hex;
				dom.populateColorTextOutputBox(color, index + 1);
			}
		});

		console.log(`Generated diadic palette: ${JSON.stringify(colors)}`);

		return colors;
	} catch (error) {
		console.error(`Error generating diadic palette: ${error}`);

		return [];
	}
}
