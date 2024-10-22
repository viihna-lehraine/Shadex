import { genAllColorValues } from '../color-conversion/conversion';
import { populateColorTextOutputBox } from '../dom/dom-main';
import { random } from '../utils/color-randomizer';
import * as types from '../index';

export function genSplitComplementaryHues(baseHue: number): number[] {
	const splitComplementaryHues = [];
	const baseComplementaryHue = (baseHue + 180) % 360;
	const modifier = Math.floor(Math.random() * 11) + 20;

	splitComplementaryHues.push((baseComplementaryHue + modifier) % 360);
	splitComplementaryHues.push((baseComplementaryHue - modifier + 360) % 360);

	return splitComplementaryHues;
}

export function genSplitComplementaryPalette(
	numBoxes: number,
	customColor: types.ColorData | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.ColorData[] {
	if (numBoxes < 3) {
		window.alert(
			'To generate a split complementary palette, please select a number of swatches greater than 2'
		);
		return [];
	}

	const colors: types.ColorData[] = [];
	let baseColor: types.ColorData;

	if (customColor) {
		baseColor = customColor;
	} else {
		const randomColor = random.randomColor(initialColorSpace);
		const colorValues = genAllColorValues(randomColor);
		baseColor = colorValues[initialColorSpace] ?? random.randomHSL(); // Safe fallback
	}

	const splitComplementaryHues = genSplitComplementaryHues(
		(baseColor as types.HSL).hue
	);

	colors.push(baseColor);

	splitComplementaryHues.forEach(hue => {
		const { saturation, lightness } = random.randomSL();
		const complementaryColor = genAllColorValues({
			hue,
			saturation,
			lightness,
			format: 'hsl'
		}).hsl;

		if (complementaryColor) {
			colors.push(complementaryColor);
		}
	});

	while (colors.length < numBoxes) {
		const baseColorIndex = Math.floor(Math.random() * 2) + 1;
		const baseHue = splitComplementaryHues[baseColorIndex - 1];
		const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;

		let { saturation, lightness } = random.randomSL();
		saturation = Math.min(100, Math.max(0, saturation));
		lightness = Math.min(100, Math.max(0, lightness));

		const additionalColor = genAllColorValues({
			hue,
			saturation,
			lightness,
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
			colorBox.style.backgroundColor = hexColor.hex;
			populateColorTextOutputBox(color as types.HSL, index + 1);
		}
	});

	return colors;
}
