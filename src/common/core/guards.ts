// File: common/core/guards.ts

import {
	CommonFunctionsInterface,
	Color,
	ColorSpace,
	Color_StringProps
} from '../../types/index.js';

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

function isColorString(value: unknown): value is Color_StringProps {
	if (typeof value !== 'object' || value === null) return false;

	const colorString = value as Color_StringProps;
	const validStringFormats: Color_StringProps['format'][] = [
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

export const guards: CommonFunctionsInterface['core']['guards'] = {
	isColor,
	isColorSpace,
	isColorString
};
