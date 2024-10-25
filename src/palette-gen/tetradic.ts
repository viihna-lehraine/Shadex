import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';
export function genTetradicHues(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);
		const randomOffset = Math.floor(Math.random() * 46) + 20;
		const distance =
			90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);

		return [
			clonedBaseHue,
			(clonedBaseHue + 180) % 360,
			(clonedBaseHue + distance) % 360,
			(clonedBaseHue + distance + 180) % 360
		];
	} catch (error) {
		console.error(`Error generating tetradic hues: ${error}`);

		return [];
	}
}

export function genTetradicPalette(
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

		if (numBoxes < 4) {
			window.alert(
				'To generate a tetradic palette, please select at least 4 swatches.'
			);

			return [];
		}

		const colors: types.Color[] = [];
		const baseColor = clonedCustomColor ?? random.randomColor(colorSpace);
		const baseColorValues = genAllColorValues(baseColor);
		const baseHSL = baseColorValues.hsl as types.HSL;

		if (!baseHSL) {
			throw new Error('Base HSL value is required.');
		}

		colors.push(baseHSL);

		const tetradicHues = genTetradicHues(baseHSL.value.hue);

		// generate the main tetradic colors (hues 2-4)
		tetradicHues.slice(1).forEach(hue => {
			const sl = random.randomSL();
			const colorValues = genAllColorValues({
				value: { hue, ...sl.value },
				format: 'hsl'
			}).hsl;

			if (colorValues) {
				colors.push(colorValues);
			}
		});

		while (colors.length < numBoxes) {
			const baseHue = tetradicHues[Math.floor(Math.random() * 4)];
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

		colors.forEach((color, index) => {
			const colorBox = document.getElementById(`color-box-${index + 1}`);

			if (colorBox) {
				const hexColor = genAllColorValues(color).hex as types.Hex;

				colorBox.style.backgroundColor = hexColor.value.hex;

				dom.populateColorTextOutputBox(color, index + 1);
			}
		});

		console.log(`Generated tetradic palette: ${JSON.stringify(colors)}`);

		return colors;
	} catch (error) {
		console.error(`Error generating tetradic palette: ${error}`);

		return [];
	}
}
