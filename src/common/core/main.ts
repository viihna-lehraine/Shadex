// File: src/common/core/main.ts

import {
	CMYKValue,
	Color,
	ColorString,
	HSL,
	HSLValue,
	HSVValue,
	SL,
	SLValue,
	SV,
	SVValue
} from '../../index';
import { config } from '../../config';

const defaultColors = config.defaults.colors;
const mode = config.mode;

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

function colorStringToColor(colorString: ColorString): Color {
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
			if (mode.logErrors)
				console.error('Unsupported format for colorStringToColor');

			return defaultColors.hsl;
	}
}

function getCSSColorString(color: Color): string {
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
				if (mode.logErrors)
					console.error(`Unexpected color format: ${color.format}`);

				return '#FFFFFFFF';
		}
	} catch (error) {
		throw new Error(`getCSSColorString error: ${error}`);
	}
}

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

function hexAlphaToNumericAlpha(hexAlpha: string): number {
	return parseInt(hexAlpha, 16) / 255;
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

function isInRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max;
}

function parseCustomColor(rawValue: string): HSL | null {
	try {
		if (!mode.quiet)
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
			if (mode.logErrors)
				console.error(
					'Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)'
				);

			return null;
		}
	} catch (error) {
		if (mode.logErrors) console.error(`parseCustomColor error: ${error}`);

		return null;
	}
}

function sanitizeLAB(value: number): number {
	return Math.round(Math.min(Math.max(value, -125), 125));
}

function sanitizePercentage(value: number): number {
	return Math.round(Math.min(Math.max(value, 0), 100));
}

function sanitizeRadial(value: number): number {
	return Math.round(Math.min(Math.max(value, 0), 360)) & 360;
}

function sanitizeRGB(value: number): number {
	return Math.round(Math.min(Math.max(value, 0), 255));
}

function validateColorValues(color: Color | SL | SV): boolean {
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
			if (mode.logErrors)
				console.error(`Unsupported color format: ${color.format}`);

			return false;
	}
}

export const main = {
	clone,
	colorStringToColor,
	debounce,
	getCSSColorString,
	getElement,
	hexAlphaToNumericAlpha,
	isColor,
	isColorString,
	isInRange,
	parseCustomColor,
	sanitizeLAB,
	sanitizePercentage,
	sanitizeRadial,
	sanitizeRGB,
	validateColorValues
} as const;
