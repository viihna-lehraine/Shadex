import { defaults } from '../config/defaults';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { core } from '../utils/core';

const format: 'sv' = 'sv';

function cmykToSV(cmyk: colors.CMYK): colors.SV {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid cmyk value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.sv);
		}

		const hsv = conversionHelpers.cmykToHSVHelper(core.clone(cmyk));

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format
		};
	} catch (error) {
		console.error(`Error converting cmyk to SV: ${error}`);

		return defaults.sv;
	}
}

function hexToSV(hex: colors.Hex): colors.SV {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.sv);
		}

		const hsv = conversionHelpers.hexToHSVHelper(core.clone(hex));

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format
		};
	} catch (error) {
		console.error(`Error converting hex to SV: ${error}`);

		return defaults.sv;
	}
}

function hslToSV(hsl: colors.HSL): colors.SV {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.sv);
		}

		const hsv = conversionHelpers.hslToHSVHelper(core.clone(hsl));

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format
		};
	} catch (error) {
		console.error(`Error converting HSL to SV: ${error}`);

		return defaults.sv;
	}
}

function hsvToSV(hsv: colors.HSV): colors.SV {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.sv);
		}

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format
		};
	} catch (error) {
		console.error(`Error converting HSV to SV: ${error}`);

		return defaults.sv;
	}
}

function labToSV(lab: colors.LAB): colors.SV {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.sv);
		}

		const hsv = conversionHelpers.labToHSVHelper(core.clone(lab));

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format
		};
	} catch (error) {
		console.error(`Error converting LAB to SV: ${error}`);

		return defaults.sv;
	}
}

function rgbToSV(rgb: colors.RGB): colors.SV {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.sv);
		}

		const hsv = conversionHelpers.rgbToHSVHelper(core.clone(rgb));

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format
		};
	} catch (error) {
		console.error(`Error converting RGB to SV: ${error}`);

		return defaults.sv;
	}
}

function xyzToSV(xyz: colors.XYZ): colors.SV {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.sv);
		}

		const hsv = conversionHelpers.xyzToHSVHelper(core.clone(xyz));

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value
			},
			format
		};
	} catch (error) {
		console.error(`Error converting XYZ to SV: ${error}`);

		return defaults.sv;
	}
}

export const toSV: fnObjects.ToSV = {
	cmykToSV,
	hexToSV,
	hslToSV,
	hsvToSV,
	labToSV,
	rgbToSV,
	xyzToSV
};
