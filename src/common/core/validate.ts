// File: common/core/validate.js

import { Color, CommonFunctionsInterface, SL, SV } from '../../types/index.js';
import { dataSets as sets } from '../../data/sets.js';

const _sets = sets;

async function colorValue(color: Color | SL | SV): Promise<boolean> {
	const clonedColor = (
		await import('./base.js').then(module => module.base)
	).clone(color);

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
			console.error(`Unsupported color format: ${color.format}`);

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
	if (rangeKey === 'HexSet') {
		if (!validate.hexSet(value as string)) {
			throw new Error(`Invalid value for ${String(rangeKey)}: ${value}`);
		}
		return;
	}

	if (typeof value === 'number' && Array.isArray(_sets[rangeKey])) {
		const [min, max] = _sets[rangeKey] as [number, number];

		if (value < min || value > max) {
			throw new Error(
				`Value ${value} is out of range for ${String(rangeKey)} [${min}, ${max}]`
			);
		}
		return;
	}

	throw new Error(`Invalid range or value for ${String(rangeKey)}`);
}

export const validate: CommonFunctionsInterface['core']['validate'] = {
	colorValue,
	hex,
	hexComponent,
	hexSet,
	range
};
