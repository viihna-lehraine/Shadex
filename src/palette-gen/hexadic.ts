import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';

export function genHexadicHues(color: types.Color): number[] {
	try {
		const clonedColor = core.clone(color);

		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return [];
		}

		const clonedColorValues = genAllColorValues(clonedColor);
		const clonedBaseHSL = clonedColorValues.hsl as types.HSL;

		if (!clonedBaseHSL) {
			throw new Error(
				'Unable to generate hexadic hues - missing HSL values'
			);
		}

		const hexadicHues: number[] = [];
		const clonedBaseHue = clonedBaseHSL.value.hue;

		const hue1 = clonedBaseHue;
		const hue2 = (hue1 + 180) % 360;
		const randomDistance = Math.floor(Math.random() * 71 + 10);
		const hue3 = (hue1 + randomDistance) % 360;
		const hue4 = (hue3 + 180) % 360;
		const hue5 = (hue1 + 360 - randomDistance) % 360;
		const hue6 = (hue5 + 180) % 360;

		hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);

		return hexadicHues;
	} catch (error) {
		console.error(`Error generating hexadic hues: ${error}`);

		return [];
	}
}

export function genHexadicPalette(
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

		if (numBoxes < 6) {
			window.alert(
				'To generate a hexadic palette, please select a number of swatches greater than 5'
			);

			return [];
		}

		const colors: types.Color[] = [];
		const baseColorValues = genAllColorValues(
			clonedCustomColor ?? random.randomColor(colorSpace)
		);
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
			const {
				value: { saturation, lightness }
			} = random.randomSL();

			const newColorValues = genAllColorValues({
				value: { hue, saturation, lightness },
				format: 'hsl'
			});
			const newHSL = newColorValues.hsl as types.HSL;

			colors.push(newHSL);

			const colorBox = document.getElementById(`color-box-${i + 1}`);

			if (colorBox) {
				const hexColor = newColorValues.hex as types.Hex;
				colorBox.style.backgroundColor = hexColor.value.hex;

				dom.populateColorTextOutputBox(newHSL, i + 1);
			}
		}

		console.log(`Generated hexadic palette: ${JSON.stringify(colors)}`);

		return colors;
	} catch (error) {
		console.error(`Error generating hexadic palette: ${error}`);

		return [];
	}
}
