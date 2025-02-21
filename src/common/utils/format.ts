// File: common/utils/formatting.js

import {
	Color,
	ColorSpace,
	FormattingUtils,
	Hex,
	HSL,
	NumericBrandedType,
	Services,
	Utilities
} from '../../types/index.js';
import { defaults } from '../../config/index.js';

const defaultColors = defaults.colors;

export function formattingUtilsFactory(
	services: Services,
	utils: Utilities
): FormattingUtils {
	const parseColor = (
		colorSpace: ColorSpace,
		value: string
	): Color | null => {
		const log = services.log;

		try {
			switch (colorSpace) {
				case 'cmyk': {
					const [c, m, y, k] = parseComponents(value, 5);

					return {
						value: {
							cyan: utils.brand.asPercentile(c),
							magenta: utils.brand.asPercentile(m),
							yellow: utils.brand.asPercentile(y),
							key: utils.brand.asPercentile(k)
						},
						format: 'cmyk'
					};
				}
				case 'hex':
					const hexValue = value.startsWith('#')
						? value
						: `#${value}`;

					return {
						value: {
							hex: utils.brand.asHexSet(hexValue)
						},
						format: 'hex'
					};
				case 'hsl': {
					const [h, s, l] = parseComponents(value, 4);

					return {
						value: {
							hue: utils.brand.asRadial(h),
							saturation: utils.brand.asPercentile(s),
							lightness: utils.brand.asPercentile(l)
						},
						format: 'hsl'
					};
				}
				case 'hsv': {
					const [h, s, v] = parseComponents(value, 4);

					return {
						value: {
							hue: utils.brand.asRadial(h),
							saturation: utils.brand.asPercentile(s),
							value: utils.brand.asPercentile(v)
						},
						format: 'hsv'
					};
				}
				case 'lab': {
					const [l, a, b] = parseComponents(value, 4);
					return {
						value: {
							l: utils.brand.asLAB_L(l),
							a: utils.brand.asLAB_A(a),
							b: utils.brand.asLAB_B(b)
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
							red: utils.brand.asByteRange(r),
							green: utils.brand.asByteRange(g),
							blue: utils.brand.asByteRange(b)
						},
						format: 'rgb'
					};
				}
				default:
					const message = `Unsupported color format: ${colorSpace}`;

					log(`Failed to parse color: ${message}`, `warn`);

					return null;
			}
		} catch (error) {
			log(`parseColor error: ${error}`, `warn`);

			return null;
		}
	};

	function parseComponents(value: string, count: number): number[] {
		const log = services.log;

		try {
			const components = value
				.split(',')
				.map(val =>
					val.trim().endsWith('%')
						? parseFloat(val)
						: parseFloat(val) * 100
				);

			if (components.length !== count) {
				log(`Expected ${count} components.`, 'error');
				return [];
			}

			return components;
		} catch (error) {
			log(`Error parsing components: ${error}`, 'error');

			return [];
		}
	}

	return {
		parseColor,
		parseComponents,
		addHashToHex(hex: Hex): Hex {
			try {
				return hex.value.hex.startsWith('#')
					? hex
					: {
							value: {
								hex: utils.brand.asHexSet(`#${hex.value}}`)
							},
							format: 'hex' as 'hex'
						};
			} catch (error) {
				throw new Error(`addHashToHex error: ${error}`);
			}
		},
		componentToHex(component: number): string {
			const log = services.log;

			try {
				const hex = Math.max(0, Math.min(255, component)).toString(16);

				return hex.length === 1 ? '0' + hex : hex;
			} catch (error) {
				log(`componentToHex error: ${error}`, 'error');

				return '00';
			}
		},
		convertShortHexToLong(hex: string): string {
			if (hex.length !== 4) return hex;

			return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
		},
		formatPercentageValues<
			T extends Record<string, number | NumericBrandedType>
		>(
			value: T
		): {
			[K in keyof T]: T[K] extends number | NumericBrandedType
				? `${number}%` | T[K]
				: T[K];
		} {
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
						? `${val as number}%`
						: val; // 🛡️ Keep branded types untouched
					return acc;
				},
				{} as {
					[K in keyof T]: T[K] extends number | NumericBrandedType
						? `${number}%` | T[K]
						: T[K];
				}
			);
		},
		hslAddFormat(value: HSL['value']): HSL {
			const log = services.log;

			try {
				if (
					!utils.validate.colorValue({ value: value, format: 'hsl' })
				) {
					log(`Invalid HSL value ${JSON.stringify(value)}`, 'error');

					return defaultColors.hsl;
				}

				return { value: value, format: 'hsl' } as HSL;
			} catch (error) {
				log(`Error adding HSL format: ${error}`, 'error');

				return defaultColors.hsl;
			}
		},
		stripHashFromHex(hex: Hex): Hex {
			const log = services.log;

			try {
				const hexString = `${hex.value.hex}`;

				return hex.value.hex.startsWith('#')
					? {
							value: {
								hex: utils.brand.asHexSet(hexString.slice(1))
							},
							format: 'hex' as 'hex'
						}
					: hex;
			} catch (error) {
				log(`stripHashFromHex error: ${error}`, 'error');

				return defaultColors.hex;
			}
		},
		stripPercentFromValues<T extends Record<string, number | string>>(
			value: T
		): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] } {
			return Object.entries(value).reduce(
				(acc, [key, val]) => {
					const parsedValue =
						typeof val === 'string' && val.endsWith('%')
							? parseFloat(val.slice(0, -1))
							: val;

					acc[key as keyof T] =
						parsedValue as T[keyof T] extends `${number}%`
							? number
							: T[keyof T];

					return acc;
				},
				{} as {
					[K in keyof T]: T[K] extends `${number}%` ? number : T[K];
				}
			);
		}
	};
}
