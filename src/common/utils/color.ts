// File: src/common/utils/color.ts

import { core } from '../index';
import { config } from '../../config';
import {
	CMYK,
	CMYKString,
	CMYKValueString,
	Color,
	ColorSpace,
	ColorSpaceExtended,
	ColorString,
	Format,
	Hex,
	HexValue,
	HexValueString,
	HSL,
	HSLString,
	HSLValueString,
	HSV,
	HSVString,
	HSVValueString,
	LAB,
	LABValueString,
	RGB,
	RGBValue,
	RGBValueString,
	SL,
	SLString,
	StoredPalette,
	SV,
	SVString,
	XYZ,
	XYZValueString
} from '../../index';

// ******** SECTION 1: Robust Type Guards ********

function isColorFormat<T extends Color>(
	color: Color,
	format: T['format']
): color is T {
	return color.format === format;
}

function isColorSpace(value: string): value is ColorSpace {
	return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
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

export function isColorString(value: unknown): value is ColorString {
	if (typeof value !== 'object' || value === null) return false;

	const colorString = value as ColorString;
	const validStringFormats: ColorString['format'][] = [
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

function isFormat(format: unknown): format is Format {
	return (
		typeof format === 'string' &&
		['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(
			format
		)
	);
}

// ******** SECTIOn 2: Narrower Type Guards ********

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

function isCMYKString(value: unknown): value is CMYKString {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as CMYKString).format === 'cmyk' &&
		'value' in value &&
		typeof (value as CMYKString).value.cyan === 'string' &&
		typeof (value as CMYKString).value.magenta === 'string' &&
		typeof (value as CMYKString).value.yellow === 'string' &&
		typeof (value as CMYKString).value.key === 'string'
	);
}

function isHex(value: unknown): value is Hex {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as Hex).format === 'hex' &&
		'value' in value &&
		typeof (value as Hex).value.hex === 'string'
	);
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

function isHSLString(value: unknown): value is HSLString {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSLString).format === 'hsl' &&
		'value' in value &&
		typeof (value as HSLString).value.hue === 'number' &&
		typeof (value as HSLString).value.saturation === 'string' &&
		typeof (value as HSLString).value.lightness === 'string'
	);
}

function isHSVColor(value: unknown): value is HSV {
	return (
		core.isColor(value) &&
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

function isHSVString(value: unknown): value is HSVString {
	return (
		isColorString(value) &&
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as HSVString).format === 'hsv' &&
		'value' in value &&
		typeof (value as HSVString).value.hue === 'number' &&
		typeof (value as HSVString).value.saturation === 'string' &&
		typeof (value as HSVString).value.value === 'string'
	);
}

function isLAB(value: unknown): value is LAB {
	return (
		core.isColor(value) &&
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

function isRGB(value: unknown): value is RGB {
	return (
		core.isColor(value) &&
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

function isSLString(value: unknown): value is SLString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SLString).format === 'sl' &&
		'value' in value &&
		typeof (value as SLString).value.saturation === 'string' &&
		typeof (value as SLString).value.lightness === 'string'
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

function isSVString(value: unknown): value is SVString {
	return (
		typeof value === 'object' &&
		value !== null &&
		'format' in value &&
		(value as SVString).format === 'sv' &&
		'value' in value &&
		typeof (value as SVString).value.saturation === 'string' &&
		typeof (value as SVString).value.value === 'string'
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

// ***** SECTION 3: Utility Guards *****

function ensureHash(value: string): string {
	return value.startsWith('#') ? value : `#${value}`;
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

function isInputElement(element: HTMLElement | null): element is HTMLElement {
	return element instanceof HTMLInputElement;
}

function isStoredPalette(obj: unknown): obj is StoredPalette {
	if (typeof obj !== 'object' || obj === null) return false;

	const candidate = obj as Partial<StoredPalette>;

	return (
		typeof candidate.tableID === 'number' &&
		typeof candidate.palette === 'object' &&
		Array.isArray(candidate.palette.items) &&
		typeof candidate.palette.id === 'string'
	);
}

function narrowToColor(color: Color | ColorString): Color | null {
	if (isColorString(color)) {
		return core.colorStringToColor(color);
	}

	switch (color.format as ColorSpaceExtended) {
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

// ******** SECTION 4: TRANSFORM UTILS ********

function addHashToHex(hex: Hex): Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: {
						hex: `#${hex.value}}`,
						alpha: hex.value.alpha,
						numAlpha: hex.value.numAlpha
					},
					format: 'hex' as 'hex'
				};
	} catch (error) {
		console.error(`addHashToHex error: ${error}`);

		return config.defaults.colors.hex;
	}
}

function colorToColorString(color: Color): ColorString {
	const clonedColor = core.clone(color) as Exclude<Color, Hex>;

	if (isColorString(clonedColor)) {
		console.log(
			`Already formatted as color string: ${JSON.stringify(color)}`
		);

		return clonedColor;
	}

	const newValue = formatPercentageValues(clonedColor.value);

	if (isCMYKColor(clonedColor)) {
		return {
			format: 'cmyk',
			value: newValue as unknown as CMYKValueString
		};
	} else if (isHex(clonedColor)) {
		return {
			format: 'hex',
			value: newValue as unknown as HexValueString
		};
	} else if (isHSLColor(clonedColor)) {
		return {
			format: 'hsl',
			value: newValue as unknown as HSLValueString
		};
	} else if (isHSVColor(clonedColor)) {
		return {
			format: 'hsv',
			value: newValue as unknown as HSVValueString
		};
	} else if (isLAB(clonedColor)) {
		return {
			format: 'lab',
			value: newValue as unknown as LABValueString
		};
	} else if (isRGB(clonedColor)) {
		return {
			format: 'rgb',
			value: newValue as unknown as RGBValueString
		};
	} else if (isXYZ(clonedColor)) {
		return {
			format: 'xyz',
			value: newValue as unknown as XYZValueString
		};
	} else {
		throw new Error(`Unsupported format: ${clonedColor.format}`);
	}
}

function componentToHex(component: number): string {
	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);

		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		console.error(`componentToHex error: ${error}`);

		return '00';
	}
}

function formatColor(
	color: Color,
	asColorString: boolean = false,
	asCSSString: boolean = false
): { baseColor: Color; formattedString?: ColorString | string } {
	const baseColor = core.clone(color);

	let formattedString: ColorString | string | undefined = undefined;

	if (asColorString) {
		formattedString = colorToColorString(
			color as Exclude<Color, Hex | LAB | RGB>
		) as ColorString;
	} else if (asCSSString) {
		formattedString = core.getCSSColorString(color) as string;
	}

	return formattedString !== undefined
		? { baseColor, formattedString }
		: { baseColor };
}

function formatPercentageValues<T extends Record<string, unknown>>(
	value: T
): T {
	return Object.entries(value).reduce(
		(acc, [key, val]) => {
			(acc as Record<string, unknown>)[key] = [
				'saturation',
				'lightness',
				'value',
				'cyan',
				'magenta',
				'yellow',
				'key'
			].includes(key)
				? `${val}%`
				: val;
			return acc;
		},
		{} as Record<string, unknown>
	) as T;
}

function getAlphaFromHex(hex: string): number {
	if (hex.length !== 9 || !hex.startsWith('#')) {
		throw new Error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
	}

	const alphaHex = hex.slice(-2);
	const alphaDecimal = parseInt(alphaHex, 16);

	return alphaDecimal / 255;
}

function getColorString(color: Color): string | null {
	try {
		const formatters = {
			cmyk: (c: CMYK) =>
				`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key}, ${c.value.alpha})`,
			hex: (c: Hex) => c.value.hex,
			hsl: (c: HSL) =>
				`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%,${c.value.alpha})`,
			hsv: (c: HSV) =>
				`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%,${c.value.alpha})`,
			lab: (c: LAB) =>
				`lab(${c.value.l}, ${c.value.a}, ${c.value.b},${c.value.alpha})`,
			rgb: (c: RGB) =>
				`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue},${c.value.alpha})`,
			xyz: (c: XYZ) =>
				`xyz(${c.value.x}, ${c.value.y}, ${c.value.z},${c.value.alpha})`
		};

		switch (color.format) {
			case 'cmyk':
				return formatters.cmyk(color);
			case 'hex':
				return formatters.hex(color);
			case 'hsl':
				return formatters.hsl(color);
			case 'hsv':
				return formatters.hsv(color);
			case 'lab':
				return formatters.lab(color);
			case 'rgb':
				return formatters.rgb(color);
			case 'xyz':
				return formatters.xyz(color);
			default:
				console.error(`Unsupported color format for ${color}`);

				return null;
		}
	} catch (error) {
		console.error(`getColorString error: ${error}`);

		return null;
	}
}

function hexAlphaToNumericAlpha(hexAlpha: string): number {
	return parseInt(hexAlpha, 16) / 255;
}

const parseColor = (colorSpace: ColorSpace, value: string): Color | null => {
	try {
		switch (colorSpace) {
			case 'cmyk': {
				const [c, m, y, k, a] = parseComponents(value, 5);

				return {
					value: { cyan: c, magenta: m, yellow: y, key: k, alpha: a },
					format: 'cmyk'
				};
			}
			case 'hex':
				const hexValue = value.startsWith('#') ? value : `#${value}`;
				const alpha = hexValue.length === 9 ? hexValue.slice(-2) : 'FF';
				const numAlpha = hexAlphaToNumericAlpha(alpha);

				return {
					value: {
						hex: hexValue,
						alpha,
						numAlpha
					},
					format: 'hex'
				};
			case 'hsl': {
				const [h, s, l, a] = parseComponents(value, 4);

				return {
					value: { hue: h, saturation: s, lightness: l, alpha: a },
					format: 'hsl'
				};
			}
			case 'hsv': {
				const [h, s, v, a] = parseComponents(value, 4);

				return {
					value: { hue: h, saturation: s, value: v, alpha: a },
					format: 'hsv'
				};
			}
			case 'lab': {
				const [l, a, b, alpha] = parseComponents(value, 4);
				return { value: { l, a, b, alpha }, format: 'lab' };
			}
			case 'rgb': {
				const [r, g, b, a] = value.split(',').map(Number);

				return {
					value: { red: r, green: g, blue: b, alpha: a },
					format: 'rgb'
				};
			}
			default:
				throw new Error(`Unsupported color format: ${colorSpace}`);
		}
	} catch (error) {
		console.error(`parseColor error: ${error}`);

		return null;
	}
};

function parseComponents(value: string, count: number): number[] {
	try {
		const components = value
			.split(',')
			.map(val =>
				val.trim().endsWith('%')
					? parseFloat(val)
					: parseFloat(val) * 100
			);

		if (components.length !== count)
			throw new Error(`Expected ${count} components.`);

		return components;
	} catch (error) {
		console.error(`Error parsing components: ${error}`);

		return [];
	}
}

function parseHexWithAlpha(hexValue: string): HexValue | null {
	const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
	const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
	const numAlpha = hexAlphaToNumericAlpha(alpha);

	return { hex, alpha, numAlpha };
}

function stripHashFromHex(hex: Hex): Hex {
	try {
		const hexString = `${hex.value.hex}${hex.value.alpha}`;

		return hex.value.hex.startsWith('#')
			? {
					value: {
						hex: hexString.slice(1),
						alpha: hex.value.alpha,
						numAlpha: hexAlphaToNumericAlpha(hex.value.alpha)
					},
					format: 'hex' as 'hex'
				}
			: hex;
	} catch (error) {
		console.error(`stripHashFromHex error: ${error}`);

		return core.clone(config.defaults.colors.hex);
	}
}

function stripPercentFromValues<T extends Record<string, number | string>>(
	value: T
): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] } {
	return Object.entries(value).reduce(
		(acc, [key, val]) => {
			const parsedValue =
				typeof val === 'string' && val.endsWith('%')
					? parseFloat(val.slice(0, -1))
					: val;
			acc[key as keyof T] = parsedValue as T[keyof T] extends `${number}%`
				? number
				: T[keyof T];
			return acc;
		},
		{} as { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] }
	);
}

function toHexWithAlpha(rgbValue: RGBValue): string {
	const { red, green, blue, alpha } = rgbValue;

	const hex = `#${((1 << 24) + (red << 16) + (green << 8) + blue)
		.toString(16)
		.slice(1)}`;
	const alphaHex = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, '0');

	return `${hex}${alphaHex}`;
}

export const color = {
	addHashToHex,
	colorToColorString,
	componentToHex,
	ensureHash,
	formatColor,
	formatPercentageValues,
	getAlphaFromHex,
	getColorString,
	hexAlphaToNumericAlpha,
	isCMYKColor,
	isCMYKFormat,
	isCMYKString,
	isColorFormat,
	isColorString,
	isColorSpace,
	isColorSpaceExtended,
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
	narrowToColor,
	parseColor,
	parseComponents,
	parseHexWithAlpha,
	stripHashFromHex,
	stripPercentFromValues,
	toHexWithAlpha
};
