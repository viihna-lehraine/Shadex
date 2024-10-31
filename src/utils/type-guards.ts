import { transform } from './transform';
import { conversionMap } from '../color-spaces/conversion';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as idb from '../index/idb';

// ******** SECTION 1: Robust Type Guards ********

function isColor(value: unknown): value is colors.Color {
	if (typeof value !== 'object' || value === null) return false;

	const color = value as colors.Color;
	const validFormats: colors.Color['format'][] = [
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

function isColorFormat<T extends colors.Color>(
	color: colors.Color,
	format: T['format']
): color is T {
	return color.format === format;
}

function isColorSpace(value: string): value is colors.ColorSpace {
	return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
}

function isColorSpaceExtended(
	value: string
): value is colors.ColorSpaceExtended {
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

export function isColorString(value: unknown): value is colors.ColorString {
	if (typeof value !== 'object' || value === null) return false;

	const colorString = value as colors.ColorString;
	const validStringFormats: colors.ColorString['format'][] = [
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

function isFormat(format: unknown): format is colors.Format {
	return (
		typeof format === 'string' &&
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
			format
		)
	);
}

// ******** SECTIOn 2: Narrower Type Guards ********

function isCMYKColor(value: unknown): value is colors.CMYK {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.CMYK).format === 'cmyk' &&
		'value' in value &&
		typeof (value as colors.CMYK).value.cyan === 'number' &&
		typeof (value as colors.CMYK).value.magenta === 'number' &&
		typeof (value as colors.CMYK).value.yellow === 'number' &&
		typeof (value as colors.CMYK).value.key === 'number'
	);
}

function isCMYKFormat(color: colors.Color): color is colors.CMYK {
	return isColorFormat(color, 'cmyk');
}

function isCMYKString(value: unknown): value is colors.CMYKString {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.CMYKString).format === 'cmyk' &&
		'value' in value &&
		typeof (value as colors.CMYKString).value.cyan === 'string' &&
		typeof (value as colors.CMYKString).value.magenta === 'string' &&
		typeof (value as colors.CMYKString).value.yellow === 'string' &&
		typeof (value as colors.CMYKString).value.key === 'string'
	);
}

function isHex(value: unknown): value is colors.Hex {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.Hex).format === 'hex' &&
		'value' in value &&
		typeof (value as colors.Hex).value.hex === 'string'
	);
}

function isHexFormat(color: colors.Color): color is colors.Hex {
	return isColorFormat(color, 'hex');
}

function isHSLColor(value: unknown): value is colors.HSL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.HSL).format === 'hsl' &&
		'value' in value &&
		typeof (value as colors.HSL).value.hue === 'number' &&
		typeof (value as colors.HSL).value.saturation === 'number' &&
		typeof (value as colors.HSL).value.lightness === 'number'
	);
}

function isHSLFormat(color: colors.Color): color is colors.HSL {
	return isColorFormat(color, 'hsl');
}

function isHSLString(value: unknown): value is colors.HSLString {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.HSLString).format === 'hsl' &&
		'value' in value &&
		typeof (value as colors.HSLString).value.hue === 'number' &&
		typeof (value as colors.HSLString).value.saturation === 'string' &&
		typeof (value as colors.HSLString).value.lightness === 'string'
	);
}

function isHSVColor(value: unknown): value is colors.HSV {
	return (
		isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.HSV).format === 'hsv' &&
		'value' in value &&
		typeof (value as colors.HSV).value.hue === 'number' &&
		typeof (value as colors.HSV).value.saturation === 'number' &&
		typeof (value as colors.HSV).value.value === 'number'
	);
}

function isHSVFormat(color: colors.Color): color is colors.HSV {
	return isColorFormat(color, 'hsv');
}

function isHSVString(value: unknown): value is colors.HSVString {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.HSVString).format === 'hsv' &&
		'value' in value &&
		typeof (value as colors.HSVString).value.hue === 'number' &&
		typeof (value as colors.HSVString).value.saturation === 'string' &&
		typeof (value as colors.HSVString).value.value === 'string'
	);
}

function isLAB(value: unknown): value is colors.LAB {
	return (
		isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.LAB).format === 'lab' &&
		'value' in value &&
		typeof (value as colors.LAB).value.l === 'number' &&
		typeof (value as colors.LAB).value.a === 'number' &&
		typeof (value as colors.LAB).value.b === 'number'
	);
}

function isLABFormat(color: colors.Color): color is colors.LAB {
	return isColorFormat(color, 'lab');
}

function isRGB(value: unknown): value is colors.RGB {
	return (
		isColor(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.RGB).format === 'rgb' &&
		'value' in value &&
		typeof (value as colors.RGB).value.red === 'number' &&
		typeof (value as colors.RGB).value.green === 'number' &&
		typeof (value as colors.RGB).value.blue === 'number'
	);
}

function isRGBFormat(color: colors.Color): color is colors.RGB {
	return isColorFormat(color, 'rgb');
}

function isSLColor(value: unknown): value is colors.SL {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.SL).format === 'sl' &&
		'value' in value &&
		typeof (value as colors.SL).value.saturation === 'number' &&
		typeof (value as colors.SL).value.lightness === 'number'
	);
}

function isSLFormat(color: colors.Color): color is colors.SL {
	return isColorFormat(color, 'sl');
}

function isSLString(value: unknown): value is colors.SLString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.SLString).format === 'sl' &&
		'value' in value &&
		typeof (value as colors.SLString).value.saturation === 'string' &&
		typeof (value as colors.SLString).value.lightness === 'string'
	);
}

function isSVColor(value: unknown): value is colors.SV {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.SV).format === 'sv' &&
		'value' in value &&
		typeof (value as colors.SV).value.saturation === 'number' &&
		typeof (value as colors.SV).value.value === 'number'
	);
}

function isSVFormat(color: colors.Color): color is colors.SV {
	return isColorFormat(color, 'sv');
}

function isSVString(value: unknown): value is colors.SVString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.SVString).format === 'sv' &&
		'value' in value &&
		typeof (value as colors.SVString).value.saturation === 'string' &&
		typeof (value as colors.SVString).value.value === 'string'
	);
}

function isXYZ(value: unknown): value is colors.XYZ {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as colors.XYZ).format === 'xyz' &&
		'value' in value &&
		typeof (value as colors.XYZ).value.x === 'number' &&
		typeof (value as colors.XYZ).value.y === 'number' &&
		typeof (value as colors.XYZ).value.z === 'number'
	);
}

function isXYZFormat(color: colors.Color): color is colors.XYZ {
	return isColorFormat(color, 'xyz');
}

// ***** SECTION 3: Utility Guards *****

function ensureHash(value: string): string {
	return value.startsWith('#') ? value : `#${value}`;
}

function isConversion(
	from: keyof colors.ColorDataAssertion,
	to: keyof colors.Color
): boolean {
	return from in conversionMap && to in conversionMap[from];
}

function isConvertibleColor(
	color: colors.Color
): color is
	| colors.CMYK
	| colors.Hex
	| colors.HSL
	| colors.HSV
	| colors.LAB
	| colors.RGB {
	return (
		color.format === 'cmyk' ||
		color.format === 'hex' ||
		color.format === 'hsl' ||
		color.format === 'hsv' ||
		color.format === 'lab' ||
		color.format === 'rgb'
	);
}

function isInputElement(element: HTMLElement | null): element is HTMLElement {
	return element instanceof HTMLInputElement;
}

function isStoredPalette(obj: unknown): obj is idb.StoredPalette {
	if (typeof obj !== 'object' || obj === null) return false;

	const candidate = obj as Partial<idb.StoredPalette>;

	return (
		typeof candidate.tableID === 'number' &&
		typeof candidate.palette === 'object' &&
		Array.isArray(candidate.palette.items) &&
		typeof candidate.palette.id === 'string'
	);
}

function narrowToColor(
	color: colors.Color | colors.ColorString
): colors.Color | null {
	if (isColorString(color)) {
		return transform.colorStringToColor(color);
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
	isCMYKColor,
	isCMYKFormat,
	isCMYKString,
	isColor,
	isColorFormat,
	isColorString,
	isColorSpace,
	isColorSpaceExtended,
	isConversion,
	isConvertibleColor,
	isFormat,
	isHex,
	isHexFormat,
	isHSLColor,
	isHSLFormat,
	isHSLString,
	isInputElement,
	isHSVColor,
	isHSVFormat,
	isHSVString,
	isLAB,
	isLABFormat,
	isRGB,
	isRGBFormat,
	isSLColor,
	isSLFormat,
	isSLString,
	isStoredPalette,
	isSVColor,
	isSVFormat,
	isSVString,
	isXYZ,
	isXYZFormat,
	narrowToColor
};
