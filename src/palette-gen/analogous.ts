import { random } from '../utils/color-randomizer';
import * as types from '../index';
import { genAllColorValues } from '../color-conversion/conversion';

export function genAnalogousHues(color: types.HSL, numBoxes: number): number[] {
	const analogousHues = [];
	const baseHue = color.value.hue;
	const maxTotalDistance = 60;
	const minTotalDistance = 10 + (numBoxes - 2) * 9;
	const totalIncrement =
		Math.floor(Math.random() * (maxTotalDistance - minTotalDistance + 1)) +
		minTotalDistance;
	const increment = Math.floor(totalIncrement / (numBoxes - 1));

	for (let i = 1; i < numBoxes; i++) {
		analogousHues.push((baseHue + increment * i) % 360);
	}

	return analogousHues;
}

export function genAnalogousPalette(
	numBoxes: number,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	if (numBoxes < 2) {
		window.alert(
			'To generate an analogous palette, please select a number of swatches greater than 1'
		);

		return [];
	}

	const colors: types.Color[] = [];
	const baseColorValues = customColor
		? genAllColorValues(customColor)
		: genAllColorValues(random.randomColor(initialColorSpace));
	const baseColor = baseColorValues[initialColorSpace];

	if (!baseColor) {
		throw new Error('Base color is missin in the generated values');
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
			const hexValue = analogousColorValues.hex as types.Hex | undefined;
			colorBox.style.backgroundColor = hexValue ? hexValue.value.hex : '';
		}
	});

	return colors;
}
