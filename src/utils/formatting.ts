// File: utils/formatting.js

import {
	AppServicesInterface,
	BrandingUtilsInterface,
	Color,
	ColorSpace,
	ConfigDataInterface,
	CoreUtilsInterface,
	DataSetsInterface,
	DefaultDataInterface,
	FormattingUtilsInterface,
	Hex,
	HSL,
	ValidationUtilsInterface
} from '../types/index.js';

function addHashToHex(
	hex: Hex,
	brand: BrandingUtilsInterface,
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: {
						hex: brand.asHexSet(`#${hex.value}}`, regex, validate)
					},
					format: 'hex' as 'hex'
				};
	} catch (error) {
		throw new Error(`addHashToHex error: ${error}`);
	}
}

function componentToHex(
	component: number,
	log: AppServicesInterface['log']
): string {
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
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (
			!validate.colorValue(
				{ value: value, format: 'hsl' },
				coreUtils,
				regex
			)
		) {
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
	brand: BrandingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): Color | null => {
	try {
		switch (colorSpace) {
			case 'cmyk': {
				const [c, m, y, k] = parseComponents(value, 5, log);

				return {
					value: {
						cyan: brand.asPercentile(c, sets, validate),
						magenta: brand.asPercentile(m, sets, validate),
						yellow: brand.asPercentile(y, sets, validate),
						key: brand.asPercentile(k, sets, validate)
					},
					format: 'cmyk'
				};
			}
			case 'hex':
				const hexValue = value.startsWith('#') ? value : `#${value}`;

				return {
					value: {
						hex: brand.asHexSet(hexValue, regex, validate)
					},
					format: 'hex'
				};
			case 'hsl': {
				const [h, s, l] = parseComponents(value, 4, log);

				return {
					value: {
						hue: brand.asRadial(h, sets, validate),
						saturation: brand.asPercentile(s, sets, validate),
						lightness: brand.asPercentile(l, sets, validate)
					},
					format: 'hsl'
				};
			}
			case 'hsv': {
				const [h, s, v] = parseComponents(value, 4, log);

				return {
					value: {
						hue: brand.asRadial(h, sets, validate),
						saturation: brand.asPercentile(s, sets, validate),
						value: brand.asPercentile(v, sets, validate)
					},
					format: 'hsv'
				};
			}
			case 'lab': {
				const [l, a, b] = parseComponents(value, 4, log);
				return {
					value: {
						l: brand.asLAB_L(l, sets, validate),
						a: brand.asLAB_A(a, sets, validate),
						b: brand.asLAB_B(b, sets, validate)
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
						red: brand.asByteRange(r, sets, validate),
						green: brand.asByteRange(g, sets, validate),
						blue: brand.asByteRange(b, sets, validate)
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
	log: AppServicesInterface['log']
): number[] {
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
	brand: BrandingUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): Hex {
	try {
		const hexString = `${hex.value.hex}`;

		return hex.value.hex.startsWith('#')
			? {
					value: {
						hex: brand.asHexSet(hexString.slice(1), regex, validate)
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
