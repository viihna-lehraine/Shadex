import { convert } from './conversion-index';
import * as types from '../index';
import { wrappers } from '../helpers/wrappers';

export function getConversionFn<
	From extends keyof types.ConversionData,
	To extends keyof types.ConversionData
>(
	from: From,
	to: To
):
	| ((value: types.ConversionData[From]) => types.ConversionData[To])
	| undefined {
	const fromMap = conversionMap[from];

	if (!fromMap || !(to in fromMap)) return undefined;

	const conversionFn = fromMap[to] as unknown as (
		input: types.ConversionData[From]
	) => types.ConversionData[To];

	return (value: types.ConversionData[From]): types.ConversionData[To] =>
		conversionFn(value);
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
	color: types.Color
): Partial<types.ColorData> {
	const result: Partial<types.ColorData> = {};

	switch (color.format) {
		case 'cmyk':
			result.cmyk = color;
			result.hex = convert.cmykToHex(color);
			result.hsl = convert.cmykToHSL(color);
			result.hsv = convert.cmykToHSV(color);
			result.lab = convert.cmykToLAB(color);
			result.rgb = convert.cmykToRGB(color);
			break;
		case 'hex':
			result.hex = color;
			result.cmyk = convert.hexToCMYK(color);
			result.hsl = convert.hexToHSL(color);
			result.hsv = convert.hexToHSV(color);
			result.lab = convert.hexToLAB(color);
			result.rgb = convert.hexToRGB(color);
			break;
		case 'hsl':
			result.hsl = color;
			result.cmyk = convert.hslToCMYK(color);
			result.hex = convert.hslToHex(color);
			result.hsv = convert.hslToHSV(color);
			result.lab = convert.hslToLAB(color);
			result.rgb = convert.hslToRGB(color);
			break;
		case 'hsv':
			result.hsv = color;
			result.cmyk = convert.hsvToCMYK(color);
			result.hex = convert.hsvToHex(color);
			result.hsl = convert.hsvToHSL(color);
			result.lab = convert.hsvToLAB(color);
			result.rgb = convert.hsvToRGB(color);
			break;
		case 'lab':
			result.lab = color;
			result.cmyk = convert.labToCMYK(color);
			result.hex = convert.labToHex(color);
			result.hsl = convert.labToHSL(color);
			result.hsv = convert.labToHSV(color);
			result.rgb = convert.labToRGB(color);
			break;
		case 'rgb':
			result.rgb = color;
			result.cmyk = convert.rgbToCMYK(color);
			result.hex = convert.rgbToHex(color);
			result.hsl = convert.rgbToHSL(color);
			result.hsv = convert.rgbToHSV(color);
			result.lab = convert.rgbToLAB(color);
			break;
	}

	return result;
}
