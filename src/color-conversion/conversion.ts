import { convert } from './conversion-index';
import * as types from '../index';
import { wrappers } from '../helpers/wrappers';
import { guards } from '../utils/type-guards';
import { colorToColorObject } from '../utils/transforms';
import { defaults } from '../utils/defaults';

export function getConversionFn<
	From extends keyof types.ColorDataInterface,
	To extends keyof types.ColorDataInterface
>(
	from: From,
	to: To
):
	| ((value: types.ColorDataInterface[From]) => types.ColorDataInterface[To])
	| undefined {
	const fromMap = conversionMap[from];

	if (!fromMap || !(to in fromMap)) return undefined;

	// Ensure the value parameter is correctly typed and used
	return (value: types.ColorDataInterface[From]) => {
		const conversionFn = fromMap[to] as (
			_input: types.ColorDataInterface[From]
		) => types.ColorDataInterface[To];

		return conversionFn(value); // Now `value` is properly used
	};
}

export const conversionMap: types.ConversionMap = {
	cmyk: {
		hex: convert.cmykToHex,
		hsl: convert.cmykToHSL,
		hsv: convert.cmykToHSV,
		lab: convert.cmykToLAB,
		rgb: convert.cmykToRGB,
		xyz: convert.cmykToXYZ
	},
	hex: {
		cmyk: wrappers.hexToCMYKWrapper,
		hsl: wrappers.hexToHSLWrapper,
		hsv: wrappers.hexToHSVWrapper,
		lab: wrappers.hexToLABWrapper,
		rgb: wrappers.hexToRGBWrapper,
		xyz: wrappers.hexToXYZWrapper
	},
	hsl: {
		cmyk: convert.hslToCMYK,
		hex: convert.hslToHex,
		hsv: convert.hslToHSV,
		lab: convert.hslToLAB,
		rgb: convert.hslToRGB,
		xyz: convert.hslToXYZ
	},
	hsv: {
		cmyk: convert.hsvToCMYK,
		hex: convert.hsvToHex,
		hsl: convert.hsvToHSL,
		lab: convert.hsvToLAB,
		rgb: convert.hsvToRGB,
		xyz: convert.hsvToXYZ
	},
	lab: {
		cmyk: convert.labToCMYK,
		hex: convert.labToHex,
		hsl: convert.labToHSL,
		hsv: convert.labToHSV,
		rgb: convert.labToRGB,
		xyz: convert.labToXYZ
	},
	rgb: {
		cmyk: convert.rgbToCMYK,
		hex: convert.rgbToHex,
		hsl: convert.rgbToHSL,
		hsv: convert.rgbToHSV,
		lab: convert.rgbToLAB,
		xyz: convert.rgbToXYZ
	},
	xyz: {
		cmyk: convert.xyzToCMYK,
		hex: convert.xyzToHex,
		hsl: convert.xyzToHSL,
		hsv: convert.xyzToHSV,
		lab: convert.xyzToLAB,
		rgb: convert.xyzToRGB
	}
};

export function genAllColorValues(
	color: types.ColorObjectData | types.ColorData
): Partial<Record<types.ColorFormats, types.ColorData>> {
	const colorObject = guards.isColorObjectData(color)
		? color
		: colorToColorObject(color);

	if (!colorObject) {
		throw new Error(`Invalid color data: ${JSON.stringify(color)}`);
	}

	const result: Partial<Record<types.ColorFormats, types.ColorData>> = {};

	switch (color.format) {
		case 'cmyk': {
			const cmykValue = colorObject.value as types.CMYK;
			result.cmyk = cmykValue;
			result.hex = convert.cmykToHex(cmykValue);
			result.hsl = convert.cmykToHSL(cmykValue);
			result.hsv = convert.cmykToHSV(cmykValue);
			result.lab = convert.cmykToLAB(cmykValue);
			result.rgb = convert.cmykToRGB(cmykValue);
			break;
		}
		case 'hex': {
			const hexValue = colorObject.value as types.Hex;
			result.hex = hexValue;
			result.cmyk = convert.hexToCMYK(hexValue);
			result.hsl = convert.hexToHSL(hexValue);
			result.hsv = convert.hexToHSV(hexValue);
			result.lab = convert.hexToLAB(hexValue);
			result.rgb = convert.hexToRGB(hexValue);
			break;
		}
		case 'hsl': {
			const hslValue = colorObject.value as types.HSL;
			result.cmyk = convert.hslToCMYK(hslValue);
			result.hex = convert.hslToHex(hslValue);
			result.hsl = hslValue;
			result.hsv = convert.hslToHSV(hslValue);
			result.lab = convert.hslToLAB(hslValue);
			result.rgb = convert.hslToRGB(hslValue);
			break;
		}
		case 'hsv': {
			const hsvValue = colorObject.value as types.HSV;
			result.cmyk = convert.hsvToCMYK(hsvValue);
			result.hex = convert.hsvToHex(hsvValue);
			result.hsl = convert.hsvToHSL(hsvValue);
			result.hsv = hsvValue;
			result.lab = convert.hsvToLAB(hsvValue);
			result.rgb = convert.hsvToRGB(hsvValue);
			break;
		}
		case 'lab': {
			const labValue = colorObject.value as types.LAB;
			result.cmyk = convert.labToCMYK(labValue);
			result.hex = convert.labToHex(labValue);
			result.hsl = convert.labToHSL(labValue);
			result.hsv = convert.labToHSV(labValue);
			result.lab = labValue;
			result.rgb = convert.labToRGB(labValue);
			break;
		}
		case 'rgb': {
			const rgbValue = colorObject.value as types.RGB;
			result.cmyk = convert.rgbToCMYK(rgbValue);
			result.hex = convert.rgbToHex(rgbValue);
			result.hsl = convert.rgbToHSL(rgbValue);
			result.hsv = convert.rgbToHSV(rgbValue);
			result.lab = convert.rgbToLAB(rgbValue);
			result.rgb = rgbValue;
			break;
		}
		default:
			throw new Error(`Unsupported color format: ${color.format}`);
	}

	return {
		cmyk: result.cmyk || defaults.defaultCMYK(),
		hex: result.hex || defaults.defaultHex(),
		hsl: result.hsl || defaults.defaultHSL(),
		hsv: result.hsv || defaults.defaultHSV(),
		lab: result.lab || defaults.defaultLAB(),
		rgb: result.rgb || defaults.defaultRGB()
	};
}
