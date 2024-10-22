import { palette } from '../palette-gen/palette-index';
import { convert } from '../color-conversion/conversion-index';
import * as types from '../index';
import { genPaletteBox } from '../dom/dom-main';
import { random } from '../utils/color-randomizer';

function adjustSL(color: types.HSL, amount: number = 10): types.HSL {
	const adjustedSaturation = Math.min(
		Math.max(color.saturation + amount, 0),
		100
	);
	const adjustedLightness = Math.min(
		Math.max(color.lightness + amount, 0),
		100
	);

	return {
		hue: color.hue,
		saturation: adjustedSaturation,
		lightness: adjustedLightness,
		format: 'hsl'
	};
}

function genSelectedPaletteType(
	paletteType: number,
	numBoxes: number,
	baseColor: types.ColorData,
	customColor: types.ColorData | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
) {
	switch (paletteType) {
		case 1:
			return palette.genRandomPalette(
				numBoxes,
				customColor,
				initialColorSpace
			);
		case 2:
			return palette.genComplementaryPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		case 3:
			return palette.genTriadicPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		case 4:
			return palette.genTetradicPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		case 5:
			return palette.genSplitComplementaryPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		case 6:
			return palette.genAnalogousPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		case 7:
			return palette.genHexadicPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		case 8:
			return palette.genDiadicPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		case 9:
			return palette.genMonochromaticPalette(
				numBoxes,
				baseColor,
				initialColorSpace
			);
		default:
			console.error('DEFAULT CASE > unable to determine color scheme');
			return [];
	}
}

function startInHSL(color: types.ColorData): types.HSL | null {
	if (color.format === 'cmyk') {
		const cmyk = color as types.CMYK;
		return convert.cmykToHSL(cmyk);
	} else if (color.format === 'hex') {
		const hex = color as types.Hex;
		return convert.hexToHSL(hex);
	} else if (color.format === 'hsl') {
		const hsl = color as types.HSL;
		return hsl;
	} else if (color.format === 'hsv') {
		const hsv = color as types.HSV;
		return convert.hsvToHSL(hsv);
	} else if (color.format === 'lab') {
		const lab = color as types.LAB;
		return convert.labToHSL(lab);
	} else if (color.format === 'rgb') {
		const rgb = color as types.RGB;
		return convert.rgbToHSL(rgb);
	} else {
		console.error('Unrecognized color format');
		return null;
	}
}

function genPalette(
	paletteType: number,
	numBoxes: number,
	initialColorSpace: types.ColorSpace = 'hex',
	customColor?: types.ColorData | null
) {
	let colors: types.ColorData[] = [];

	const baseColor: types.ColorData =
		customColor ??
		(random.randomColor(initialColorSpace, 'flat') as types.ColorData);

	genSelectedPaletteType(
		paletteType,
		numBoxes,
		baseColor,
		customColor,
		initialColorSpace
	);

	if (colors.length === 0) {
		console.error('Colors array is empty or undefined.');
		return;
	}

	genPaletteBox(numBoxes, colors);
}

function initialHSLColorGen(
	color: types.ColorObject<
		types.CMYK | types.Hex | types.HSL | types.HSV | types.LAB | types.RGB
	>
): types.HSL | undefined {
	switch (color.format) {
		case 'cmyk':
			return convert.cmykToHSL(color.value as types.CMYK);
		case 'hex':
			return convert.hexToHSL(color.value as types.Hex);
		case 'hsl':
			return color.value as types.HSL;
		case 'hsv':
			return convert.hsvToHSL(color.value as types.HSV);
		case 'lab':
			return convert.labToHSL(color.value as types.LAB);
		case 'rgb':
			return convert.rgbToHSL(color.value as types.RGB);
		default:
			return undefined;
	}
}

export const paletteHelpers = {
	adjustSL,
	genPalette,
	genSelectedPaletteType,
	initialHSLColorGen,
	startInHSL
};
