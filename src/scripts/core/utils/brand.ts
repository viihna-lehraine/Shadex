// File: src/scripts/core/utils/brand.ts

import {
	BrandingUtilities,
	ByteRange,
	CMYK,
	CMYKNumMap,
	Color,
	ColorNumMap,
	ColorStringMap,
	Hex,
	HexSet,
	HexStringMap,
	HSL,
	HSLNumMap,
	Palette,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	UnbrandedPalette,
	RGBNumMap,
	Services,
	ValidationUtilities
} from '../../types/index.js';
import { regex } from '../../config/index.js';

export function brandingUtilitiesFactory(
	services: Services,
	validate: ValidationUtilities
): BrandingUtilities {
	const { errors } = services;

	function asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T
	): RangeKeyMap[T] {
		validate.range(value, rangeKey);

		return value as RangeKeyMap[T];
	}

	function asByteRange(value: number): ByteRange {
		return errors.handleSync(() => {
			validate.range(value, 'ByteRange');

			return value as ByteRange;
		}, 'Error occurred while branding ByteRange value.');
	}

	function asCMYK(color: CMYKNumMap): CMYK {
		return errors.handleSync(() => {
		const brandedCyan = asPercentile(color.value.cyan);
		const brandedMagenta = asPercentile(color.value.magenta);
		const brandedYellow = asPercentile(color.value.yellow);
		const brandedKey = asPercentile(color.value.key);

		return {
			value: {
				cyan: brandedCyan,
				magenta: brandedMagenta,
				yellow: brandedYellow,
				key: brandedKey
			},
			format: 'cmyk'
		};
		}, 'Error occurred while branding color as CMYK.');
	}

	function asHex(color: HexStringMap): Hex {
		return errors.handleSync(() => {
			let hex = color.value.hex;

			if (!hex.startsWith('#')) hex = `#${hex}`;

			if (!regex.brand.hex.test(hex))
				throw new Error(`Invalid Hex color format: ${hex}`);

			const hexRaw = hex.slice(0, 7);

			const brandedHex = asHexSet(hexRaw) as HexSet;

			return {
				value: { hex: brandedHex },
				format: 'hex'
			};
		}, 'Error occurred while branding color as Hex.');
	}

	function asHexSet(value: string): HexSet {
		return errors.handleSync(() => {
			if (regex.brand.hex.test(value)) {
				value = value.slice(0, 7);
			}

			if (!validate.hexSet(value)) {
				throw new Error(`Invalid HexSet value: ${value}`);
			}

			return value as HexSet;
		}, 'Error occurred while branding HexSet value.');
	}

	function asHSL(color: HSLNumMap): HSL {
		return errors.handleSync(() => {
			const brandedHue = asRadial(color.value.hue);
			const brandedSaturation = asPercentile(color.value.saturation);
			const brandedLightness = asPercentile(color.value.lightness);

			return {
				value: {
					hue: brandedHue,
					saturation: brandedSaturation,
					lightness: brandedLightness
				},
				format: 'hsl'
			};
		}, 'Error occurred while branding color as HSL.');
	}

	function asPercentile(value: number): Percentile {
		return errors.handleSync(() => {
			validate.range(value, 'Percentile');

			return value as Percentile;
		}, 'Error occurred while branding Percentile value.');
	}

	function asRadial(value: number): Radial {
		return errors.handleSync(() => {
			validate.range(value, 'Radial');

			return value as Radial;
		}, 'Error occurred while branding Radial value.');
	}

	function asRGB(color: RGBNumMap): RGB {
		return errors.handleSync(() => {
			const brandedRed = asByteRange(color.value.red);
			const brandedGreen = asByteRange(color.value.green);
			const brandedBlue = asByteRange(color.value.blue);

			return {
				value: {
					red: brandedRed,
					green: brandedGreen,
					blue: brandedBlue
				},
				format: 'rgb'
			};
		}, 'Error occurred while branding color as RGB.');
	}

	function brandColor(color: ColorNumMap | ColorStringMap): Color {
		return errors.handleSync(() => {
			switch (color.format) {
				case 'cmyk':
					return {
						value: {
							cyan: asPercentile(0),
							magenta: asPercentile(0),
							yellow: asPercentile(0),
							key: asPercentile(0)
						},
						format: 'cmyk'
					};
				case 'hex':
					return {
						value: {
							hex: asHexSet('#000000')
						},
						format: 'hex'
					};
				case 'hsl':
					return {
						value: {
							hue: asRadial(0),
							saturation: asPercentile(0),
							lightness: asPercentile(0)
						},
						format: 'hsl'
					};
				case 'rgb':
					return {
						value: {
							red: asByteRange(0),
							green: asByteRange(0),
							blue: asByteRange(0)
						},
						format: 'rgb'
					};
				default:
					throw new Error(`
						Unknown color format\nDetails: ${JSON.stringify(color)}`);
			}
		}, 'Error occurred while branding color.');
	}

	function brandPalette(data: UnbrandedPalette): Palette {
		return errors.handleSync(() => {
			return {
				...data,
				metadata: { ...data.metadata },
				items: data.items.map((item, index) => ({
					itemID: index + 1,
					colors: {
						cmyk: {
							cyan: asPercentile(item.colors.cmyk.cyan ?? 0),
							magenta: asPercentile(item.colors.cmyk.magenta ?? 0),
							yellow: asPercentile(item.colors.cmyk.yellow ?? 0),
							key: asPercentile(item.colors.cmyk.key ?? 0)
						},
						hex: {
							hex: asHexSet(item.colors.hex.hex ?? '#000000')
						},
						hsl: {
							hue: asRadial(item.colors.hsl.hue ?? 0),
							saturation: asPercentile(
								item.colors.hsl.saturation ?? 0
							),
							lightness: asPercentile(
								item.colors.hsl.lightness ?? 0
							)
						},
						rgb: {
							red: asByteRange(item.colors.rgb.red ?? 0),
							green: asByteRange(item.colors.rgb.green ?? 0),
							blue: asByteRange(item.colors.rgb.blue ?? 0)
						}
					},
					css: {
						cmyk: `cmyk(${item.colors.cmyk.cyan}%, ${item.colors.cmyk.magenta}%, ${item.colors.cmyk.yellow}%, ${item.colors.cmyk.key}%)`,
						hex: `${item.colors.hex.hex}}`,
						hsl: `hsl(${item.colors.hsl.hue}, ${item.colors.hsl.saturation}%, ${item.colors.hsl.lightness}%)`,
						rgb: `rgb(${item.colors.rgb.red}, ${item.colors.rgb.green}, ${item.colors.rgb.blue})`
					}
				}))
			};
		}, 'Error occurred while branding palette.');
	}

	const brandingUtilities: BrandingUtilities = {
		asBranded,
		asByteRange,
		asCMYK,
		asHex,
		asHexSet,
		asHSL,
		asPercentile,
		asRadial,
		asRGB,
		brandColor,
		brandPalette
	};

	return errors.handleSync(() => {
		return brandingUtilities;
	}, 'Error occurred while creating branding utilities.');
}
