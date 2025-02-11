// File: utils/formatting.js

import {
	AppServicesInterface,
	BrandingUtilsInterface,
	Color,
	ColorSpace,
	CoreUtilsInterface,
	FormattingUtilsInterface,
	Hex,
	HSL,
	ValidationUtilsInterface
} from '../types/index.js';
import { defaultData as defaults } from '../data/defaults.js';

const defaultColors = defaults.colors.base.branded;

function addHashToHex(
	hex: Hex,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: {
						hex: brand.asHexSet(`#${hex.value}}`, validate)
					},
					format: 'hex' as 'hex'
				};
	} catch (error) {
		throw new Error(`addHashToHex error: ${error}`);
	}
}

function componentToHex(
	component: number,
	appServices: AppServicesInterface
): string {
	const log = appServices.log;

	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);

		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		log(
			'error',
			`componentToHex error: ${error}`,
			'formattingUtils.componentToHex()'
		);

		return '00';
	}
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

function hslAddFormat(
	value: HSL['value'],
	appServices: AppServicesInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): HSL {
	const log = appServices.log;

	try {
		if (!validate.colorValue({ value: value, format: 'hsl' }, coreUtils)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(value)}`,
				'formattingUtils.hslAddFormat()'
			);

			return defaultColors.hsl;
		}

		return { value: value, format: 'hsl' } as HSL;
	} catch (error) {
		log(
			'error',
			`Error adding HSL format: ${error}`,
			'formattingUtils.hslAddFormat()'
		);

		return defaultColors.hsl;
	}
}

const parseColor = (
	colorSpace: ColorSpace,
	value: string,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): Color | null => {
	const log = appServices.log;

	try {
		switch (colorSpace) {
			case 'cmyk': {
				const [c, m, y, k] = parseComponents(value, 5, appServices);

				return {
					value: {
						cyan: brand.asPercentile(c, validate),
						magenta: brand.asPercentile(m, validate),
						yellow: brand.asPercentile(y, validate),
						key: brand.asPercentile(k, validate)
					},
					format: 'cmyk'
				};
			}
			case 'hex':
				const hexValue = value.startsWith('#') ? value : `#${value}`;

				return {
					value: {
						hex: brand.asHexSet(hexValue, validate)
					},
					format: 'hex'
				};
			case 'hsl': {
				const [h, s, l] = parseComponents(value, 4, appServices);

				return {
					value: {
						hue: brand.asRadial(h, validate),
						saturation: brand.asPercentile(s, validate),
						lightness: brand.asPercentile(l, validate)
					},
					format: 'hsl'
				};
			}
			case 'hsv': {
				const [h, s, v] = parseComponents(value, 4, appServices);

				return {
					value: {
						hue: brand.asRadial(h, validate),
						saturation: brand.asPercentile(s, validate),
						value: brand.asPercentile(v, validate)
					},
					format: 'hsv'
				};
			}
			case 'lab': {
				const [l, a, b] = parseComponents(value, 4, appServices);
				return {
					value: {
						l: brand.asLAB_L(l, validate),
						a: brand.asLAB_A(a, validate),
						b: brand.asLAB_B(b, validate)
					},
					format: 'lab'
				};
			}
			case 'rgb': {
				const components = value.split(',').map(Number);

				if (components.some(isNaN))
					throw new Error('Invalid RGB format');

				const [r, g, b] = components;

				return {
					value: {
						red: brand.asByteRange(r, validate),
						green: brand.asByteRange(g, validate),
						blue: brand.asByteRange(b, validate)
					},
					format: 'rgb'
				};
			}
			default:
				const message = `Unsupported color format: ${colorSpace}`;

				log(
					'warn',
					`Failed to parse color: ${message}`,
					`formattingUtils.parseColor()`
				);

				return null;
		}
	} catch (error) {
		log(
			'warn',
			`parseColor error: ${error}`,
			`formattingUtils.parseColor()`
		);

		return null;
	}
};

function parseComponents(
	value: string,
	count: number,
	appServices: AppServicesInterface
): number[] {
	const log = appServices.log;

	try {
		const components = value
			.split(',')
			.map(val =>
				val.trim().endsWith('%')
					? parseFloat(val)
					: parseFloat(val) * 100
			);

		if (components.length !== count)
			log(
				'error',
				`Expected ${count} components.`,
				'formattingUtils.parseComponents()'
			);
		return [];

		return components;
	} catch (error) {
		log(
			'error',
			`Error parsing components: ${error}`,
			'formattingUtils.parseComponents()'
		);

		return [];
	}
}

function stripHashFromHex(
	hex: Hex,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): Hex {
	const log = appServices.log;

	try {
		const hexString = `${hex.value.hex}`;

		return hex.value.hex.startsWith('#')
			? {
					value: {
						hex: brand.asHexSet(hexString.slice(1), validate)
					},
					format: 'hex' as 'hex'
				}
			: hex;
	} catch (error) {
		log(
			'error',
			`stripHashFromHex error: ${error}`,
			'formattingUtils.stripHashFromHex()'
		);

		return defaultColors.hex;
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

export const formattingUtils: FormattingUtilsInterface = {
	addHashToHex,
	componentToHex,
	formatPercentageValues,
	hslAddFormat,
	parseColor,
	parseComponents,
	stripHashFromHex,
	stripPercentFromValues
};
