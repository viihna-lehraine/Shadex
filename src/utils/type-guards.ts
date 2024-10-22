import * as types from '../index';
import { conversionMap } from '../color-conversion/conversion';

function isCMYK(color: types.ColorData): color is types.CMYK {
	return color.format === 'cmyk';
}

function isHex(color: types.ColorData): color is types.Hex {
	return color.format === 'hex';
}

function isHSL(color: types.ColorData): color is types.HSL {
	return color.format === 'hsl';
}

function isHSV(color: types.ColorData): color is types.HSV {
	return color.format === 'hsv';
}

function isLAB(color: types.ColorData): color is types.LAB {
	return color.format === 'lab';
}

function isRGB(color: types.ColorData): color is types.RGB {
	return color.format === 'rgb';
}

function isXYZ(color: types.ColorData): color is types.XYZ {
	return color.format === 'xyz';
}

// ***** SECTION 2 *****

function isHexColor(value: unknown): value is types.Hex {
	return (
		typeof value === 'object' &&
		value !== null &&
		'hex' in value &&
		typeof (value as types.Hex).hex === 'string' &&
		(value as types.Hex).format === 'hex'
	);
}

// ***** SECTION 3 *****

function isColorObjectData(color: unknown): color is types.ColorObjectData {
	return (
		typeof color === 'object' &&
		color !== null &&
		'format' in color &&
		'value' in color
	);
}

// ***** SECTION 4 *****

function isColorFormat(format: string): format is types.ColorFormats {
	return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb'].includes(format);
}

function isColorSpace(value: string): value is types.ColorSpace {
	return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
}

// ***** SECTION 5 *****

function isInputElement(element: HTMLElement | null): element is HTMLElement {
	return element instanceof HTMLInputElement;
}

// ***** SECTION 6 *****

function isConversion(
	from: keyof types.ConversionMap,
	to: keyof types.ColorDataInterface
): boolean {
	return from in conversionMap && to in conversionMap[from];
}

export const guards = {
	isCMYK,
	isColorObjectData,
	isHex,
	isHSL,
	isHSV,
	isLAB,
	isRGB,
	isXYZ,
	isHexColor,
	isColorFormat,
	isColorSpace,
	isConversion,
	isInputElement
};
