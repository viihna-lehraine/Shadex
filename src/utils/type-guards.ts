import { transforms } from './transforms';
import { conversionMap } from '../color-conversion/conversion';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';

function isCMYK(
	color: types.Color | types.ColorString
): color is types.CMYK | types.CMYKString {
	return color.format === 'cmyk';
}

function isHex(color: types.Color | types.ColorString): color is types.Hex {
	return color.format === 'hex';
}

function isHSL(
	color: types.Color | types.ColorString
): color is types.HSL | types.HSLString {
	return color.format === 'hsl';
}

function isHSV(
	color: types.Color | types.ColorString
): color is types.HSV | types.HSVString {
	return color.format === 'hsv';
}

function isLAB(color: types.Color | types.ColorString): color is types.LAB {
	return color.format === 'lab';
}

function isRGB(color: types.Color | types.ColorString): color is types.RGB {
	return color.format === 'rgb';
}

function isSL(
	color: types.Color | types.ColorString
): color is types.SL | types.SLString {
	return color.format === 'sl';
}

function isSV(
	color: types.Color | types.ColorString
): color is types.SV | types.SVString {
	return color.format === 'sv';
}

function isXYZ(color: types.Color | types.ColorString): color is types.XYZ {
	return color.format === 'xyz';
}

// ***** SECTION 2 *****

function isCMYKColor(value: unknown): value is types.CMYK {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.CMYK).format === 'cmyk' &&
		'value' in value &&
		typeof (value as types.CMYK).value.cyan === 'number' &&
		typeof (value as types.CMYK).value.magenta === 'number' &&
		typeof (value as types.CMYK).value.yellow === 'number' &&
		typeof (value as types.CMYK).value.key === 'number'
	);
}

function isCMYKString(value: unknown): value is types.CMYKString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.CMYKString).format === 'cmyk' &&
		'value' in value &&
		typeof (value as types.CMYKString).value.cyan === 'string' &&
		typeof (value as types.CMYKString).value.magenta === 'string' &&
		typeof (value as types.CMYKString).value.yellow === 'string' &&
		typeof (value as types.CMYKString).value.key === 'string'
	);
}

function isHexColor(value: unknown): value is types.Hex {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.Hex).format === 'hex' &&
		'value' in value &&
		typeof (value as types.Hex).value.hex === 'string'
	);
}

function isHSLColor(value: unknown): value is types.HSL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.HSL).format === 'hsl' &&
		'value' in value &&
		typeof (value as types.HSL).value.hue === 'number' &&
		typeof (value as types.HSL).value.saturation === 'number' &&
		typeof (value as types.HSL).value.lightness === 'number'
	);
}

function isHSLString(value: unknown): value is types.HSLString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.HSLString).format === 'hsl' &&
		'value' in value &&
		typeof (value as types.HSLString).value.hue === 'number' &&
		typeof (value as types.HSLString).value.saturation === 'string' &&
		typeof (value as types.HSLString).value.lightness === 'string'
	);
}

function isHSVColor(value: unknown): value is types.HSV {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.HSV).format === 'hsv' &&
		'value' in value &&
		typeof (value as types.HSV).value.hue === 'number' &&
		typeof (value as types.HSV).value.saturation === 'number' &&
		typeof (value as types.HSV).value.value === 'number'
	);
}

function isHSVString(value: unknown): value is types.HSVString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.HSVString).format === 'hsv' &&
		'value' in value &&
		typeof (value as types.HSVString).value.hue === 'number' &&
		typeof (value as types.HSVString).value.saturation === 'string' &&
		typeof (value as types.HSVString).value.value === 'string'
	);
}

function isSLColor(value: unknown): value is types.SL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.SL).format === 'sl' &&
		'value' in value &&
		typeof (value as types.SL).value.saturation === 'number' &&
		typeof (value as types.SL).value.lightness === 'number'
	);
}

function isSLString(value: unknown): value is types.SLString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.SLString).format === 'sl' &&
		'value' in value &&
		typeof (value as types.SLString).value.saturation === 'string' &&
		typeof (value as types.SLString).value.lightness === 'string'
	);
}

function isSVColor(value: unknown): value is types.SV {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.SV).format === 'sv' &&
		'value' in value &&
		typeof (value as types.SV).value.saturation === 'number' &&
		typeof (value as types.SV).value.value === 'number'
	);
}

function isSVString(value: unknown): value is types.SVString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as types.SVString).format === 'sv' &&
		'value' in value &&
		typeof (value as types.SVString).value.saturation === 'string' &&
		typeof (value as types.SVString).value.value === 'string'
	);
}

// ***** SECTION 3 *****

function ensureHash(value: string): string {
	return value.startsWith('#') ? value : `#${value}`;
}

function isColor(value: unknown): value is types.Color {
	if (typeof value !== 'object' || value === null) return false;

	const color = value as types.Color;
	const validFormats: types.Color['format'][] = [
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

export function isColorString(value: unknown): value is types.ColorString {
	if (typeof value !== 'object' || value === null) return false;

	const colorString = value as types.ColorString;
	const validStringFormats: types.ColorString['format'][] = [
		'cmyk',
		'hsl',
		'hsv',
		'sl',
		'sv'
	];

	return (
		'value' in colorString &&
		'format' in colorString &&
		validStringFormats.includes(colorString.format)
	);
}

function isColorSpace(value: string): value is types.ColorSpace {
	return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
}

function isColorSpaceExtended(
	value: string
): value is types.ColorSpaceExtended {
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

function isConversion(
	from: keyof types.ConversionMap,
	to: keyof types.Color
): boolean {
	return from in conversionMap && to in conversionMap[from];
}

function isConvertibleColor(
	color: types.Color
): color is
	| types.CMYK
	| types.Hex
	| types.HSL
	| types.HSV
	| types.LAB
	| types.RGB {
	return (
		color.format === 'cmyk' ||
		color.format === 'hex' ||
		color.format === 'hsl' ||
		color.format === 'hsv' ||
		color.format === 'lab' ||
		color.format === 'rgb'
	);
}

function isFormat(format: unknown): format is types.Format {
	return (
		typeof format === 'string' &&
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
			format
		)
	);
}

function isInputElement(element: HTMLElement | null): element is HTMLElement {
	return element instanceof HTMLInputElement;
}

function narrowToColor(
	color: types.Color | types.ColorString
): types.Color | null {
	if (isColorString(color)) {
		return transforms.colorStringToColor(color);
	}

	switch (color.format) {
		case 'cmyk':
		case 'hex':
		case 'hsl':
		case 'hsv':
		case 'lab':
		case 'sl':
		case 'sv':
		case 'rgb':
		case 'xyz':
			return color;
		default:
			return null;
	}
}

export const guards: fnObjects.Guards = {
	ensureHash,
	isCMYK,
	isCMYKColor,
	isCMYKString,
	isColor,
	isColorString,
	isColorSpace,
	isColorSpaceExtended,
	isConversion,
	isConvertibleColor,
	isFormat,
	isHex,
	isHexColor,
	isHSL,
	isHSLColor,
	isHSLString,
	isInputElement,
	isHSV,
	isHSVColor,
	isHSVString,
	isLAB,
	isRGB,
	isSL,
	isSLColor,
	isSLString,
	isSV,
	isSVColor,
	isSVString,
	isXYZ,
	narrowToColor
};
