// File: utils/typeGuards.js

import {
	CMYK,
	CMYK_StringProps,
	Color,
	ColorFormat,
	ColorSpace,
	ColorSpaceExtended,
	Color_StringProps,
	Hex,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	PaletteType,
	RGB,
	SL,
	SL_StringProps,
	SV,
	SV_StringProps,
	TypeGuardUtilsInterface,
	XYZ
} from '../types/index.js';

function isCMYKColor(value: unknown): value is CMYK {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as CMYK).format === 'cmyk' &&
		'value' in value &&
		typeof (value as CMYK).value.cyan === 'number' &&
		typeof (value as CMYK).value.magenta === 'number' &&
		typeof (value as CMYK).value.yellow === 'number' &&
		typeof (value as CMYK).value.key === 'number'
	);
}

function isCMYKFormat(color: Color): color is CMYK {
	return isColorFormat(color, 'cmyk');
}

function isCMYKString(value: unknown): value is CMYK_StringProps {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as CMYK_StringProps).format === 'cmyk' &&
		'value' in value &&
		typeof (value as CMYK_StringProps).value.cyan === 'string' &&
		typeof (value as CMYK_StringProps).value.magenta === 'string' &&
		typeof (value as CMYK_StringProps).value.yellow === 'string' &&
		typeof (value as CMYK_StringProps).value.key === 'string'
	);
}

function isColor(value: unknown): value is Color {
	if (typeof value !== 'object' || value === null) return false;

	const color = value as Color;
	const validFormats: Color['format'][] = [
		'cmyk',
		'hex',
		'hsl',
		'hsv',
		'lab',
		'rgb',
		'sl',
		'sv',
		'xyz'
	];

	return (
		'value' in color &&
		'format' in color &&
		validFormats.includes(color.format)
	);
}

function isColorFormat<T extends Color>(
	color: Color,
	format: T['format']
): color is T {
	return color.format === format;
}

function isColorSpace(value: unknown): value is ColorSpace {
	const validColorSpaces: ColorSpace[] = [
		'cmyk',
		'hex',
		'hsl',
		'hsv',
		'lab',
		'rgb',
		'xyz'
	];

	return (
		typeof value === 'string' &&
		validColorSpaces.includes(value as ColorSpace)
	);
}

function isColorSpaceExtended(value: string): value is ColorSpaceExtended {
	return [
		'cmyk',
		'hex',
		'hsl',
		'hsv',
		'lab',
		'rgb',
		'sl',
		'sv',
		'xyz'
	].includes(value);
}

function isColorString(value: unknown): value is Color_StringProps {
	if (typeof value !== 'object' || value === null) return false;

	const colorString = value as Color_StringProps;
	const validStringFormats: ColorSpaceExtended[] = [
		'cmyk',
		'hsl',
		'hsv',
		'lab',
		'rgb',
		'sl',
		'sv',
		'xyz'
	];

	return (
		'value' in colorString &&
		'format' in colorString &&
		validStringFormats.includes(colorString.format)
	);
}

function isConvertibleColor(
	color: Color
): color is CMYK | Hex | HSL | HSV | LAB | RGB {
	return (
		color.format === 'cmyk' ||
		color.format === 'hex' ||
		color.format === 'hsl' ||
		color.format === 'hsv' ||
		color.format === 'lab' ||
		color.format === 'rgb'
	);
}

function isFormat(format: unknown): format is ColorFormat {
	return (
		typeof format === 'string' &&
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
			format
		)
	);
}

function isHex(value: unknown): value is Hex {
	if (typeof value !== 'object' || value === null) return false;

	if (!('format' in value) || !('value' in value)) return false;

	const hexValue = value as Partial<Hex>;

	return hexValue.format === 'hex' && typeof hexValue.value?.hex === 'string';
}

function isHexFormat(color: Color): color is Hex {
	return isColorFormat(color, 'hex');
}

function isHSLColor(value: unknown): value is HSL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSL).format === 'hsl' &&
		'value' in value &&
		typeof (value as HSL).value.hue === 'number' &&
		typeof (value as HSL).value.saturation === 'number' &&
		typeof (value as HSL).value.lightness === 'number'
	);
}

function isHSLFormat(color: Color): color is HSL {
	return isColorFormat(color, 'hsl');
}

function isHSLString(value: unknown): value is HSL_StringProps {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSL_StringProps).format === 'hsl' &&
		'value' in value &&
		typeof (value as HSL_StringProps).value.hue === 'number' &&
		typeof (value as HSL_StringProps).value.saturation === 'string' &&
		typeof (value as HSL_StringProps).value.lightness === 'string'
	);
}

function isHSVColor(value: unknown): value is HSV {
	return (
		isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSV).format === 'hsv' &&
		'value' in value &&
		typeof (value as HSV).value.hue === 'number' &&
		typeof (value as HSV).value.saturation === 'number' &&
		typeof (value as HSV).value.value === 'number'
	);
}

function isHSVFormat(color: Color): color is HSV {
	return isColorFormat(color, 'hsv');
}

function isHSVString(value: unknown): value is HSV_StringProps {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSV_StringProps).format === 'hsv' &&
		'value' in value &&
		typeof (value as HSV_StringProps).value.hue === 'number' &&
		typeof (value as HSV_StringProps).value.saturation === 'string' &&
		typeof (value as HSV_StringProps).value.value === 'string'
	);
}

function isInputElement(element: HTMLElement | null): element is HTMLElement {
	return element instanceof HTMLInputElement;
}

function isLAB(value: unknown): value is LAB {
	return (
		isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as LAB).format === 'lab' &&
		'value' in value &&
		typeof (value as LAB).value.l === 'number' &&
		typeof (value as LAB).value.a === 'number' &&
		typeof (value as LAB).value.b === 'number'
	);
}

function isLABFormat(color: Color): color is LAB {
	return isColorFormat(color, 'lab');
}

function isPaletteType(value: string): value is PaletteType {
	return [
		'analogous',
		'complementary',
		'diadic',
		'hexadic',
		'monochromatic',
		'random',
		'split-complementary',
		'tetradic',
		'triadic'
	].includes(value);
}

function isRGB(value: unknown): value is RGB {
	return (
		isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as RGB).format === 'rgb' &&
		'value' in value &&
		typeof (value as RGB).value.red === 'number' &&
		typeof (value as RGB).value.green === 'number' &&
		typeof (value as RGB).value.blue === 'number'
	);
}

function isRGBFormat(color: Color): color is RGB {
	return isColorFormat(color, 'rgb');
}

function isSLColor(value: unknown): value is SL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SL).format === 'sl' &&
		'value' in value &&
		typeof (value as SL).value.saturation === 'number' &&
		typeof (value as SL).value.lightness === 'number'
	);
}

function isSLFormat(color: Color): color is SL {
	return isColorFormat(color, 'sl');
}

function isSLString(value: unknown): value is SL_StringProps {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SL_StringProps).format === 'sl' &&
		'value' in value &&
		typeof (value as SL_StringProps).value.saturation === 'string' &&
		typeof (value as SL_StringProps).value.lightness === 'string'
	);
}

function isSVColor(value: unknown): value is SV {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SV).format === 'sv' &&
		'value' in value &&
		typeof (value as SV).value.saturation === 'number' &&
		typeof (value as SV).value.value === 'number'
	);
}

function isSVFormat(color: Color): color is SV {
	return isColorFormat(color, 'sv');
}

function isSVString(value: unknown): value is SV_StringProps {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SV_StringProps).format === 'sv' &&
		'value' in value &&
		typeof (value as SV_StringProps).value.saturation === 'string' &&
		typeof (value as SV_StringProps).value.value === 'string'
	);
}

function isXYZ(value: unknown): value is XYZ {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as XYZ).format === 'xyz' &&
		'value' in value &&
		typeof (value as XYZ).value.x === 'number' &&
		typeof (value as XYZ).value.y === 'number' &&
		typeof (value as XYZ).value.z === 'number'
	);
}

function isXYZFormat(color: Color): color is XYZ {
	return isColorFormat(color, 'xyz');
}

export const typeGuards: TypeGuardUtilsInterface = {
	isCMYKColor,
	isCMYKFormat,
	isCMYKString,
	isColor,
	isColorFormat,
	isColorSpace,
	isColorSpaceExtended,
	isColorString,
	isConvertibleColor,
	isFormat,
	isHex,
	isHexFormat,
	isHSLColor,
	isHSLFormat,
	isHSLString,
	isHSVColor,
	isHSVFormat,
	isHSVString,
	isInputElement,
	isLAB,
	isLABFormat,
	isPaletteType,
	isRGB,
	isRGBFormat,
	isSLColor,
	isSLFormat,
	isSLString,
	isSVColor,
	isSVFormat,
	isSVString,
	isXYZ,
	isXYZFormat
};
