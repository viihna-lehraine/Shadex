import { convert } from '../color-spaces/color-space-index';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { core } from '../utils/core';
import { defaults } from '../config/defaults';

function applyGammaCorrection(value: number): number {
	try {
		return value > 0.0031308
			? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
			: 12.92 * value;
	} catch (error) {
		console.error(`Error applying gamma correction: ${error}`);

		return value;
	}
}

function clampRGB(rgb: colors.RGB): colors.RGB {
	if (!paletteHelpers.validateColorValues(rgb)) {
		console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

		return core.clone(defaults.rgb);
	}

	try {
		return {
			value: {
				red: Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255),
				green: Math.round(
					Math.min(Math.max(0, rgb.value.green), 1) * 255
				),
				blue: Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255)
			},
			format: 'rgb'
		};
	} catch (error) {
		console.error(`Error clamping RGB values: ${error}`);

		return rgb;
	}
}

function cmykToHSLHelper(cmyk: colors.CMYK): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.hsl);
		}

		const rgb: colors.RGB = convert.cmykToRGB(core.clone(cmyk));

		return convert.rgbToHSL(rgb);
	} catch (error) {
		console.error(`Error converting CMYK to HSL: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function cmykToHSVHelper(cmyk: colors.CMYK): colors.HSV {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.hsv);
		}

		const rgb: colors.RGB = convert.cmykToRGB(core.clone(cmyk));

		return convert.rgbToHSV(rgb);
	} catch (error) {
		console.error(`Error converting CMYK to HSV: ${error}`);

		return core.clone(defaults.hsv);
	}
}

function cmykToXYZHelper(cmyk: colors.CMYK): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.xyz);
		}

		const rgb: colors.RGB = convert.cmykToRGB(core.clone(cmyk));

		return convert.rgbToXYZ(rgb);
	} catch (error) {
		console.error(`Error converting CMYK to XYZ: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function convertColorToCMYK(color: colors.Color): colors.CMYK | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.cmyk);
		}

		switch (color.format) {
			case 'cmyk':
				return color as colors.CMYK;
			case 'hex':
				return hexToCMYKHelper(core.clone(color) as colors.Hex);
			case 'hsl':
				return hslToCMYKHelper(core.clone(color) as colors.HSL);
			case 'hsv':
				return hsvToCMYKHelper(core.clone(color) as colors.HSV);
			case 'lab':
				return labToCMYKHelper(core.clone(color) as colors.LAB);
			case 'rgb':
				return convert.rgbToCMYK(core.clone(color) as colors.RGB);
			case 'xyz':
				return convert.xyzToCMYK(core.clone(color) as colors.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to CMYK: ${error}`);

		return null;
	}
}

function convertColorToHex(color: colors.Color): colors.Hex | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.hex);
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHex(core.clone(color) as colors.CMYK);
			case 'hex':
				return color as colors.Hex;
			case 'hsl':
				return convert.hslToHex(core.clone(color) as colors.HSL);
			case 'hsv':
				return convert.hsvToHex(core.clone(color) as colors.HSV);
			case 'lab':
				return convert.labToHex(core.clone(color) as colors.LAB);
			case 'rgb':
				return convert.rgbToHex(core.clone(color) as colors.RGB);
			case 'xyz':
				return convert.xyzToHex(core.clone(color) as colors.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to hex: ${error}`);

		return null;
	}
}

function convertColorToHSL(color: colors.Color): colors.HSL | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.hsl);
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHSL(core.clone(color) as colors.CMYK);
			case 'hex':
				return convert.hexToHSL(core.clone(color) as colors.Hex);
			case 'hsl':
				return color as colors.HSL;
			case 'hsv':
				return convert.hsvToHSL(core.clone(color) as colors.HSV);
			case 'lab':
				return convert.labToHSL(core.clone(color) as colors.LAB);
			case 'rgb':
				return convert.rgbToHSL(core.clone(color) as colors.RGB);
			case 'xyz':
				return convert.xyzToHSL(core.clone(color) as colors.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to HSL: ${error}`);

		return null;
	}
}

function convertColorToHSV(color: colors.Color): colors.HSV | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.hsv);
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHSV(core.clone(color) as colors.CMYK);
			case 'hex':
				return convert.hexToHSV(core.clone(color) as colors.Hex);
			case 'hsl':
				return convert.hslToHSV(core.clone(color) as colors.HSL);
			case 'hsv':
				return color as colors.HSV;
			case 'lab':
				return convert.labToHSV(core.clone(color) as colors.LAB);
			case 'rgb':
				return convert.rgbToHSV(core.clone(color) as colors.RGB);
			case 'xyz':
				return convert.xyzToHSV(core.clone(color) as colors.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to HSV: ${error}`);

		return null;
	}
}

function convertColorToLAB(color: colors.Color): colors.LAB | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.lab);
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToLAB(core.clone(color) as colors.CMYK);
			case 'hex':
				return convert.hexToLAB(core.clone(color) as colors.Hex);
			case 'hsl':
				return convert.hslToLAB(core.clone(color) as colors.HSL);
			case 'hsv':
				return convert.hsvToLAB(core.clone(color) as colors.HSV);
			case 'lab':
				return color as colors.LAB;
			case 'rgb':
				return convert.rgbToLAB(core.clone(color) as colors.RGB);
			case 'xyz':
				return convert.xyzToLAB(core.clone(color) as colors.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to LAB: ${error}`);

		return null;
	}
}

function convertColorToRGB(color: colors.Color): colors.RGB | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.rgb);
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToRGB(core.clone(color) as colors.CMYK);
			case 'hex':
				return convert.hexToRGB(core.clone(color) as colors.Hex);
			case 'hsl':
				return convert.hslToRGB(core.clone(color) as colors.HSL);
			case 'hsv':
				return convert.hsvToRGB(core.clone(color) as colors.HSV);
			case 'lab':
				return convert.labToRGB(core.clone(color) as colors.LAB);
			case 'rgb':
				return color as colors.RGB;
			case 'xyz':
				return convert.xyzToRGB(core.clone(color) as colors.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to RGB: ${error}`);

		return null;
	}
}

function hexToCMYKHelper(hex: colors.Hex): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.cmyk);
		}

		const rgb: colors.RGB = convert.hexToRGB(core.clone(hex));

		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);

		return core.clone(defaults.cmyk);
	}
}

function hexToHSLHelper(hex: colors.Hex): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.hsl);
		}

		const rgb: colors.RGB = convert.hexToRGB(core.clone(hex));

		return convert.rgbToHSL(rgb);
	} catch (error) {
		console.error(`Error converting hex to HSL: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function hexToHSVHelper(hex: colors.Hex): colors.HSV {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.hsv);
		}

		const rgb: colors.RGB = convert.hexToRGB(core.clone(hex));

		return convert.rgbToHSV(rgb);
	} catch (error) {
		console.error(`Error converting hex to HSV: ${error}`);

		return core.clone(defaults.hsv);
	}
}

function hexToXYZHelper(hex: colors.Hex): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.xyz);
		}

		const lab: colors.LAB = convert.hexToLAB(core.clone(hex));
		const xyz: colors.XYZ = convert.labToXYZ(lab);

		return xyz;
	} catch (error) {
		console.error(`Error converting hex to XYZ: ${error}`);

		return core.clone(defaults.xyz);
	}
}

export function hueToRGB(p: number, q: number, t: number): number {
	try {
		const clonedP = core.clone(p);
		const clonedQ = core.clone(q);
		let clonedT = core.clone(t);

		if (clonedT < 0) clonedT += 1;
		if (clonedT > 1) clonedT -= 1;
		if (clonedT < 1 / 6) return clonedP + (clonedQ - clonedP) * 6 * clonedT;
		if (clonedT < 1 / 2) return clonedQ;
		if (clonedT < 2 / 3)
			return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;

		return clonedP;
	} catch (error) {
		console.error(`Error converting hue to RGB: ${error}`);

		return 0;
	}
}

function hslAddFormat(value: colors.HSLValue): colors.HSL {
	try {
		if (
			!paletteHelpers.validateColorValues({ value: value, format: 'hsl' })
		) {
			console.error(`Invalid HSL value ${JSON.stringify(value)}`);

			return core.clone(defaults.hsl);
		}

		return { value: value, format: 'hsl' } as colors.HSL;
	} catch (error) {
		console.error(`Error adding HSL format: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function hslToCMYKHelper(hsl: colors.HSL): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.cmyk);
		}

		const rgb: colors.RGB = convert.hslToRGB(core.clone(hsl));
		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting HSL to CMYK: ${error}`);

		return core.clone(defaults.cmyk);
	}
}

function hslToHexHelper(hsl: colors.HSL): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.hex);
		}

		const rgb: colors.RGB = convert.hslToRGB(core.clone(hsl));

		return convert.rgbToHex(rgb);
	} catch (error) {
		console.error(`Error converting HSL to hex: ${error}`);

		return core.clone(defaults.hex);
	}
}

function hslToHSVHelper(hsl: colors.HSL): colors.HSV {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.hsv);
		}

		const rgb: colors.RGB = convert.hslToRGB(core.clone(hsl));

		return convert.rgbToHSV(rgb);
	} catch (error) {
		console.error(`Error converting HSL to HSV: ${error}`);

		return core.clone(defaults.hsv);
	}
}

function hslToXYZHelper(hsl: colors.HSL): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.xyz);
		}

		const lab: colors.LAB = convert.hslToLAB(core.clone(hsl));

		return convert.labToXYZ(lab);
	} catch (error) {
		console.error(`Error converting HSL to XYZ: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function hsvToCMYKHelper(hsv: colors.HSV): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.cmyk);
		}

		const rgb: colors.RGB = convert.hsvToRGB(core.clone(hsv));

		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting HSV to CMYK: ${error}`);

		return core.clone(defaults.cmyk);
	}
}

function hsvToHSLHelper(hsv: colors.HSV): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.hsl);
		}

		const rgb: colors.RGB = convert.hsvToRGB(core.clone(hsv));

		return convert.rgbToHSL(rgb);
	} catch (error) {
		console.error(`Error converting HSV to HSL: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function hsvToXYZHelper(hsv: colors.HSV): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.xyz);
		}

		const rgb: colors.RGB = convert.hsvToRGB(core.clone(hsv));

		return convert.rgbToXYZ(rgb);
	} catch (error) {
		console.error(`Error converting HSV to XYZ: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function labToCMYKHelper(lab: colors.LAB): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.cmyk);
		}

		const rgb: colors.RGB = convert.labToRGB(core.clone(lab));

		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting LAB to CMYK: ${error}`);

		return core.clone(defaults.cmyk);
	}
}

function labToHSLHelper(lab: colors.LAB): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.hsl);
		}

		const rgb: colors.RGB = convert.labToRGB(core.clone(lab));

		return convert.rgbToHSL(rgb);
	} catch (error) {
		console.error(`Error converting LAB to HSL: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function labToHSVHelper(lab: colors.LAB): colors.HSV {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.hsv);
		}

		const rgb: colors.RGB = convert.labToRGB(core.clone(lab));

		return convert.rgbToHSV(rgb);
	} catch (error) {
		console.error(`Error converting LAB to HSV: ${error}`);

		return core.clone(defaults.hsv);
	}
}

function labToXYZHelper(lab: colors.LAB): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.xyz);
		}

		return convert.labToXYZ(core.clone(lab));
	} catch (error) {
		console.error(`Error converting LAB to XYZ: ${error}`);

		return defaults.xyz;
	}
}

function rgbToHSLHelper(rgb: colors.RGB): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.hsl);
		}

		return convert.rgbToHSL(core.clone(rgb));
	} catch (error) {
		console.error(`Error converting RGB to HSL: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function rgbToHSVHelper(rgb: colors.RGB): colors.HSV {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.hsv);
		}

		return convert.rgbToHSV(core.clone(rgb));
	} catch (error) {
		console.error(`Error converting RGB to HSV: ${error}`);

		return core.clone(defaults.hsv);
	}
}

function xyzToCMYKHelper(xyz: colors.XYZ): colors.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.cmyk);
		}

		const lab: colors.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToCMYK(lab);
	} catch (error) {
		console.error(`Error converting XYZ to CMYK: ${error}`);

		return core.clone(defaults.cmyk);
	}
}

function xyzToHexHelper(xyz: colors.XYZ): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.hex);
		}

		const lab: colors.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToHex(lab);
	} catch (error) {
		console.error(`Error converting XYZ to hex: ${error}`);

		return core.clone(defaults.hex);
	}
}

function xyzToHSLHelper(xyz: colors.XYZ): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.hsl);
		}

		const lab: colors.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToHSL(lab);
	} catch (error) {
		console.error(`Error converting XYZ to HSL: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function xyzToHSVHelper(xyz: colors.XYZ): colors.HSV {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.hsv);
		}

		const lab: colors.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToHSV(lab);
	} catch (error) {
		console.error(`Error converting XYZ to HSV: ${error}`);

		return core.clone(defaults.hsv);
	}
}

export const conversionHelpers: fnObjects.ConversionHelpers = {
	applyGammaCorrection,
	clampRGB,
	cmykToHSLHelper,
	cmykToHSVHelper,
	cmykToXYZHelper,
	convertColorToCMYK,
	convertColorToHex,
	convertColorToHSL,
	convertColorToHSV,
	convertColorToLAB,
	convertColorToRGB,
	hexToCMYKHelper,
	hexToHSLHelper,
	hexToHSVHelper,
	hexToXYZHelper,
	hslAddFormat,
	hslToCMYKHelper,
	hslToHexHelper,
	hslToHSVHelper,
	hslToXYZHelper,
	hsvToCMYKHelper,
	hsvToHSLHelper,
	hsvToXYZHelper,
	hueToRGB,
	labToCMYKHelper,
	labToHSLHelper,
	labToHSVHelper,
	labToXYZHelper,
	rgbToHSLHelper,
	rgbToHSVHelper,
	xyzToCMYKHelper,
	xyzToHexHelper,
	xyzToHSLHelper,
	xyzToHSVHelper
};
