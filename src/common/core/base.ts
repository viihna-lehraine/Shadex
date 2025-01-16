// File: src/common/core/base.js

import {
	AlphaRange,
	ByteRange,
	CMYK,
	CMYKUnbranded,
	CMYKValue,
	Color,
	ColorSpace,
	ColorString,
	CommonCoreFnBase,
	CommonCoreFnBrand,
	CommonCoreFnBrandColor,
	CommonCoreFnConvert,
	CommonCoreFnGuards,
	CommonCoreFnValidate,
	Hex,
	HexComponent,
	HexSet,
	HexUnbranded,
	HSL,
	HSLUnbranded,
	HSLValue,
	HSV,
	HSVUnbranded,
	HSVValue,
	LAB,
	LABUnbranded,
	LAB_L,
	LAB_A,
	LAB_B,
	NumericRangeKey,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	RGBUnbranded,
	SL,
	SLUnbranded,
	SLValue,
	SV,
	SVUnbranded,
	SVValue,
	XYZ,
	XYZUnbranded,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../index/index.js';
import { data } from '../../data/index.js';
import { log } from '../../classes/logger/index.js';

const logMode = data.mode.logging;
const defaultColors = data.defaults.colors;
const mode = data.mode;
const _sets = data.sets;

function clampToRange(value: number, rangeKey: NumericRangeKey): number {
	const [min, max] = _sets[rangeKey];

	return Math.min(Math.max(value, min), max);
}

function clone<T>(value: T): T {
	return structuredClone(value);
}

function debounce<T extends (...args: Parameters<T>) => void>(
	func: T,
	delay: number
) {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>): void => {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

function parseCustomColor(rawValue: string): HSL | null {
	try {
		if (!mode.quiet)
			log.info(`Parsing custom color: ${JSON.stringify(rawValue)}`);

		const match = rawValue.match(
			/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/
		);

		if (match) {
			const [, hue, saturation, lightness, alpha] = match;

			return {
				value: {
					hue: brand.asRadial(parseInt(hue)),
					saturation: brand.asPercentile(parseInt(saturation)),
					lightness: brand.asPercentile(parseInt(lightness)),
					alpha: brand.asAlphaRange(parseFloat(alpha))
				},
				format: 'hsl'
			};
		} else {
			if (logMode.errors)
				log.error(
					'Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)'
				);

			return null;
		}
	} catch (error) {
		if (logMode.errors) log.error(`parseCustomColor error: ${error}`);

		return null;
	}
}

export const base: CommonCoreFnBase = {
	clampToRange,
	clone,
	debounce,
	parseCustomColor
} as const;

// ******** SECTION 2 ********

function asAlphaRange(value: number): AlphaRange {
	validate.range(value, 'AlphaRange');

	return value as AlphaRange;
}

function asBranded<T extends keyof RangeKeyMap>(
	value: number,
	rangeKey: T
): RangeKeyMap[T] {
	validate.range(value, rangeKey);

	return value as RangeKeyMap[T];
}

function asByteRange(value: number): ByteRange {
	validate.range(value, 'ByteRange');

	return value as ByteRange;
}

function asHexComponent(value: string): HexComponent {
	if (!validate.hexComponent(value)) {
		throw new Error(`Invalid HexComponent value: ${value}`);
	}

	return value as unknown as HexComponent;
}

function asHexSet(value: string): HexSet {
	if (/^#[0-9a-fA-F]{8}$/.test(value)) {
		value = value.slice(0, 7);
	}
	if (!validate.hexSet(value)) {
		throw new Error(`Invalid HexSet value: ${value}`);
	}
	return value as HexSet;
}

function asLAB_L(value: number): LAB_L {
	validate.range(value, 'LAB_L');

	return value as LAB_L;
}

function asLAB_A(value: number): LAB_A {
	validate.range(value, 'LAB_A');

	return value as LAB_A;
}

function asLAB_B(value: number): LAB_B {
	validate.range(value, 'LAB_B');

	return value as LAB_B;
}

function asPercentile(value: number): Percentile {
	validate.range(value, 'Percentile');

	return value as Percentile;
}

function asRadial(value: number): Radial {
	validate.range(value, 'Radial');

	return value as Radial;
}

function asXYZ_X(value: number): XYZ_X {
	validate.range(value, 'XYZ_X');

	return value as XYZ_X;
}

function asXYZ_Y(value: number): XYZ_Y {
	validate.range(value, 'XYZ_Y');

	return value as XYZ_Y;
}

function asXYZ_Z(value: number): XYZ_Z {
	validate.range(value, 'XYZ_Z');

	return value as XYZ_Z;
}

export const brand: CommonCoreFnBrand = {
	asAlphaRange,
	asBranded,
	asByteRange,
	asHexComponent,
	asHexSet,
	asLAB_L,
	asLAB_A,
	asLAB_B,
	asPercentile,
	asRadial,
	asXYZ_X,
	asXYZ_Y,
	asXYZ_Z
};

// ******** SECTION 2 - Brand Color ********

function asCMYK(color: CMYKUnbranded): CMYK {
	const brandedCyan = brand.asPercentile(color.value.cyan);
	const brandedMagenta = brand.asPercentile(color.value.magenta);
	const brandedYellow = brand.asPercentile(color.value.yellow);
	const brandedKey = brand.asPercentile(color.value.key);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			cyan: brandedCyan,
			magenta: brandedMagenta,
			yellow: brandedYellow,
			key: brandedKey,
			alpha: brandedAlpha
		},
		format: 'cmyk'
	};
}

function asHex(color: HexUnbranded): Hex {
	let hex = color.value.hex;

	if (!hex.startsWith('#')) hex = `#${hex}`;

	if (!/^#[0-9A-Fa-f]{8}$/.test(hex))
		throw new Error(`Invalid Hex color format: ${hex}`);

	const hexMain = hex.slice(0, 7);
	const alpha = hex.slice(7, 9);

	const brandedHex = brand.asHexSet(hexMain);
	const brandedHexAlpha = brand.asHexComponent(alpha);
	const brandedNumAlpha = brand.asAlphaRange(color.value.numAlpha);

	return {
		value: {
			hex: brandedHex,
			alpha: brandedHexAlpha,
			numAlpha: brandedNumAlpha
		},
		format: 'hex'
	};
}

function asHSL(color: HSLUnbranded): HSL {
	const brandedHue = brand.asRadial(color.value.hue);
	const brandedSaturation = brand.asPercentile(color.value.saturation);
	const brandedLightness = brand.asPercentile(color.value.lightness);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			hue: brandedHue,
			saturation: brandedSaturation,
			lightness: brandedLightness,
			alpha: brandedAlpha
		},
		format: 'hsl'
	};
}

function asHSV(color: HSVUnbranded): HSV {
	const brandedHue = brand.asRadial(color.value.hue);
	const brandedSaturation = brand.asPercentile(color.value.saturation);
	const brandedValue = brand.asPercentile(color.value.value);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			hue: brandedHue,
			saturation: brandedSaturation,
			value: brandedValue,
			alpha: brandedAlpha
		},
		format: 'hsv'
	};
}

function asLAB(color: LABUnbranded): LAB {
	const brandedL = brand.asLAB_L(color.value.l);
	const brandedA = brand.asLAB_A(color.value.a);
	const brandedB = brand.asLAB_B(color.value.b);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			l: brandedL,
			a: brandedA,
			b: brandedB,
			alpha: brandedAlpha
		},
		format: 'lab'
	};
}

function asRGB(color: RGBUnbranded): RGB {
	const brandedRed = brand.asByteRange(color.value.red);
	const brandedGreen = brand.asByteRange(color.value.green);
	const brandedBlue = brand.asByteRange(color.value.blue);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			red: brandedRed,
			green: brandedGreen,
			blue: brandedBlue,
			alpha: brandedAlpha
		},
		format: 'rgb'
	};
}

function asSL(color: SLUnbranded): SL {
	const brandedSaturation = brand.asPercentile(color.value.saturation);
	const brandedLightness = brand.asPercentile(color.value.lightness);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			saturation: brandedSaturation,
			lightness: brandedLightness,
			alpha: brandedAlpha
		},
		format: 'sl'
	};
}

function asSV(color: SVUnbranded): SV {
	const brandedSaturation = brand.asPercentile(color.value.saturation);
	const brandedValue = brand.asPercentile(color.value.value);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			saturation: brandedSaturation,
			value: brandedValue,
			alpha: brandedAlpha
		},
		format: 'sv'
	};
}

function asXYZ(color: XYZUnbranded): XYZ {
	const brandedX = brand.asXYZ_X(color.value.x);
	const brandedY = brand.asXYZ_Y(color.value.y);
	const brandedZ = brand.asXYZ_Z(color.value.z);
	const brandedAlpha = brand.asAlphaRange(color.value.alpha);

	return {
		value: {
			x: brandedX,
			y: brandedY,
			z: brandedZ,
			alpha: brandedAlpha
		},
		format: 'xyz'
	};
}

export const brandColor: CommonCoreFnBrandColor = {
	asCMYK,
	asHex,
	asHSL,
	asHSV,
	asLAB,
	asRGB,
	asSL,
	asSV,
	asXYZ
};

// ******** SECTION 3 - Convert ********

function hexAlphaToNumericAlpha(hexAlpha: string): number {
	return parseInt(hexAlpha, 16) / 255;
}

function toColor(colorString: ColorString): Color {
	const clonedColor = clone(colorString);

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
			return { format: 'cmyk', value: newValue as CMYKValue };
		case 'hsl':
			return { format: 'hsl', value: newValue as HSLValue };
		case 'hsv':
			return { format: 'hsv', value: newValue as HSVValue };
		case 'sl':
			return { format: 'sl', value: newValue as SLValue };
		case 'sv':
			return { format: 'sv', value: newValue as SVValue };
		default:
			if (logMode.errors)
				log.error('Unsupported format for colorStringToColor');

			const unbrandedHSL = defaultColors.hsl;

			const brandedHue = brand.asRadial(unbrandedHSL.value.hue);
			const brandedSaturation = brand.asPercentile(
				unbrandedHSL.value.saturation
			);
			const brandedLightness = brand.asPercentile(
				unbrandedHSL.value.lightness
			);
			const brandedAlpha = brand.asAlphaRange(unbrandedHSL.value.alpha);

			return {
				value: {
					hue: brandedHue,
					saturation: brandedSaturation,
					lightness: brandedLightness,
					alpha: brandedAlpha
				},
				format: 'hsl'
			};
	}
}

function toColorValueRange<T extends keyof RangeKeyMap>(
	value: string | number,
	rangeKey: T
): RangeKeyMap[T] {
	validate.range(value, rangeKey);

	if (rangeKey === 'HexSet') {
		return brand.asHexSet(value as string) as unknown as RangeKeyMap[T];
	}

	if (rangeKey === 'HexComponent') {
		return brand.asHexComponent(
			value as string
		) as unknown as RangeKeyMap[T];
	}

	return brand.asBranded(
		value as number,
		rangeKey
	) as unknown as RangeKeyMap[T];
}

function toCSSColorString(color: Color): string {
	try {
		switch (color.format) {
			case 'cmyk':
				return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key}, ${color.value.alpha})`;
			case 'hex':
				return String(color.value.hex);
			case 'hsl':
				return `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%, ${color.value.alpha})`;
			case 'hsv':
				return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%, ${color.value.alpha})`;
			case 'lab':
				return `lab(${color.value.l}, ${color.value.a}, ${color.value.b}, ${color.value.alpha})`;
			case 'rgb':
				return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue}, ${color.value.alpha})`;
			case 'xyz':
				return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z}, ${color.value.alpha})`;
			default:
				if (logMode.errors)
					log.error(`Unexpected color format: ${color.format}`);

				return '#FFFFFFFF';
		}
	} catch (error) {
		throw new Error(`getCSSColorString error: ${error}`);
	}
}

export const convert: CommonCoreFnConvert = {
	hexAlphaToNumericAlpha,
	toColor,
	toColorValueRange,
	toCSSColorString
};

// ******** SECTION 4 - Guards ********

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

function isColorString(value: unknown): value is ColorString {
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

function isInRange<T extends keyof typeof _sets>(
	value: number | string,
	rangeKey: T
): boolean {
	if (rangeKey === 'HexSet') {
		return validate.hexSet(value as string);
	}

	if (rangeKey === 'HexComponent') {
		return validate.hexComponent(value as string);
	}

	if (typeof value === 'number' && Array.isArray(_sets[rangeKey])) {
		const [min, max] = _sets[rangeKey] as [number, number];

		return value >= min && value <= max;
	}

	throw new Error(`Invalid range or value for ${rangeKey}`);
}

export const guards: CommonCoreFnGuards = {
	isColor,
	isColorSpace,
	isColorString,
	isInRange
};

// ******** SECTION 5 - Sanitize ********

function lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B {
	if (output === 'l') {
		return brand.asLAB_L(Math.round(Math.min(Math.max(value, 0), 100)));
	} else if (output === 'a') {
		return brand.asLAB_A(Math.round(Math.min(Math.max(value, -125), 125)));
	} else if (output === 'b') {
		return brand.asLAB_B(Math.round(Math.min(Math.max(value, -125), 125)));
	} else throw new Error('Unable to return LAB value');
}

function percentile(value: number): Percentile {
	const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));

	return brand.asPercentile(rawPercentile);
}

function radial(value: number): Radial {
	const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;

	return brand.asRadial(rawRadial);
}

function rgb(value: number): ByteRange {
	const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));

	return toColorValueRange(rawByteRange, 'ByteRange');
}

export const sanitize = {
	lab,
	percentile,
	radial,
	rgb
};

// ******** SECTION 6 - Validate ********

function colorValues(color: Color | SL | SV): boolean {
	const clonedColor = clone(color);
	const isNumericValid = (value: unknown): boolean =>
		typeof value === 'number' && !isNaN(value);
	const normalizePercentage = (value: string | number): number => {
		if (typeof value === 'string' && value.endsWith('%')) {
			return parseFloat(value.slice(0, -1));
		}

		return typeof value === 'number' ? value : NaN;
	};

	switch (clonedColor.format) {
		case 'cmyk':
			return (
				[
					clonedColor.value.cyan,
					clonedColor.value.magenta,
					clonedColor.value.yellow,
					clonedColor.value.key
				].every(isNumericValid) &&
				clonedColor.value.cyan >= 0 &&
				clonedColor.value.cyan <= 100 &&
				clonedColor.value.magenta >= 0 &&
				clonedColor.value.magenta <= 100 &&
				clonedColor.value.yellow >= 0 &&
				clonedColor.value.yellow <= 100 &&
				clonedColor.value.key >= 0 &&
				clonedColor.value.key <= 100
			);
		case 'hex':
			return /^#[0-9A-Fa-f]{6}$/.test(clonedColor.value.hex);
		case 'hsl':
			const isValidHSLHue =
				isNumericValid(clonedColor.value.hue) &&
				clonedColor.value.hue >= 0 &&
				clonedColor.value.hue <= 360;
			const isValidHSLSaturation =
				normalizePercentage(clonedColor.value.saturation) >= 0 &&
				normalizePercentage(clonedColor.value.saturation) <= 100;
			const isValidHSLLightness = clonedColor.value.lightness
				? normalizePercentage(clonedColor.value.lightness) >= 0 &&
					normalizePercentage(clonedColor.value.lightness) <= 100
				: true;

			return isValidHSLHue && isValidHSLSaturation && isValidHSLLightness;
		case 'hsv':
			const isValidHSVHue =
				isNumericValid(clonedColor.value.hue) &&
				clonedColor.value.hue >= 0 &&
				clonedColor.value.hue <= 360;
			const isValidHSVSaturation =
				normalizePercentage(clonedColor.value.saturation) >= 0 &&
				normalizePercentage(clonedColor.value.saturation) <= 100;
			const isValidHSVValue = clonedColor.value.value
				? normalizePercentage(clonedColor.value.value) >= 0 &&
					normalizePercentage(clonedColor.value.value) <= 100
				: true;

			return isValidHSVHue && isValidHSVSaturation && isValidHSVValue;
		case 'lab':
			return (
				[
					clonedColor.value.l,
					clonedColor.value.a,
					clonedColor.value.b
				].every(isNumericValid) &&
				clonedColor.value.l >= 0 &&
				clonedColor.value.l <= 100 &&
				clonedColor.value.a >= -125 &&
				clonedColor.value.a <= 125 &&
				clonedColor.value.b >= -125 &&
				clonedColor.value.b <= 125
			);
		case 'rgb':
			return (
				[
					clonedColor.value.red,
					clonedColor.value.green,
					clonedColor.value.blue
				].every(isNumericValid) &&
				clonedColor.value.red >= 0 &&
				clonedColor.value.red <= 255 &&
				clonedColor.value.green >= 0 &&
				clonedColor.value.green <= 255 &&
				clonedColor.value.blue >= 0 &&
				clonedColor.value.blue <= 255
			);
		case 'sl':
			return (
				[
					clonedColor.value.saturation,
					clonedColor.value.lightness
				].every(isNumericValid) &&
				clonedColor.value.saturation >= 0 &&
				clonedColor.value.saturation <= 100 &&
				clonedColor.value.lightness >= 0 &&
				clonedColor.value.lightness <= 100
			);
		case 'sv':
			return (
				[clonedColor.value.saturation, clonedColor.value.value].every(
					isNumericValid
				) &&
				clonedColor.value.saturation >= 0 &&
				clonedColor.value.saturation <= 100 &&
				clonedColor.value.value >= 0 &&
				clonedColor.value.value <= 100
			);
		case 'xyz':
			return (
				[
					clonedColor.value.x,
					clonedColor.value.y,
					clonedColor.value.z
				].every(isNumericValid) &&
				clonedColor.value.x >= 0 &&
				clonedColor.value.x <= 95.047 &&
				clonedColor.value.y >= 0 &&
				clonedColor.value.y <= 100.0 &&
				clonedColor.value.z >= 0 &&
				clonedColor.value.z <= 108.883
			);
		default:
			if (logMode.errors)
				log.error(`Unsupported color format: ${color.format}`);

			return false;
	}
}

function hex(value: string, pattern: RegExp): boolean {
	return pattern.test(value);
}

function hexComponent(value: string): boolean {
	return hex(value, /^[A-Fa-f0-9]{2}$/);
}

function hexSet(value: string): boolean {
	return /^#[0-9a-fA-F]{6}$/.test(value);
}

function range<T extends keyof typeof _sets>(
	value: number | string,
	rangeKey: T
): void {
	if (!isInRange(value, rangeKey)) {
		if (rangeKey === 'HexSet' || rangeKey === 'HexComponent') {
			throw new Error(`Invalid value for ${rangeKey}: ${value}`);
		}

		const [min, max] = _sets[rangeKey] as [number, number];

		throw new Error(
			`Value ${value} is out of range for ${rangeKey} [${min}, ${max}]`
		);
	}
}

export const validate: CommonCoreFnValidate = {
	colorValues,
	hex,
	hexComponent,
	hexSet,
	range
};

export { clone };
