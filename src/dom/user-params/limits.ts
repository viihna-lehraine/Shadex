import * as types from '../../index';
import { convert } from '../../color-conversion/conversion-index';

export function isHexTooGray(hex: types.Hex): boolean {
	const rgb = convert.hexToRGB(hex);
	return isRGBTooGray(rgb);
}

export function isHexTooDark(hex: types.Hex): boolean {
	const rgb = convert.hexToRGB(hex);
	return isRGBTooDark(rgb);
}

export function isHexTooBright(hex: types.Hex): boolean {
	const rgb = convert.hexToRGB(hex);
	return isRGBTooBright(rgb);
}

export function isHSLTooGray(
	hsl: types.HSL,
	hslGrayThreshold: number = 20
): boolean {
	return hsl.value.saturation < hslGrayThreshold;
}

export function isHSLTooDark(
	hsl: types.HSL,
	hslDarknessThreshold: number = 25
): boolean {
	return hsl.value.lightness < hslDarknessThreshold;
}

export function isHSLTooBright(
	hsl: types.HSL,
	hslBrightnessThreshold: number = 75
): boolean {
	return hsl.value.lightness > hslBrightnessThreshold;
}

export function isRGBTooGray(
	rgb: types.RGB,
	rgbGrayTreshold: number = 10
): boolean {
	return (
		Math.abs(rgb.value.red - rgb.value.green) < rgbGrayTreshold &&
		Math.abs(rgb.value.green - rgb.value.blue) < rgbGrayTreshold &&
		Math.abs(rgb.value.red - rgb.value.blue) < rgbGrayTreshold
	);
}

export function isRGBTooDark(
	rgb: types.RGB,
	rgbMinBrightness: number = 50
): boolean {
	return (
		(rgb.value.red + rgb.value.green + rgb.value.blue) / 3 <
		rgbMinBrightness
	);
}

export function isRGBTooBright(
	rgb: types.RGB,
	rgbMaxBrightness: number = 200
): boolean {
	return (
		(rgb.value.red + rgb.value.green + rgb.value.blue) / 3 >
		rgbMaxBrightness
	);
}

export function isHSVTooGray(
	hsv: types.HSV,
	hsvGrayThreshold: number = 10
): boolean {
	return hsv.value.saturation < hsvGrayThreshold;
}

export function isHSVTooDark(
	hsv: types.HSV,
	hsvDarknessThreshold: number = 10
): boolean {
	return hsv.value.value < hsvDarknessThreshold;
}

export function isHSVTooBright(
	hsv: types.HSV,
	hsvBrightnessValueThreshold: number = 90,
	hsvBrightnessSaturationThreshold: number = 10
): boolean {
	return (
		hsv.value.value > hsvBrightnessValueThreshold &&
		hsv.value.saturation < hsvBrightnessSaturationThreshold
	);
}

export function isCMYKTooGray(
	cmyk: types.CMYK,
	cmykGrayThreshold: number = 5
): boolean {
	return (
		Math.abs(cmyk.value.cyan - cmyk.value.magenta) < cmykGrayThreshold &&
		Math.abs(cmyk.value.magenta - cmyk.value.yellow) < cmykGrayThreshold
	);
}

export function isCMYKTooDark(
	cmyk: types.CMYK,
	cmykDarknesshreshold: number = 90
): boolean {
	return cmyk.value.key > cmykDarknesshreshold;
}

export function isCMYKTooBright(
	cmyk: types.CMYK,
	cmykBrightnessThreshold: number = 10
): boolean {
	return (
		cmyk.value.cyan < cmykBrightnessThreshold &&
		cmyk.value.magenta < cmykBrightnessThreshold &&
		cmyk.value.yellow < cmykBrightnessThreshold
	);
}

export function isLABTooGray(
	lab: types.LAB,
	labGrayThreshold: number = 10
): boolean {
	return (
		Math.abs(lab.value.a) < labGrayThreshold &&
		Math.abs(lab.value.b) < labGrayThreshold
	);
}

export function isLABTooDark(
	lab: types.LAB,
	labDarknessThreshold: number = 10
): boolean {
	return lab.value.l < labDarknessThreshold;
}

export function isLABTooBright(
	lab: types.LAB,
	labBrightnessThreshold: number = 90
): boolean {
	return lab.value.l > labBrightnessThreshold;
}

export function isColorInBounds(
	cmyk: types.CMYK,
	hex: types.Hex,
	hsl: types.HSL,
	hsv: types.HSV,
	lab: types.LAB,
	rgb: types.RGB
): boolean {
	return (
		isCMYKTooGray(cmyk) ||
		isCMYKTooDark(cmyk) ||
		isCMYKTooBright(cmyk) ||
		isHexTooGray(hex) ||
		isHexTooDark(hex) ||
		isHexTooBright(hex) ||
		isHSLTooGray(hsl) ||
		isHSLTooDark(hsl) ||
		isHSLTooBright(hsl) ||
		isHSVTooGray(hsv) ||
		isHSVTooDark(hsv) ||
		isHSVTooBright(hsv) ||
		isLABTooGray(lab) ||
		isLABTooDark(lab) ||
		isLABTooBright(lab) ||
		isRGBTooGray(rgb) ||
		isRGBTooDark(rgb) ||
		isRGBTooBright(rgb)
	);
}

export const colorLimits = {
	isCMYKTooBright,
	isCMYKTooDark,
	isCMYKTooGray,
	isHSLTooBright,
	isHSLTooDark,
	isHSLTooGray,
	isHSVTooBright,
	isHSVTooDark,
	isHSVTooGray,
	isLABTooBright,
	isLABTooDark,
	isLABTooGray,
	isRGBTooBright,
	isRGBTooDark,
	isRGBTooGray
};
