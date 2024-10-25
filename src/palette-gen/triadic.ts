import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';

export function genTriadicHues(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);

		return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
	} catch (error) {
		console.error(`Error generating triadic hues: ${error}`);

		return [];
	}
}

export function genTriadicPalette(
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

		if (numBoxes < 3) {
			window.alert(
				'To generate a triadic palette, please select at least 3 swatches.'
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

		const triadicHues = genTriadicHues(baseHSL.value.hue);

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

		colors.forEach((color, index) => {
			const colorBox = document.getElementById(`color-box-${index + 1}`);

			if (colorBox) {
				const hexColor = genAllColorValues(color).hex as types.Hex;

				colorBox.style.backgroundColor = hexColor.value.hex;

				dom.populateColorTextOutputBox(color, index + 1);
			}
		});

		console.log(`Generated triadic palette: ${JSON.stringify(colors)}`);

		return colors;
	} catch (error) {
		console.error(`Error generating triadic palette: ${error}`);

		return [];
	}
}
