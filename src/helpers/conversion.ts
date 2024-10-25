import { convert } from '../color-conversion/conversion-index';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { core } from '../utils/core';
import { defaults } from '../utils/defaults';

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

function clampRGB(rgb: types.RGB): types.RGB {
	if (!paletteHelpers.validateColorValues(rgb)) {
		console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

		return core.clone(defaults.defaultRGB());
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

function cmykToXYZHelper(cmyk: types.CMYK): types.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.defaultXYZ());
		}

		const rgb: types.RGB = convert.cmykToRGB(core.clone(cmyk));

		return convert.rgbToXYZ(rgb);
	} catch (error) {
		console.error(`Error converting CMYK to XYZ: ${error}`);

		return core.clone(defaults.defaultXYZ());
	}
}

function convertColorToCMYK(color: types.Color): types.CMYK | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.defaultCMYK());
		}

		switch (color.format) {
			case 'cmyk':
				return color as types.CMYK;
			case 'hex':
				return hexToCMYKHelper(core.clone(color) as types.Hex);
			case 'hsl':
				return hslToCMYKHelper(core.clone(color) as types.HSL);
			case 'hsv':
				return hsvToCMYKHelper(core.clone(color) as types.HSV);
			case 'lab':
				return labToCMYKHelper(core.clone(color) as types.LAB);
			case 'rgb':
				return convert.rgbToCMYK(core.clone(color) as types.RGB);
			case 'xyz':
				return convert.xyzToCMYK(core.clone(color) as types.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to CMYK: ${error}`);

		return null;
	}
}

function convertColorToHex(color: types.Color): types.Hex | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.defaultHex());
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHex(core.clone(color) as types.CMYK);
			case 'hex':
				return color as types.Hex;
			case 'hsl':
				return convert.hslToHex(core.clone(color) as types.HSL);
			case 'hsv':
				return convert.hsvToHex(core.clone(color) as types.HSV);
			case 'lab':
				return convert.labToHex(core.clone(color) as types.LAB);
			case 'rgb':
				return convert.rgbToHex(core.clone(color) as types.RGB);
			case 'xyz':
				return convert.xyzToHex(core.clone(color) as types.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to hex: ${error}`);

		return null;
	}
}

function convertColorToHSL(color: types.Color): types.HSL | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.defaultHSL());
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHSL(core.clone(color) as types.CMYK);
			case 'hex':
				return convert.hexToHSL(core.clone(color) as types.Hex);
			case 'hsl':
				return color as types.HSL;
			case 'hsv':
				return convert.hsvToHSL(core.clone(color) as types.HSV);
			case 'lab':
				return convert.labToHSL(core.clone(color) as types.LAB);
			case 'rgb':
				return convert.rgbToHSL(core.clone(color) as types.RGB);
			case 'xyz':
				return convert.xyzToHSL(core.clone(color) as types.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to HSL: ${error}`);

		return null;
	}
}

function convertColorToHSV(color: types.Color): types.HSV | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.defaultHSV());
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHSV(core.clone(color) as types.CMYK);
			case 'hex':
				return convert.hexToHSV(core.clone(color) as types.Hex);
			case 'hsl':
				return convert.hslToHSV(core.clone(color) as types.HSL);
			case 'hsv':
				return color as types.HSV;
			case 'lab':
				return convert.labToHSV(core.clone(color) as types.LAB);
			case 'rgb':
				return convert.rgbToHSV(core.clone(color) as types.RGB);
			case 'xyz':
				return convert.xyzToHSV(core.clone(color) as types.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to HSV: ${error}`);

		return null;
	}
}

function convertColorToLAB(color: types.Color): types.LAB | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.defaultLAB());
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToLAB(core.clone(color) as types.CMYK);
			case 'hex':
				return convert.hexToLAB(core.clone(color) as types.Hex);
			case 'hsl':
				return convert.hslToLAB(core.clone(color) as types.HSL);
			case 'hsv':
				return convert.hsvToLAB(core.clone(color) as types.HSV);
			case 'lab':
				return color as types.LAB;
			case 'rgb':
				return convert.rgbToLAB(core.clone(color) as types.RGB);
			case 'xyz':
				return convert.xyzToLAB(core.clone(color) as types.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to LAB: ${error}`);

		return null;
	}
}

function convertColorToRGB(color: types.Color): types.RGB | null {
	try {
		if (!paletteHelpers.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.defaultRGB());
		}

		switch (color.format) {
			case 'cmyk':
				return convert.cmykToRGB(core.clone(color) as types.CMYK);
			case 'hex':
				return convert.hexToRGB(core.clone(color) as types.Hex);
			case 'hsl':
				return convert.hslToRGB(core.clone(color) as types.HSL);
			case 'hsv':
				return convert.hsvToRGB(core.clone(color) as types.HSV);
			case 'lab':
				return convert.labToRGB(core.clone(color) as types.LAB);
			case 'rgb':
				return color as types.RGB;
			case 'xyz':
				return convert.xyzToRGB(core.clone(color) as types.XYZ);
			default:
				console.error('Unsupported color format');

				return null;
		}
	} catch (error) {
		console.error(`Error converting color to RGB: ${error}`);

		return null;
	}
}

function hexToCMYKHelper(hex: types.Hex): types.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const rgb: types.RGB = convert.hexToRGB(core.clone(hex));

		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function hexToXYZHelper(hex: types.Hex): types.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.defaultXYZ());
		}

		const lab: types.LAB = convert.hexToLAB(core.clone(hex));
		const xyz: types.XYZ = convert.labToXYZ(lab);

		return xyz;
	} catch (error) {
		console.error(`Error converting hex to XYZ: ${error}`);

		return core.clone(defaults.defaultXYZ());
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

function hslAddFormat(value: types.HSLValue): types.HSL {
	try {
		if (
			!paletteHelpers.validateColorValues({ value: value, format: 'hsl' })
		) {
			console.error(`Invalid HSL value ${JSON.stringify(value)}`);

			return core.clone(defaults.defaultHSL());
		}

		return { value: value, format: 'hsl' } as types.HSL;
	} catch (error) {
		console.error(`Error adding HSL format: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

function hslToCMYKHelper(hsl: types.HSL): types.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const rgb: types.RGB = convert.hslToRGB(core.clone(hsl));
		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting HSL to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function hslToHexHelper(hsl: types.HSL): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.defaultHex());
		}

		const rgb: types.RGB = convert.hslToRGB(core.clone(hsl));

		return convert.rgbToHex(rgb);
	} catch (error) {
		console.error(`Error converting HSL to hex: ${error}`);

		return core.clone(defaults.defaultHex());
	}
}

function hslToXYZHelper(hsl: types.HSL): types.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.defaultXYZ());
		}

		const lab: types.LAB = convert.hslToLAB(core.clone(hsl));

		return convert.labToXYZ(lab);
	} catch (error) {
		console.error(`Error converting HSL to XYZ: ${error}`);

		return core.clone(defaults.defaultXYZ());
	}
}

function hsvToCMYKHelper(hsv: types.HSV): types.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const rgb: types.RGB = convert.hsvToRGB(core.clone(hsv));

		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting HSV to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function hsvToXYZHelper(hsv: types.HSV): types.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.defaultXYZ());
		}

		const rgb: types.RGB = convert.hsvToRGB(core.clone(hsv));

		return convert.rgbToXYZ(rgb);
	} catch (error) {
		console.error(`Error converting HSV to XYZ: ${error}`);

		return core.clone(defaults.defaultXYZ());
	}
}

function labToCMYKHelper(lab: types.LAB): types.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const rgb: types.RGB = convert.labToRGB(core.clone(lab));

		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting LAB to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function labToXYZHelper(lab: types.LAB): types.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.defaultXYZ());
		}

		return convert.labToXYZ(core.clone(lab));
	} catch (error) {
		console.error(`Error converting LAB to XYZ: ${error}`);

		return defaults.defaultXYZ();
	}
}

function xyzToCMYKHelper(xyz: types.XYZ): types.CMYK {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultCMYK());
		}

		const lab: types.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToCMYK(lab);
	} catch (error) {
		console.error(`Error converting XYZ to CMYK: ${error}`);

		return core.clone(defaults.defaultCMYK());
	}
}

function xyzToHexHelper(xyz: types.XYZ): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultHex());
		}

		const lab: types.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToHex(lab);
	} catch (error) {
		console.error(`Error converting XYZ to hex: ${error}`);

		return core.clone(defaults.defaultHex());
	}
}

function xyzToHSLHelper(xyz: types.XYZ): types.HSL {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultHSL());
		}

		const lab: types.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToHSL(lab);
	} catch (error) {
		console.error(`Error converting XYZ to HSL: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

function xyzToHSVHelper(xyz: types.XYZ): types.HSV {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultHSV());
		}

		const lab: types.LAB = convert.xyzToLAB(core.clone(xyz));

		return convert.labToHSV(lab);
	} catch (error) {
		console.error(`Error converting XYZ to HSV: ${error}`);

		return core.clone(defaults.defaultHSV());
	}
}

export const conversionHelpers: fnObjects.ConversionHelpers = {
	applyGammaCorrection,
	clampRGB,
	cmykToXYZHelper,
	convertColorToCMYK,
	convertColorToHex,
	convertColorToHSL,
	convertColorToHSV,
	convertColorToLAB,
	convertColorToRGB,
	hexToCMYKHelper,
	hexToXYZHelper,
	hslAddFormat,
	hslToCMYKHelper,
	hslToHexHelper,
	hslToXYZHelper,
	hsvToCMYKHelper,
	hsvToXYZHelper,
	hueToRGB,
	labToCMYKHelper,
	labToXYZHelper,
	xyzToCMYKHelper,
	xyzToHexHelper,
	xyzToHSLHelper,
	xyzToHSVHelper
};
