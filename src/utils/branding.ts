// File: utils/branding.js

import {
	BrandingUtilsInterface,
	ByteRange,
	CMYK,
	Color,
	Hex,
	HexSet,
	HSL,
	HSV,
	LAB,
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
	UnbrandedCMYK,
	UnbrandedColor,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedPalette,
	UnbrandedRGB,
	UnbrandedSL,
	UnbrandedSV,
	UnbrandedXYZ,
	UtilitiesInterface,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../types/index.js';
import { configData as config } from '../data/config.js';

const regex = config.regex;

function asBranded<T extends keyof RangeKeyMap>(
	value: number,
	rangeKey: T,
	utils: UtilitiesInterface
): RangeKeyMap[T] {
	utils.validate.range(value, rangeKey);

	return value as RangeKeyMap[T];
}

function asByteRange(value: number, utils: UtilitiesInterface): ByteRange {
	utils.validate.range(value, 'ByteRange');

	return value as ByteRange;
}

function asCMYK(color: UnbrandedCMYK, utils: UtilitiesInterface): CMYK {
	const brandedCyan = asPercentile(color.value.cyan, utils);
	const brandedMagenta = asPercentile(color.value.magenta, utils);
	const brandedYellow = asPercentile(color.value.yellow, utils);
	const brandedKey = asPercentile(color.value.key, utils);

	return {
		value: {
			cyan: brandedCyan,
			magenta: brandedMagenta,
			yellow: brandedYellow,
			key: brandedKey
		},
		format: 'cmyk'
	};
}

function asHex(color: UnbrandedHex, utils: UtilitiesInterface): Hex {
	let hex = color.value.hex;

	if (!hex.startsWith('#')) hex = `#${hex}`;

	if (!regex.brand.hex.test(hex))
		throw new Error(`Invalid Hex color format: ${hex}`);

	const hexRaw = hex.slice(0, 7);

	const brandedHex = utils.brand.asHexSet(hexRaw, utils) as HexSet;

	return {
		value: { hex: brandedHex },
		format: 'hex'
	};
}

function asHexSet(value: string, utils: UtilitiesInterface): HexSet {
	if (regex.brand.hex.test(value)) {
		value = value.slice(0, 7);
	}

	if (!utils.validate.hexSet(value)) {
		throw new Error(`Invalid HexSet value: ${value}`);
	}

	return value as HexSet;
}

function asHSL(color: UnbrandedHSL, utils: UtilitiesInterface): HSL {
	const brandedHue = asRadial(color.value.hue, utils);
	const brandedSaturation = asPercentile(color.value.saturation, utils);
	const brandedLightness = asPercentile(color.value.lightness, utils);

	return {
		value: {
			hue: brandedHue,
			saturation: brandedSaturation,
			lightness: brandedLightness
		},
		format: 'hsl'
	};
}

function asHSV(color: UnbrandedHSV, utils: UtilitiesInterface): HSV {
	const brandedHue = asRadial(color.value.hue, utils);
	const brandedSaturation = asPercentile(color.value.saturation, utils);
	const brandedValue = asPercentile(color.value.value, utils);

	return {
		value: {
			hue: brandedHue,
			saturation: brandedSaturation,
			value: brandedValue
		},
		format: 'hsv'
	};
}

function asLAB(color: UnbrandedLAB, utils: UtilitiesInterface): LAB {
	const brandedL = asLAB_L(color.value.l, utils);
	const brandedA = asLAB_A(color.value.a, utils);
	const brandedB = asLAB_B(color.value.b, utils);

	return {
		value: {
			l: brandedL,
			a: brandedA,
			b: brandedB
		},
		format: 'lab'
	};
}

function asLAB_A(value: number, utils: UtilitiesInterface): LAB_A {
	utils.validate.range(value, 'LAB_A');

	return value as LAB_A;
}

function asLAB_B(value: number, utils: UtilitiesInterface): LAB_B {
	utils.validate.range(value, 'LAB_B');

	return value as LAB_B;
}

function asLAB_L(value: number, utils: UtilitiesInterface): LAB_L {
	utils.validate.range(value, 'LAB_L');

	return value as LAB_L;
}

function asPercentile(value: number, utils: UtilitiesInterface): Percentile {
	utils.validate.range(value, 'Percentile');

	return value as Percentile;
}

function asRadial(value: number, utils: UtilitiesInterface): Radial {
	utils.validate.range(value, 'Radial');

	return value as Radial;
}

function asRGB(color: UnbrandedRGB, utils: UtilitiesInterface): RGB {
	const brandedRed = asByteRange(color.value.red, utils);
	const brandedGreen = asByteRange(color.value.green, utils);
	const brandedBlue = asByteRange(color.value.blue, utils);

	return {
		value: {
			red: brandedRed,
			green: brandedGreen,
			blue: brandedBlue
		},
		format: 'rgb'
	};
}

function asSL(color: UnbrandedSL, utils: UtilitiesInterface): SL {
	const brandedSaturation = asPercentile(color.value.saturation, utils);
	const brandedLightness = asPercentile(color.value.lightness, utils);

	return {
		value: {
			saturation: brandedSaturation,
			lightness: brandedLightness
		},
		format: 'sl'
	};
}

function asSV(color: UnbrandedSV, utils: UtilitiesInterface): SV {
	const brandedSaturation = asPercentile(color.value.saturation, utils);
	const brandedValue = asPercentile(color.value.value, utils);

	return {
		value: {
			saturation: brandedSaturation,
			value: brandedValue
		},
		format: 'sv'
	};
}

function asXYZ(color: UnbrandedXYZ, utils: UtilitiesInterface): XYZ {
	const brandedX = asXYZ_X(color.value.x, utils);
	const brandedY = asXYZ_Y(color.value.y, utils);
	const brandedZ = asXYZ_Z(color.value.z, utils);

	return {
		value: {
			x: brandedX,
			y: brandedY,
			z: brandedZ
		},
		format: 'xyz'
	};
}

function asXYZ_X(value: number, utils: UtilitiesInterface): XYZ_X {
	utils.validate.range(value, 'XYZ_X');

	return value as XYZ_X;
}

function asXYZ_Y(value: number, utils: UtilitiesInterface): XYZ_Y {
	utils.validate.range(value, 'XYZ_Y');

	return value as XYZ_Y;
}

function asXYZ_Z(value: number, utils: UtilitiesInterface): XYZ_Z {
	utils.validate.range(value, 'XYZ_Z');

	return value as XYZ_Z;
}

function brandColor(color: UnbrandedColor, utils: UtilitiesInterface): Color {
	switch (color.format) {
		case 'cmyk':
			return {
				value: {
					cyan: asPercentile(0, utils),
					magenta: asPercentile(0, utils),
					yellow: asPercentile(0, utils),
					key: asPercentile(0, utils)
				},
				format: 'cmyk'
			};
		case 'hex':
			return {
				value: {
					hex: asHexSet('#000000', utils)
				},
				format: 'hex'
			};
		case 'hsl':
			return {
				value: {
					hue: asRadial(0, utils),
					saturation: asPercentile(0, utils),
					lightness: asPercentile(0, utils)
				},
				format: 'hsl'
			};
		case 'hsv':
			return {
				value: {
					hue: asRadial(0, utils),
					saturation: asPercentile(0, utils),
					value: asPercentile(0, utils)
				},
				format: 'hsv'
			};
		case 'lab':
			return {
				value: {
					l: asLAB_L(0, utils),
					a: asLAB_A(0, utils),
					b: asLAB_B(0, utils)
				},
				format: 'lab'
			};
		case 'rgb':
			return {
				value: {
					red: asByteRange(0, utils),
					green: asByteRange(0, utils),
					blue: asByteRange(0, utils)
				},
				format: 'rgb'
			};
		case 'sl':
			return {
				value: {
					saturation: asPercentile(0, utils),
					lightness: asPercentile(0, utils)
				},
				format: 'sl'
			};
		case 'sv':
			return {
				value: {
					saturation: asPercentile(0, utils),
					value: asPercentile(0, utils)
				},
				format: 'sv'
			};
		case 'xyz':
			return {
				value: {
					x: asXYZ_X(0, utils),
					y: asXYZ_Y(0, utils),
					z: asXYZ_Z(0, utils)
				},
				format: 'xyz'
			};
		default:
			throw new Error(`
				Unknown color format\nDetails: ${JSON.stringify(color)}`);
	}
}

function brandPalette(
	data: UnbrandedPalette,
	utils: UtilitiesInterface
): Palette {
	return {
		...data,
		metadata: { ...data.metadata },
		items: data.items.map((item, index) => ({
			itemID: index + 1,
			colors: {
				cmyk: {
					cyan: asPercentile(item.colors.cmyk.cyan ?? 0, utils),
					magenta: asPercentile(item.colors.cmyk.magenta ?? 0, utils),
					yellow: asPercentile(item.colors.cmyk.yellow ?? 0, utils),
					key: asPercentile(item.colors.cmyk.key ?? 0, utils)
				},
				hex: {
					hex: asHexSet(item.colors.hex.hex ?? '#000000', utils)
				},
				hsl: {
					hue: asRadial(item.colors.hsl.hue ?? 0, utils),
					saturation: asPercentile(
						item.colors.hsl.saturation ?? 0,
						utils
					),
					lightness: asPercentile(
						item.colors.hsl.lightness ?? 0,
						utils
					)
				},
				hsv: {
					hue: asRadial(item.colors.hsv.hue ?? 0, utils),
					saturation: asPercentile(
						item.colors.hsv.saturation ?? 0,
						utils
					),
					value: asPercentile(item.colors.hsv.value ?? 0, utils)
				},
				lab: {
					l: asLAB_L(item.colors.lab.l ?? 0, utils),
					a: asLAB_A(item.colors.lab.a ?? 0, utils),
					b: asLAB_B(item.colors.lab.b ?? 0, utils)
				},
				rgb: {
					red: asByteRange(item.colors.rgb.red ?? 0, utils),
					green: asByteRange(item.colors.rgb.green ?? 0, utils),
					blue: asByteRange(item.colors.rgb.blue ?? 0, utils)
				},
				xyz: {
					x: asXYZ_X(item.colors.xyz.x ?? 0, utils),
					y: asXYZ_Y(item.colors.xyz.y ?? 0, utils),
					z: asXYZ_Z(item.colors.xyz.z ?? 0, utils)
				}
			},
			stringProps: {
				cmyk: {
					cyan: String(item.colors.cmyk.cyan ?? 0),
					magenta: String(item.colors.cmyk.magenta ?? 0),
					yellow: String(item.colors.cmyk.yellow ?? 0),
					key: String(item.colors.cmyk.key ?? 0)
				},
				hex: {
					hex: String(item.colors.hex.hex ?? '#000000')
				},
				hsl: {
					hue: String(item.colors.hsl.hue ?? 0),
					saturation: String(item.colors.hsl.saturation ?? 0),
					lightness: String(item.colors.hsl.lightness ?? 0)
				},
				hsv: {
					hue: String(item.colors.hsv.hue ?? 0),
					saturation: String(item.colors.hsv.saturation ?? 0),
					value: String(item.colors.hsv.value ?? 0)
				},
				lab: {
					l: String(item.colors.lab.l ?? 0),
					a: String(item.colors.lab.a ?? 0),
					b: String(item.colors.lab.b ?? 0)
				},
				rgb: {
					red: String(item.colors.rgb.red ?? 0),
					green: String(item.colors.rgb.green ?? 0),
					blue: String(item.colors.rgb.blue ?? 0)
				},
				xyz: {
					x: String(item.colors.xyz.x ?? 0),
					y: String(item.colors.xyz.y ?? 0),
					z: String(item.colors.xyz.z ?? 0)
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
}

export const brandingUtils: BrandingUtilsInterface = {
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
