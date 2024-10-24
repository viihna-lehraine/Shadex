import { convert } from '../../color-conversion/conversion-index';
import { config } from '../../config/constants';
import * as fnObjects from '../../index/fn-objects';
import * as interfaces from '../../index/interfaces';
import * as types from '../../index/types';

function isCMYKTooBright(cmyk: types.CMYK): boolean {
	return (
		cmyk.value.cyan < config.cmykBrightnessThreshold &&
		cmyk.value.magenta < config.cmykBrightnessThreshold &&
		cmyk.value.yellow < config.cmykBrightnessThreshold
	);
}

export function isCMYKTooDark(cmyk: types.CMYK): boolean {
	return cmyk.value.key > config.cmykDarknessThreshold;
}

function isCMYKTooGray(cmyk: types.CMYK): boolean {
	return (
		Math.abs(cmyk.value.cyan - cmyk.value.magenta) <
			config.cmykGrayThreshold &&
		Math.abs(cmyk.value.magenta - cmyk.value.yellow) <
			config.cmykGrayThreshold
	);
}

function isHexTooBright(hex: types.Hex): boolean {
	const rgb = convert.hexToRGB(hex);
	return isRGBTooBright(rgb);
}

function isHexTooDark(hex: types.Hex): boolean {
	const rgb = convert.hexToRGB(hex);
	return isRGBTooDark(rgb);
}

function isHexTooGray(hex: types.Hex): boolean {
	const rgb = convert.hexToRGB(hex);
	return isRGBTooGray(rgb);
}

function isHSLTooBright(hsl: types.HSL): boolean {
	return hsl.value.lightness > config.hslBrightnessThreshold;
}

function isHSLTooDark(hsl: types.HSL): boolean {
	return hsl.value.lightness < config.hslDarknessThreshold;
}

function isHSLTooGray(hsl: types.HSL): boolean {
	return hsl.value.saturation < config.hslGrayThreshold;
}

function isHSVTooBright(hsv: types.HSV): boolean {
	return (
		hsv.value.value > config.hsvBrightnessValueThreshold &&
		hsv.value.saturation < config.hsvBrightnessSaturationThreshold
	);
}

function isHSVTooDark(hsv: types.HSV): boolean {
	return hsv.value.value < config.hsvDarknessThreshold;
}

function isHSVTooGray(hsv: types.HSV): boolean {
	return hsv.value.saturation < config.hsvGrayThreshold;
}

function isLABTooBright(lab: types.LAB): boolean {
	return lab.value.l > config.labBrightnessThreshold;
}

function isLABTooDark(lab: types.LAB): boolean {
	return lab.value.l < config.labDarknessThreshold;
}

function isLABTooGray(lab: types.LAB): boolean {
	return (
		Math.abs(lab.value.a) < config.labGrayThreshold &&
		Math.abs(lab.value.b) < config.labGrayThreshold
	);
}

function isRGBTooBright(rgb: types.RGB): boolean {
	return (
		(rgb.value.red + rgb.value.green + rgb.value.blue) / 3 >
		config.rgbMaxBrightness
	);
}

function isRGBTooDark(rgb: types.RGB): boolean {
	return (
		(rgb.value.red + rgb.value.green + rgb.value.blue) / 3 <
		config.rgbMinBrightness
	);
}

function isRGBTooGray(rgb: types.RGB): boolean {
	return (
		Math.abs(rgb.value.red - rgb.value.green) < config.rgbGrayThreshold &&
		Math.abs(rgb.value.green - rgb.value.blue) < config.rgbGrayThreshold &&
		Math.abs(rgb.value.red - rgb.value.blue) < config.rgbGrayThreshold
	);
}

function getLimitChecker<K extends keyof fnObjects.ColorLimits>(
	limit: K
): fnObjects.ColorLimits[K] {
	return colorLimits[limit];
}

function isColorInBounds(colors: interfaces.ConversionData): boolean {
	try {
		return Object.entries(colors).some(([key, color]) => {
			if (!color) return false;

			const format = key.toUpperCase();

			const isTooGray = getLimitChecker(
				`is${format}TooGray` as keyof fnObjects.ColorLimits
			);
			const isTooDark = getLimitChecker(
				`is${format}TooDark` as keyof fnObjects.ColorLimits
			);
			const isTooBright = getLimitChecker(
				`is${format}TooBright` as keyof fnObjects.ColorLimits
			);

			return isTooGray(color) || isTooDark(color) || isTooBright(color);
		});
	} catch (error) {
		console.error(`Error validating color bounds: ${error}`);
		return false;
	}
}

export const colorLimits: fnObjects.ColorLimits = {
	getLimitChecker,
	isCMYKTooBright,
	isCMYKTooDark,
	isCMYKTooGray,
	isColorInBounds,
	isHexTooBright,
	isHexTooDark,
	isHexTooGray,
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
