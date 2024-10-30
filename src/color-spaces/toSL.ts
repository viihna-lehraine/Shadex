import { defaults } from '../config/defaults';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { core } from '../utils/core';

const format: 'sl' = 'sl';

function cmykToSL(cmyk: colors.CMYK): colors.SL {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid cmyk value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.sl);
		}

		const hsl = conversionHelpers.cmykToHSLHelper(core.clone(cmyk));

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format
		};
	} catch (error) {
		console.error(`Error converting cmyk to SL: ${error}`);

		return defaults.sl;
	}
}

function hexToSL(hex: colors.Hex): colors.SL {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.sl);
		}

		const hsl = conversionHelpers.hexToHSLHelper(core.clone(hex));

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format
		};
	} catch (error) {
		console.error(`Error converting hex to SL: ${error}`);

		return defaults.sl;
	}
}

function hslToSL(hsl: colors.HSL): colors.SL {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.sl);
		}

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format
		};
	} catch (error) {
		console.error(`Error converting HSL to SL: ${error}`);

		return defaults.sl;
	}
}

function hsvToSL(hsv: colors.HSV): colors.SL {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.sl);
		}

		const hsl = conversionHelpers.hsvToHSLHelper(core.clone(hsv));

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format
		};
	} catch (error) {
		console.error(`Error converting HSV to SL: ${error}`);

		return defaults.sl;
	}
}

function labToSL(lab: colors.LAB): colors.SL {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.sl);
		}

		const hsl = conversionHelpers.labToHSLHelper(core.clone(lab));

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format
		};
	} catch (error) {
		console.error(`Error converting LAB to SL: ${error}`);

		return defaults.sl;
	}
}

function rgbToSL(rgb: colors.RGB): colors.SL {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.sl);
		}

		const hsl = conversionHelpers.rgbToHSLHelper(core.clone(rgb));

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format
		};
	} catch (error) {
		console.error(`Error converting RGB to SL: ${error}`);

		return defaults.sl;
	}
}

function xyzToSL(xyz: colors.XYZ): colors.SL {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.sl);
		}

		const hsl = conversionHelpers.xyzToHSLHelper(core.clone(xyz));

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness
			},
			format
		};
	} catch (error) {
		console.error(`Error converting XYZ to SL: ${error}`);

		return defaults.sl;
	}
}

export const toSL: fnObjects.ToSL = {
	cmykToSL,
	hexToSL,
	hslToSL,
	hsvToSL,
	labToSL,
	rgbToSL,
	xyzToSL
};
