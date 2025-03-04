import { ByteRange, HexSet, TypeGuards } from '../../../../src/types/index.js';

export const mockTypeGuards: TypeGuards = {
	hasFormat: <T extends { format: string }>(
		value: unknown,
		expectedFormat: string
	): value is T =>
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as any).format === expectedFormat,

	hasNumericProperties: (
		obj: Record<string, unknown>,
		keys: string[]
	): boolean => keys.every(key => typeof obj[key] === 'number'),

	hasStringProperties: (
		obj: Record<string, unknown>,
		keys: string[]
	): boolean => keys.every(key => typeof obj[key] === 'string'),

	hasValueProperty: <T extends { value: unknown }>(
		value: unknown
	): value is T =>
		typeof value === 'object' && value !== null && 'value' in value,

	isByteRange: (value: unknown): value is ByteRange =>
		typeof value === 'number',

	isCMYK: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'cmyk'),

	isColor: (value: unknown): value is any =>
		mockTypeGuards.hasValueProperty(value) &&
		mockTypeGuards.hasFormat(value, (value as any)?.format),

	isColorNumMap: (value: unknown): value is any =>
		mockTypeGuards.isColor(value),

	isColorSpace: (value: unknown): value is any =>
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(
			value as string
		),

	isColorSpaceExtended: (value: unknown): value is any =>
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
			value as string
		),

	isColorStringMap: (value: unknown): value is any =>
		mockTypeGuards.isColor(value),

	isConvertibleColor: (color: any): color is any =>
		mockTypeGuards.isCMYK(color) || mockTypeGuards.isColor(color),

	isFormat: (format: unknown): format is any =>
		mockTypeGuards.isColorSpace(format),

	isHex: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'hex'),

	isHexSet: (value: unknown): value is HexSet =>
		typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value as string),

	isHSL: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'hsl'),

	isHSV: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'hsv'),

	isInputElement: (element: HTMLElement | null): element is HTMLElement =>
		element instanceof HTMLInputElement,

	isLAB: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'lab'),

	isLAB_A: (value: unknown): value is any => typeof value === 'number',

	isLAB_B: (value: unknown): value is any => typeof value === 'number',

	isLAB_L: (value: unknown): value is any => typeof value === 'number',

	isObject: (value: unknown): value is Record<string, unknown> =>
		typeof value === 'object' && value !== null,

	isPalette: (value: unknown): value is any => mockTypeGuards.isObject(value),

	isPaletteType: (value: string): value is any =>
		[
			'analogous',
			'custom',
			'complementary',
			'diadic',
			'hexadic',
			'monochromatic',
			'random',
			'splitComplementary',
			'tetradic',
			'triadic'
		].includes(value),

	isPercentile: (value: unknown): value is any => typeof value === 'number',

	isRadial: (value: unknown): value is any => typeof value === 'number',

	isRGB: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'rgb'),

	isSL: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'sl'),

	isSV: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'sv'),

	isXYZ: (value: unknown): value is any =>
		mockTypeGuards.hasFormat(value, 'xyz'),

	isXYZ_X: (value: unknown): value is any => typeof value === 'number',

	isXYZ_Y: (value: unknown): value is any => typeof value === 'number',

	isXYZ_Z: (value: unknown): value is any => typeof value === 'number'
};
