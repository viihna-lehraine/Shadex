import { conversionMap } from '../color-conversion/conversion';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';

function isCMYK(color: types.Color): color is types.CMYK {
	return color.format === 'cmyk';
}

function isHex(color: types.Color): color is types.Hex {
	return color.format === 'hex';
}

function isHSL(color: types.Color): color is types.HSL {
	return color.format === 'hsl';
}

function isHSV(color: types.Color): color is types.HSV {
	return color.format === 'hsv';
}

function isLAB(color: types.Color): color is types.LAB {
	return color.format === 'lab';
}

function isRGB(color: types.Color): color is types.RGB {
	return color.format === 'rgb';
}

function isXYZ(color: types.Color): color is types.XYZ {
	return color.format === 'xyz';
}

// ***** SECTION 2 *****

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

// ***** SECTION 3 *****

function ensureHash(value: string): string {
	return value.startsWith('#') ? value : `#${value}`;
}

function isFormat(format: unknown): format is types.Format {
	return (
		typeof format === 'string' &&
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
			format
		)
	);
}

function isColorSpace(value: string): value is types.ColorSpace {
	return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
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

function isInputElement(element: HTMLElement | null): element is HTMLElement {
	return element instanceof HTMLInputElement;
}

function isConversion(
	from: keyof types.ConversionMap,
	to: keyof types.Color
): boolean {
	return from in conversionMap && to in conversionMap[from];
}

export const guards: fnObjects.Guards = {
	ensureHash,
	isCMYK,
	isHex,
	isHSL,
	isHSV,
	isLAB,
	isRGB,
	isXYZ,
	isHexColor,
	isColorSpace,
	isConversion,
	isConvertibleColor,
	isFormat,
	isInputElement
};
