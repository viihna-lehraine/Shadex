import { convert } from '../color-conversion/conversion-index';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
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
		const rgb: types.RGB = convert.cmykToRGB(cmyk);
		return convert.rgbToXYZ(rgb);
	} catch (error) {
		console.error(`Error converting CMYK to XYZ: ${error}`);
		return defaults.defaultXYZ();
	}
}

function convertColorToHex(color: types.Color): types.Hex | null {
	try {
		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHex(color as types.CMYK);
			case 'hex':
				return color as types.Hex;
			case 'hsl':
				return convert.hslToHex(color as types.HSL);
			case 'hsv':
				return convert.hsvToHex(color as types.HSV);
			case 'lab':
				return convert.labToHex(color as types.LAB);
			case 'rgb':
				return convert.rgbToHex(color as types.RGB);
			case 'xyz':
				return convert.xyzToHex(color as types.XYZ);
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
		switch (color.format) {
			case 'cmyk':
				return convert.cmykToHSL(color as types.CMYK);
			case 'hex':
				return convert.hexToHSL(color as types.Hex);
			case 'hsl':
				return color as types.HSL;
			case 'hsv':
				return convert.hsvToHSL(color as types.HSV);
			case 'lab':
				return convert.labToHSL(color as types.LAB);
			case 'rgb':
				return convert.rgbToHSL(color as types.RGB);
			case 'xyz':
				return convert.xyzToHSL(color as types.XYZ);
			default:
				console.error('Unsupported color format');
				return null;
		}
	} catch (error) {
		console.error(`Error converting color to HSL: ${error}`);
		return null;
	}
}

function hexToCMYKHelper(hex: types.Hex): types.CMYK {
	try {
		const rgb: types.RGB = convert.hexToRGB(hex);
		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

function hexToXYZHelper(hex: types.Hex): types.XYZ {
	try {
		const lab: types.LAB = convert.hexToLAB(hex);
		const xyz: types.XYZ = convert.labToXYZ(lab);
		return xyz;
	} catch (error) {
		console.error(`Error converting hex to XYZ: ${error}`);
		return defaults.defaultXYZ();
	}
}

export function hueToRGB(p: number, q: number, t: number): number {
	try {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

		return p;
	} catch (error) {
		console.error(`Error converting hue to RGB: ${error}`);
		return 0;
	}
}

function hslAddFormat(value: types.HSLValue): types.HSL {
	try {
		return { value: value, format: 'hsl' } as types.HSL;
	} catch (error) {
		console.error(`Error adding HSL format: ${error}`);
		return defaults.defaultHSL();
	}
}

function hslToCMYKHelper(hsl: types.HSL): types.CMYK {
	try {
		const rgb: types.RGB = convert.hslToRGB(hsl);
		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting HSL to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

function hslToHexHelper(hsl: types.HSL): types.Hex {
	try {
		const rgb: types.RGB = convert.hslToRGB(hsl);
		return convert.rgbToHex(rgb);
	} catch (error) {
		console.error(`Error converting HSL to hex: ${error}`);
		return defaults.defaultHex();
	}
}

function hslToXYZHelper(hsl: types.HSL): types.XYZ {
	try {
		const lab: types.LAB = convert.hslToLAB(hsl);
		return convert.labToXYZ(lab);
	} catch (error) {
		console.error(`Error converting HSL to XYZ: ${error}`);
		return defaults.defaultXYZ();
	}
}

function hsvToCMYKHelper(hsv: types.HSV): types.CMYK {
	try {
		const rgb: types.RGB = convert.hsvToRGB(hsv);
		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting HSV to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

function hsvToXYZHelper(hsv: types.HSV): types.XYZ {
	try {
		const rgb: types.RGB = convert.hsvToRGB(hsv);
		return convert.rgbToXYZ(rgb);
	} catch (error) {
		console.error(`Error converting HSV to XYZ: ${error}`);
		return defaults.defaultXYZ();
	}
}

function labToCMYKHelper(lab: types.LAB): types.CMYK {
	try {
		const rgb: types.RGB = convert.labToRGB(lab);
		return convert.rgbToCMYK(rgb);
	} catch (error) {
		console.error(`Error converting LAB to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

function labToXYZHelper(lab: types.LAB): types.XYZ {
	try {
		return convert.labToXYZ(lab);
	} catch (error) {
		console.error(`Error converting LAB to XYZ: ${error}`);
		return defaults.defaultXYZ();
	}
}

function xyzToCMYKHelper(xyz: types.XYZ): types.CMYK {
	try {
		const lab: types.LAB = convert.xyzToLAB(xyz);
		return convert.labToCMYK(lab);
	} catch (error) {
		console.error(`Error converting XYZ to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

function xyzToHexHelper(xyz: types.XYZ): types.Hex {
	try {
		const lab: types.LAB = convert.xyzToLAB(xyz);
		return convert.labToHex(lab);
	} catch (error) {
		console.error(`Error converting XYZ to hex: ${error}`);
		return defaults.defaultHex();
	}
}

function xyzToHSLHelper(xyz: types.XYZ): types.HSL {
	try {
		const lab: types.LAB = convert.xyzToLAB(xyz);
		return convert.labToHSL(lab);
	} catch (error) {
		console.error(`Error converting XYZ to HSL: ${error}`);
		return defaults.defaultHSL();
	}
}

function xyzToHSVHelper(xyz: types.XYZ): types.HSV {
	try {
		const lab: types.LAB = convert.xyzToLAB(xyz);
		return convert.labToHSV(lab);
	} catch (error) {
		console.error(`Error converting XYZ to HSV: ${error}`);
		return defaults.defaultHSV();
	}
}

export const conversionHelpers: fnObjects.ConversionHelpers = {
	applyGammaCorrection,
	clampRGB,
	cmykToXYZHelper,
	convertColorToHex,
	convertColorToHSL,
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
