import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { core } from '../utils/core';
import { defaults } from '../utils/defaults';

function hexToCMYK(hex: colors.Hex): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const cmyk = conversionHelpers.hexToCMYKHelper(core.clone(hex));

		console.log(
			`Converted hex ${JSON.stringify(core.clone(hex))} to CMYK: ${JSON.stringify(core.clone(cmyk))}`
		);

		return cmyk;
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function hslToCMYK(hsl: colors.HSL): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const cmyk = conversionHelpers.hslToCMYKHelper(core.clone(hsl));

		console.log(
			`Converted HSL ${JSON.stringify(core.clone(hsl))} to CMYK: ${JSON.stringify(core.clone(cmyk))}`
		);

		return cmyk;
	} catch (error) {
		console.error(
			`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`
		);

		return core.clone(defaults.defaultCMYK());
	}
}

function hsvToCMYK(hsv: colors.HSV): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const cmyk = conversionHelpers.hsvToCMYKHelper(core.clone(hsv));

		console.log(
			`Converted HSV ${JSON.stringify(core.clone(hsv))} to CMYK: ${JSON.stringify(core.clone(cmyk))}`
		);

		return cmyk;
	} catch (error) {
		console.error(
			`Error converting HSV ${JSON.stringify(core.clone(hsv))} to CMYK: ${error}`
		);

		return core.clone(defaults.defaultCMYK());
	}
}

function labToCMYK(lab: colors.LAB): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const cmyk = conversionHelpers.labToCMYKHelper(core.clone(lab));

		console.log(
			`Converted LAB ${JSON.stringify(core.clone(lab))} to CMYK: ${JSON.stringify(core.clone(cmyk))}`
		);

		return cmyk;
	} catch (error) {
		console.error(`Error converting Lab to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function rgbToCMYK(rgb: colors.RGB): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const clonedRGB = core.clone(rgb);

		const redPrime = clonedRGB.value.red / 255;
		const greenPrime = clonedRGB.value.green / 255;
		const bluePrime = clonedRGB.value.blue / 255;

		const key = paletteHelpers.sanitizePercentage(
			1 - Math.max(redPrime, greenPrime, bluePrime)
		);
		const cyan = paletteHelpers.sanitizePercentage(
			(1 - redPrime - key) / (1 - key) || 0
		);
		const magenta = paletteHelpers.sanitizePercentage(
			(1 - greenPrime - key) / (1 - key) || 0
		);
		const yellow = paletteHelpers.sanitizePercentage(
			(1 - bluePrime - key) / (1 - key) || 0
		);
		const format: 'cmyk' = 'cmyk';

		const cmyk = { value: { cyan, magenta, yellow, key }, format };

		console.log(
			`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(core.clone(cmyk))}`
		);

		return cmyk;
	} catch (error) {
		console.error(`Error converting RGB to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function xyzToCMYK(xyz: colors.XYZ): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const cmyk = conversionHelpers.xyzToCMYKHelper(core.clone(xyz));

		console.log(
			`Converted XYZ ${JSON.stringify(core.clone(xyz))} to CMYK: ${JSON.stringify(core.clone(cmyk))}`
		);

		return cmyk;
	} catch (error) {
		console.error(
			`Error converting XYZ ${JSON.stringify(core.clone(xyz))} to CMYK: ${error}`
		);

		return core.clone(defaults.defaultCMYK());
	}
}

export const toCMYK: fnObjects.ToCMYK = {
	hexToCMYK,
	hslToCMYK,
	hsvToCMYK,
	labToCMYK,
	rgbToCMYK,
	xyzToCMYK
};
