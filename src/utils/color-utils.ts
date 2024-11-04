import { core } from './core-utils';
import { defaults } from '../config/defaults';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as idb from '../index/database';

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
		return colorStringToColor(color);
	}

	switch (color.format as colors.ColorSpaceExtended) {
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

function addHashToHex(hex: colors.Hex): colors.Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: {
						hex: `#${hex.value}}`,
						alpha: hex.value.alpha,
						numericAlpha: hex.value.numericAlpha
					},
					format: 'hex' as 'hex'
				};
	} catch (error) {
		console.error(`addHashToHex error: ${error}`);

		return defaults.hex;
	}
}

function colorStringToColor(colorString: colors.ColorString): colors.Color {
	const clonedColor = core.clone(colorString);

	const parseValue = (value: string | number): number =>
		typeof value === 'string' && value.endsWith('%')
			? parseFloat(value.slice(0, -1))
			: Number(value);

	const newValue = Object.entries(clonedColor.value).reduce(
		(acc, [key, val]) => {
			acc[key as keyof (typeof clonedColor)['value']] = parseValue(
				val
			) as never;
			return acc;
		},
		{} as Record<keyof (typeof clonedColor)['value'], number>
	);

	switch (clonedColor.format) {
		case 'cmyk':
			return { format: 'cmyk', value: newValue as colors.CMYKValue };
		case 'hsl':
			return { format: 'hsl', value: newValue as colors.HSLValue };
		case 'hsv':
			return { format: 'hsv', value: newValue as colors.HSVValue };
		case 'sl':
			return { format: 'sl', value: newValue as colors.SLValue };
		case 'sv':
			return { format: 'sv', value: newValue as colors.SVValue };
		default:
			throw new Error('Unsupported format for colorStringToColor');
	}
}

function colorToColorString(color: colors.Color): colors.ColorString {
	const clonedColor = core.clone(color) as Exclude<colors.Color, colors.Hex>;

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
			value: newValue as unknown as colors.CMYKValueString
		};
	} else if (isHex(clonedColor)) {
		return {
			format: 'hex',
			value: newValue as unknown as colors.HexValueString
		};
	} else if (isHSLColor(clonedColor)) {
		return {
			format: 'hsl',
			value: newValue as unknown as colors.HSLValueString
		};
	} else if (isHSVColor(clonedColor)) {
		return {
			format: 'hsv',
			value: newValue as unknown as colors.HSVValueString
		};
	} else if (isLAB(clonedColor)) {
		return {
			format: 'lab',
			value: newValue as unknown as colors.LABValueString
		};
	} else if (isRGB(clonedColor)) {
		return {
			format: 'rgb',
			value: newValue as unknown as colors.RGBValueString
		};
	} else if (isXYZ(clonedColor)) {
		return {
			format: 'xyz',
			value: newValue as unknown as colors.XYZValueString
		};
	} else {
		throw new Error(`Unsupported format: ${clonedColor.format}`);
	}
}

function formatColor(
	color: colors.Color,
	asColorString: boolean = false,
	asCSSString: boolean = false
): { baseColor: colors.Color; formattedString?: colors.ColorString | string } {
	const baseColor = core.clone(color);

	let formattedString: colors.ColorString | string | undefined = undefined;

	if (asColorString) {
		formattedString = colorToColorString(
			color as Exclude<colors.Color, colors.Hex | colors.LAB | colors.RGB>
		) as colors.ColorString;
	} else if (asCSSString) {
		formattedString = getCSSColorString(color) as string;
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

function componentToHex(component: number): string {
	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);

		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		console.error(`componentToHex error: ${error}`);

		return '00';
	}
}

function getColorString(color: colors.Color): string | null {
	try {
		const formatters = {
			cmyk: (c: colors.CMYK) =>
				`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key}, ${c.value.alpha})`,
			hex: (c: colors.Hex) => c.value.hex,
			hsl: (c: colors.HSL) =>
				`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%,${c.value.alpha})`,
			hsv: (c: colors.HSV) =>
				`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%,${c.value.alpha})`,
			lab: (c: colors.LAB) =>
				`lab(${c.value.l}, ${c.value.a}, ${c.value.b},${c.value.alpha})`,
			rgb: (c: colors.RGB) =>
				`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue},${c.value.alpha})`,
			xyz: (c: colors.XYZ) =>
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

function getCSSColorString(color: colors.Color): string {
	try {
		switch (color.format) {
			case 'cmyk':
				return `cmyk(${color.value.cyan},${color.value.magenta},${color.value.yellow},${color.value.key}${color.value.alpha})`;
			case 'hex':
				return String(color.value.hex);
			case 'hsl':
				return `hsl(${color.value.hue},${color.value.saturation}%,${color.value.lightness}%,${color.value.alpha})`;
			case 'hsv':
				return `hsv(${color.value.hue},${color.value.saturation}%,${color.value.value}%,${color.value.alpha})`;
			case 'lab':
				return `lab(${color.value.l},${color.value.a},${color.value.b},${color.value.alpha})`;
			case 'rgb':
				return `rgb(${color.value.red},${color.value.green},${color.value.blue},${color.value.alpha})`;
			case 'xyz':
				return `xyz(${color.value.x},${color.value.y},${color.value.z},${color.value.alpha})`;
			default:
				console.error('Unexpected color format');

				return '#FFFFFFFF';
		}
	} catch (error) {
		console.error(`getCSSColorString error: ${error}`);

		return '#FFFFFFFF';
	}
}

function hexAlphaToNumericAlpha(hexAlpha: string): number {
	return parseInt(hexAlpha, 16) / 255;
}

const parseColor = (
	colorSpace: colors.ColorSpace,
	value: string
): colors.Color | null => {
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
				const numericAlpha = hexAlphaToNumericAlpha(alpha);

				return {
					value: {
						hex: hexValue,
						alpha,
						numericAlpha
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

function parseCustomColor(rawValue: string): colors.HSL | null {
	try {
		console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);

		const match = rawValue.match(
			/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/
		);

		if (match) {
			const [, hue, saturation, lightness, alpha] = match;

			return {
				value: {
					hue: Number(hue),
					saturation: Number(saturation),
					lightness: Number(lightness),
					alpha: Number(alpha)
				},
				format: 'hsl'
			};
		} else {
			console.error(
				'Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)'
			);
			return null;
		}
	} catch (error) {
		console.error(`parseCustomColor error: ${error}`);

		return null;
	}
}

function parseHexWithAlpha(hexValue: string): colors.HexValue | null {
	const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
	const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
	const numericAlpha = hexAlphaToNumericAlpha(alpha);

	return { hex, alpha, numericAlpha };
}

function stripHashFromHex(hex: colors.Hex): colors.Hex {
	try {
		const hexString = `${hex.value.hex}${hex.value.alpha}`;

		return hex.value.hex.startsWith('#')
			? {
					value: {
						hex: hexString.slice(1),
						alpha: hex.value.alpha,
						numericAlpha: hexAlphaToNumericAlpha(hex.value.alpha)
					},
					format: 'hex' as 'hex'
				}
			: hex;
	} catch (error) {
		console.error(`stripHashFromHex error: ${error}`);

		return core.clone(defaults.hex);
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

function toHexWithAlpha(rgbValue: colors.RGBValue): string {
	const { red, green, blue, alpha } = rgbValue;

	const hex = `#${((1 << 24) + (red << 16) + (green << 8) + blue)
		.toString(16)
		.slice(1)}`;
	const alphaHex = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, '0');

	return `${hex}${alphaHex}`;
}

export const colorUtils: fnObjects.ColorUtils = {
	addHashToHex,
	colorStringToColor,
	colorToColorString,
	componentToHex,
	ensureHash,
	formatColor,
	formatPercentageValues,
	getAlphaFromHex,
	getColorString,
	getCSSColorString,
	hexAlphaToNumericAlpha,
	isCMYKColor,
	isCMYKFormat,
	isCMYKString,
	isColor,
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
	parseCustomColor,
	parseHexWithAlpha,
	stripHashFromHex,
	stripPercentFromValues,
	toHexWithAlpha
};
