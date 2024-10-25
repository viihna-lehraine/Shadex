import { genAllColorValues } from '../color-conversion/conversion';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';

export function genAnalogousHues(
	color: types.Color,
	numBoxes: number
): number[] {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return [];
		}

		const clonedColor = core.clone(color);
		const hslColor =
			clonedColor.format === 'hsl'
				? (clonedColor as types.HSL)
				: conversionHelpers.convertColorToHSL(clonedColor);

		if (!hslColor) {
			console.error(`Failed to retrieve HSL color from ${color.format}`);
			return [];
		}

		const analogousHues: number[] = [];
		const baseHue = hslColor.value.hue;
		const maxTotalDistance = 60;
		const minTotalDistance = 10 + (numBoxes - 2) * 9;
		const totalIncrement =
			Math.floor(
				Math.random() * (maxTotalDistance - minTotalDistance + 1)
			) + minTotalDistance;
		const increment = Math.floor(totalIncrement / (numBoxes - 1));

		for (let i = 1; i < numBoxes; i++) {
			analogousHues.push((baseHue + increment * i) % 360);
		}

		return analogousHues;
	} catch (error) {
		console.error(`Error generating analogous hues: ${error}`);
		return [];
	}
}

export function genAnalogousPalette(
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
				'To generate an analogous palette, please select a number of swatches greater than 1'
			);

			return [];
		}

		const colors: types.Color[] = [];
		const baseColorValues = clonedCustomColor
			? genAllColorValues(clonedCustomColor)
			: genAllColorValues(random.randomColor(colorSpace));
		const baseColor = baseColorValues[colorSpace];

		if (!baseColor) {
			throw new Error('Base color is missing in the generated values');
		}

		colors.push(baseColor);

		const analogousHues = genAnalogousHues(
			baseColorValues.hsl as types.HSL,
			numBoxes
		);

		analogousHues.forEach((hue, i) => {
			const sl = random.randomSL();
			const analogousColorValues = genAllColorValues({
				value: {
					hue,
					saturation: sl.value.saturation,
					lightness: sl.value.lightness
				},
				format: 'hsl'
			});

			const analogousColor = analogousColorValues.hsl;

			if (analogousColor) {
				colors.push(analogousColor);
			}

			const colorBox = document.getElementById(`color-box-${i + 2}`);

			if (colorBox) {
				const hexValue = analogousColorValues.hex as
					| types.Hex
					| undefined;
				colorBox.style.backgroundColor = hexValue
					? hexValue.value.hex
					: '';
			}
		});

		console.log(`Generated analogous palette: ${JSON.stringify(colors)}`);

		return colors;
	} catch (error) {
		console.error(`Error generating analogous palette: ${error}`);

		return [];
	}
}
