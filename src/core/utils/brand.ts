// File: core/utils/brand.ts

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
	HSV,
	HSVNumMap,
	LAB,
	LABNumMap,
	LAB_L,
	LAB_A,
	LAB_B,
	Palette,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	SL,
	SV,
	UnbrandedPalette,
	RGBNumMap,
	Services,
	SLNumMap,
	SVNumMap,
	ValidationUtilities,
	XYZ,
	XYZNumMap,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
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

	function asHSV(color: HSVNumMap): HSV {
		return errors.handleSync(() => {
			const brandedHue = asRadial(color.value.hue);
			const brandedSaturation = asPercentile(color.value.saturation);
			const brandedValue = asPercentile(color.value.value);

			return {
				value: {
					hue: brandedHue,
					saturation: brandedSaturation,
					value: brandedValue
				},
				format: 'hsv'
			};
		}, 'Error occurred while branding color as HSV.');
	}

	function asLAB(color: LABNumMap): LAB {
		return errors.handleSync(() => {
			const brandedL = asLAB_L(color.value.l);
			const brandedA = asLAB_A(color.value.a);
			const brandedB = asLAB_B(color.value.b);

			return {
				value: {
					l: brandedL,
					a: brandedA,
					b: brandedB
				},
				format: 'lab'
			};
		}, 'Error occurred while branding color as LAB.');
	}

	function asLAB_A(value: number): LAB_A {
		return errors.handleSync(() => {
			validate.range(value, 'LAB_A');

			return value as LAB_A;
		}, 'Error occurred while branding LAB_A value.');
	}

	function asLAB_B(value: number): LAB_B {
		return errors.handleSync(() => {
			validate.range(value, 'LAB_B');

			return value as LAB_B;
		}, 'Error occurred while branding LAB_B value.');
	}

	function asLAB_L(value: number): LAB_L {
		return errors.handleSync(() => {
			validate.range(value, 'LAB_L');

			return value as LAB_L;
		}, 'Error occurred while branding LAB_L value.');
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

	function asSL(color: SLNumMap): SL {
		return errors.handleSync(() => {
			const brandedSaturation = asPercentile(color.value.saturation);
			const brandedLightness = asPercentile(color.value.lightness);

			return {
				value: {
					saturation: brandedSaturation,
					lightness: brandedLightness
				},
				format: 'sl'
			};
		}, 'Error occurred while branding color as SL.');
	}

	function asSV(color: SVNumMap): SV {
		return errors.handleSync(() => {
			const brandedSaturation = asPercentile(color.value.saturation);
			const brandedValue = asPercentile(color.value.value);

			return {
				value: {
					saturation: brandedSaturation,
					value: brandedValue
				},
				format: 'sv'
			};
		}, 'Error occurred while branding color as SV.');
	}

	function asXYZ(color: XYZNumMap): XYZ {
		return errors.handleSync(() => {
			const brandedX = asXYZ_X(color.value.x);
			const brandedY = asXYZ_Y(color.value.y);
			const brandedZ = asXYZ_Z(color.value.z);

			return {
				value: {
					x: brandedX,
					y: brandedY,
					z: brandedZ
				},
				format: 'xyz'
			};
		}, 'Error occurred while branding color as XYZ.');
	}

	function asXYZ_X(value: number): XYZ_X {
		return errors.handleSync(() => {
			validate.range(value, 'XYZ_X');

			return value as XYZ_X;
		}, 'Error occurred while branding XYZ_X value.');
	}

	function asXYZ_Y(value: number): XYZ_Y {
		return errors.handleSync(() => {
			validate.range(value, 'XYZ_Y');

			return value as XYZ_Y;
		}, 'Error occurred while branding XYZ_Y value.');
	}

	function asXYZ_Z(value: number): XYZ_Z {
		return errors.handleSync(() => {
			validate.range(value, 'XYZ_Z');

			return value as XYZ_Z;
		}, 'Error occurred while branding XYZ_Z value.');
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
				case 'hsv':
					return {
						value: {
							hue: asRadial(0),
							saturation: asPercentile(0),
							value: asPercentile(0)
						},
						format: 'hsv'
					};
				case 'lab':
					return {
						value: {
							l: asLAB_L(0),
							a: asLAB_A(0),
							b: asLAB_B(0)
						},
						format: 'lab'
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
				case 'sl':
					return {
						value: {
							saturation: asPercentile(0),
							lightness: asPercentile(0)
						},
						format: 'sl'
					};
				case 'sv':
					return {
						value: {
							saturation: asPercentile(0),
							value: asPercentile(0)
						},
						format: 'sv'
					};
				case 'xyz':
					return {
						value: {
							x: asXYZ_X(0),
							y: asXYZ_Y(0),
							z: asXYZ_Z(0)
						},
						format: 'xyz'
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
						hsv: {
							hue: asRadial(item.colors.hsv.hue ?? 0),
							saturation: asPercentile(
								item.colors.hsv.saturation ?? 0
							),
							value: asPercentile(item.colors.hsv.value ?? 0)
						},
						lab: {
							l: asLAB_L(item.colors.lab.l ?? 0),
							a: asLAB_A(item.colors.lab.a ?? 0),
							b: asLAB_B(item.colors.lab.b ?? 0)
						},
						rgb: {
							red: asByteRange(item.colors.rgb.red ?? 0),
							green: asByteRange(item.colors.rgb.green ?? 0),
							blue: asByteRange(item.colors.rgb.blue ?? 0)
						},
						xyz: {
							x: asXYZ_X(item.colors.xyz.x ?? 0),
							y: asXYZ_Y(item.colors.xyz.y ?? 0),
							z: asXYZ_Z(item.colors.xyz.z ?? 0)
						}
					},
					css: {
						cmyk: `cmyk(${item.colors.cmyk.cyan}%, ${item.colors.cmyk.magenta}%, ${item.colors.cmyk.yellow}%, ${item.colors.cmyk.key}%)`,
						hex: `${item.colors.hex.hex}}`,
						hsl: `hsl(${item.colors.hsl.hue}, ${item.colors.hsl.saturation}%, ${item.colors.hsl.lightness}%)`,
						hsv: `hsv(${item.colors.hsv.hue}, ${item.colors.hsv.saturation}%, ${item.colors.hsv.value}%)`,
						lab: `lab(${item.colors.lab.l}, ${item.colors.lab.a}, ${item.colors.lab.b})`,
						rgb: `rgb(${item.colors.rgb.red}, ${item.colors.rgb.green}, ${item.colors.rgb.blue})`,
						xyz: `xyz(${item.colors.xyz.x}, ${item.colors.xyz.y}, ${item.colors.xyz.z})`
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
		asHSV,
		asLAB,
		asLAB_A,
		asLAB_B,
		asLAB_L,
		asPercentile,
		asRadial,
		asRGB,
		asSL,
		asSV,
		asXYZ,
		asXYZ_X,
		asXYZ_Y,
		asXYZ_Z,
		brandColor,
		brandPalette
	};

	return errors.handleSync(() => {
		return brandingUtilities;
	}, 'Error occurred while creating branding utilities.');
}
