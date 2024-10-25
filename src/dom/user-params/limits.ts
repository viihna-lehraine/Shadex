import { convert } from '../../color-conversion/conversion-index';
import { config } from '../../config/constants';
import { paletteHelpers } from '../../helpers/palette';
import * as fnObjects from '../../index/fn-objects';
import * as interfaces from '../../index/interfaces';
import * as types from '../../index/types';
import { core } from '../../utils/core';

function isCMYKTooBright(cmyk: types.CMYK): boolean {
	if (!paletteHelpers.validateColorValues(cmyk)) {
		console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

		return false;
	}

	return (
		core.clone(cmyk).value.cyan < config.cmykBrightnessThreshold &&
		core.clone(cmyk).value.magenta < config.cmykBrightnessThreshold &&
		core.clone(cmyk).value.yellow < config.cmykBrightnessThreshold
	);
}

export function isCMYKTooDark(cmyk: types.CMYK): boolean {
	if (!paletteHelpers.validateColorValues(cmyk)) {
		console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

		return false;
	}

	return core.clone(cmyk).value.key > config.cmykDarknessThreshold;
}

function isCMYKTooGray(cmyk: types.CMYK): boolean {
	if (!paletteHelpers.validateColorValues(cmyk)) {
		console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

		return false;
	}

	return (
		Math.abs(core.clone(cmyk).value.cyan - core.clone(cmyk).value.magenta) <
			config.cmykGrayThreshold &&
		Math.abs(
			core.clone(cmyk).value.magenta - core.clone(cmyk).value.yellow
		) < config.cmykGrayThreshold
	);
}

function isHexTooBright(hex: types.Hex): boolean {
	if (!paletteHelpers.validateColorValues(hex)) {
		console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

		return false;
	}

	return isRGBTooBright(convert.hexToRGB(core.clone(hex)));
}

function isHexTooDark(hex: types.Hex): boolean {
	if (!paletteHelpers.validateColorValues(hex)) {
		console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

		return false;
	}

	return isRGBTooBright(convert.hexToRGB(core.clone(hex)));
}

function isHexTooGray(hex: types.Hex): boolean {
	if (!paletteHelpers.validateColorValues(hex)) {
		console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

		return false;
	}

	return isRGBTooGray(convert.hexToRGB(core.clone(hex)));
}

function isHSLTooBright(hsl: types.HSL): boolean {
	if (!paletteHelpers.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness > config.hslBrightnessThreshold;
}

function isHSLTooDark(hsl: types.HSL): boolean {
	if (!paletteHelpers.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness < config.hslDarknessThreshold;
}

function isHSLTooGray(hsl: types.HSL): boolean {
	if (!paletteHelpers.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.saturation < config.hslGrayThreshold;
}

function isHSVTooBright(hsv: types.HSV): boolean {
	if (!paletteHelpers.validateColorValues(hsv)) {
		console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

		return false;
	}

	return (
		core.clone(hsv).value.value > config.hsvBrightnessValueThreshold &&
		core.clone(hsv).value.saturation <
			config.hsvBrightnessSaturationThreshold
	);
}

function isHSVTooDark(hsv: types.HSV): boolean {
	if (!paletteHelpers.validateColorValues(hsv)) {
		console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

		return false;
	}

	return core.clone(hsv).value.value < config.hsvDarknessThreshold;
}

function isHSVTooGray(hsv: types.HSV): boolean {
	if (!paletteHelpers.validateColorValues(hsv)) {
		console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

		return false;
	}

	return core.clone(hsv).value.saturation < config.hsvGrayThreshold;
}

function isLABTooBright(lab: types.LAB): boolean {
	if (!paletteHelpers.validateColorValues(lab)) {
		console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

		return false;
	}

	return core.clone(lab).value.l > config.labBrightnessThreshold;
}

function isLABTooDark(lab: types.LAB): boolean {
	if (!paletteHelpers.validateColorValues(lab)) {
		console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

		return false;
	}

	return core.clone(lab).value.l < config.labDarknessThreshold;
}

function isLABTooGray(lab: types.LAB): boolean {
	if (!paletteHelpers.validateColorValues(lab)) {
		console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

		return false;
	}

	return (
		Math.abs(core.clone(lab).value.a) < config.labGrayThreshold &&
		Math.abs(core.clone(lab).value.b) < config.labGrayThreshold
	);
}

function isRGBTooBright(rgb: types.RGB): boolean {
	if (!paletteHelpers.validateColorValues(rgb)) {
		console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

		return false;
	}

	return (
		(core.clone(rgb).value.red +
			core.clone(rgb).value.green +
			core.clone(rgb).value.blue) /
			3 >
		config.rgbMaxBrightness
	);
}

function isRGBTooDark(rgb: types.RGB): boolean {
	if (!paletteHelpers.validateColorValues(rgb)) {
		console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

		return false;
	}

	return (
		(core.clone(rgb).value.red +
			core.clone(rgb).value.green +
			core.clone(rgb).value.blue) /
			3 <
		config.rgbMinBrightness
	);
}

function isRGBTooGray(rgb: types.RGB): boolean {
	if (!paletteHelpers.validateColorValues(rgb)) {
		console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

		return false;
	}

	return (
		Math.abs(core.clone(rgb).value.red - core.clone(rgb).value.green) <
			config.rgbGrayThreshold &&
		Math.abs(core.clone(rgb).value.green - core.clone(rgb).value.blue) <
			config.rgbGrayThreshold &&
		Math.abs(core.clone(rgb).value.red - core.clone(rgb).value.blue) <
			config.rgbGrayThreshold
	);
}

function getLimitChecker<K extends keyof fnObjects.ColorLimits>(
	limit: K
): fnObjects.ColorLimits[K] {
	return colorLimits[limit];
}

function isColorInBounds(colors: interfaces.ConversionData): boolean {
	try {
		const areAllColorsValid = Object.entries(colors).every(
			([key, color]) => {
				if (!paletteHelpers.validateColorValues(color)) {
					console.error(
						`Invalid color (${key}): ${JSON.stringify(color)}`
					);
					return false;
				}
				return true;
			}
		);

		if (!areAllColorsValid) return false;

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
