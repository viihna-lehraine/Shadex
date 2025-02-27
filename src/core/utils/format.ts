// File: core/utils/formatting.ts

import {
	BrandingUtilities,
	Color,
	ColorSpace,
	FormattingUtilities,
	Hex,
	HSL,
	NumericBrandedType,
	Services,
	ValidationUtilities
} from '../../types/index.js';
import { defaults } from '../../config/index.js';

const defaultColors = defaults.colors;

export function formattingUtilitiesFactory(
	brand: BrandingUtilities,
	services: Services,
	validate: ValidationUtilities
): FormattingUtilities {
	const { errors, log } = services;

	const parseColor = (colorSpace: ColorSpace, value: string): Color | null =>
		errors.handleSync(
			() => {
				switch (colorSpace) {
					case 'cmyk': {
						const [c, m, y, k] = parseComponents(value, 5);

						return {
							value: {
								cyan: brand.asPercentile(c),
								magenta: brand.asPercentile(m),
								yellow: brand.asPercentile(y),
								key: brand.asPercentile(k)
							},
							format: 'cmyk'
						};
					}
					case 'hex': {
						const hexValue = value.startsWith('#') ? value : `#${value}`;
						return {
							value: {
								hex: brand.asHexSet(hexValue)
							},
							format: 'hex'
						};
					}
					case 'hsl': {
						const [h, s, l] = parseComponents(value, 4);

						return {
							value: {
								hue: brand.asRadial(h),
								saturation: brand.asPercentile(s),
								lightness: brand.asPercentile(l)
							},
							format: 'hsl'
						};
					}
					case 'hsv': {
						const [h, s, v] = parseComponents(value, 4);

						return {
							value: {
								hue: brand.asRadial(h),
								saturation: brand.asPercentile(s),
								value: brand.asPercentile(v)
							},
							format: 'hsv'
						};
					}
					case 'lab': {
						const [l, a, b] = parseComponents(value, 4);
						return {
							value: {
								l: brand.asLAB_L(l),
								a: brand.asLAB_A(a),
								b: brand.asLAB_B(b)
							},
							format: 'lab'
						};
					}
					case 'rgb': {
						const components = value.split(',').map(Number);

						if (components.some(isNaN)) {
							throw new Error(`Invalid RGB format for value: ${value}`);
						}

						const [r, g, b] = components;

						return {
							value: {
								red: brand.asByteRange(r),
								green: brand.asByteRange(g),
								blue: brand.asByteRange(b)
							},
							format: 'rgb'
						};
					}
					default: {
						const message = `Unsupported color format: ${colorSpace}`;
						log.error(
							`Failed to parse color: ${message}`,
							`utils.format.parseColor`
						);
						return null;
					}
				}
			},
			'Error parsing color',
			{ context: { colorSpace, value }, fallback: null }
		);

	function addHashToHex(hex: Hex): Hex {
		return errors.handleSync(() => {
			return hex.value.hex.startsWith('#')
				? hex
				: {
						value: {
							hex: brand.asHexSet(`#${hex.value}}`)
						},
						format: 'hex' as 'hex'
					};
		}, 'Error occurred while adding hash to hex color.');
	}

	function componentToHex(component: number): string {
		return errors.handleSync(() => {
			const hex = Math.max(0, Math.min(255, component)).toString(16);

			return hex.length === 1 ? '0' + hex : hex;
		}, 'Error occurred while converting component to hex partial.');
	}

	function convertShortHexToLong(hex: string): string {
		return errors.handleSync(() => {
			if (hex.length !== 4) return hex;

			return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
		}, 'Error occurred while converting short hex to long hex.');
	}

	function formatPercentageValues<
		T extends Record<string, number | NumericBrandedType>
	>(
		value: T
	): {
		[K in keyof T]: T[K] extends number | NumericBrandedType
			? `${number}%` | T[K]
			: T[K];
	} {
		return errors.handleSync(
			() => {
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
							: val;
						return acc;
					},
					{} as {
						[K in keyof T]: T[K] extends number | NumericBrandedType
							? `${number}%` | T[K]
							: T[K];
					}
				);
			},
			'Error formatting percentage values',
			{ context: { value } }
		);
	}

	function hslAddFormat(value: HSL['value']): HSL {
		return errors.handleSync(() => {
			if (
				!validate.colorValue({
					value: value,
					format: 'hsl'
				})
			) {
				log.error(
					`Invalid HSL value ${JSON.stringify(value)}`,
					`utils.format.hslAddFormat`
				);

				return defaultColors.hsl;
			}

			return { value: value, format: 'hsl' } as HSL;
		}, 'Error occurred while adding format to HSL value.');
	}

	function parseComponents(value: string, count: number): number[] {
		return errors.handleSync(() => {
			const components = value
				.split(',')
				.map(val =>
					val.trim().endsWith('%') ? parseFloat(val) : parseFloat(val) * 100
				);
			if (components.length !== count) {
				log.error(
					`Expected ${count} components.`,
					`utils.format.parseComponents`
				);
				return [];
			}
			return components;
		}, 'Error occurred while parsing components.');
	}

	function stripHashFromHex(hex: Hex): Hex {
		return errors.handleSync(() => {
			const hexString = `${hex.value.hex}`;

			return hex.value.hex.startsWith('#')
				? {
						value: {
							hex: brand.asHexSet(hexString.slice(1))
						},
						format: 'hex' as 'hex'
					}
				: hex;
		}, 'Error occurred while stripping hash from hex color.');
	}

	function stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] } {
		return errors.handleSync(
			() => {
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
					{} as {
						[K in keyof T]: T[K] extends `${number}%` ? number : T[K];
					}
				);
			},
			'Error occurred while stripping percent from values.',
			{ context: value }
		);
	}

	const formattingUtilities: FormattingUtilities = {
		addHashToHex,
		componentToHex,
		convertShortHexToLong,
		formatPercentageValues,
		hslAddFormat,
		parseColor,
		parseComponents,
		stripHashFromHex,
		stripPercentFromValues
	};

	return errors.handleSync(
		() => formattingUtilities,
		'Error occurred while creating formatting utilities group.'
	);
}
