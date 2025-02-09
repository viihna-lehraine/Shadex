// File: utils/branding.js

import {
	BrandFunctions,
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
	ValidateFn,
	ValidationUtilsInterface,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../types/index.js';

function asBranded<T extends keyof RangeKeyMap>(
	value: number,
	rangeKey: T,
	validate: ValidateFn
): RangeKeyMap[T] {
	validate(value, rangeKey);

	return value as RangeKeyMap[T];
}

function asByteRange(value: number, validate: ValidateFn): ByteRange {
	validate(value, 'ByteRange');

	return value as ByteRange;
}

function asCMYK(color: UnbrandedCMYK, validate: ValidateFn): CMYK {
	const brandedCyan = asPercentile(color.value.cyan, validate);
	const brandedMagenta = asPercentile(color.value.magenta, validate);
	const brandedYellow = asPercentile(color.value.yellow, validate);
	const brandedKey = asPercentile(color.value.key, validate);

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

function asHex(color: UnbrandedHex, brand: BrandFunctions): Hex {
	let hex = color.value.hex;

	if (!hex.startsWith('#')) hex = `#${hex}`;

	if (!/^#[0-9A-Fa-f]{8}$/.test(hex))
		throw new Error(`Invalid Hex color format: ${hex}`);

	const hexRaw = hex.slice(0, 7);

	const brandedHex = brand.asHexSet(hexRaw) as HexSet;

	return {
		value: { hex: brandedHex },
		format: 'hex'
	};
}

function asHexSet(
	value: string,
	validateHexSet: (value: string) => boolean
): HexSet {
	if (/^#[0-9a-fA-F]{8}$/.test(value)) {
		value = value.slice(0, 7);
	}

	if (!validateHexSet(value)) {
		throw new Error(`Invalid HexSet value: ${value}`);
	}

	return value as HexSet;
}

function asHSL(color: UnbrandedHSL, validate: ValidateFn): HSL {
	const brandedHue = asRadial(color.value.hue, validate);
	const brandedSaturation = asPercentile(color.value.saturation, validate);
	const brandedLightness = asPercentile(color.value.lightness, validate);

	return {
		value: {
			hue: brandedHue,
			saturation: brandedSaturation,
			lightness: brandedLightness
		},
		format: 'hsl'
	};
}

function asHSV(color: UnbrandedHSV, validate: ValidateFn): HSV {
	const brandedHue = asRadial(color.value.hue, validate);
	const brandedSaturation = asPercentile(color.value.saturation, validate);
	const brandedValue = asPercentile(color.value.value, validate);

	return {
		value: {
			hue: brandedHue,
			saturation: brandedSaturation,
			value: brandedValue
		},
		format: 'hsv'
	};
}

function asLAB(color: UnbrandedLAB, validate: ValidateFn): LAB {
	const brandedL = asLAB_L(color.value.l, validate);
	const brandedA = asLAB_A(color.value.a, validate);
	const brandedB = asLAB_B(color.value.b, validate);

	return {
		value: {
			l: brandedL,
			a: brandedA,
			b: brandedB
		},
		format: 'lab'
	};
}

function asLAB_L(value: number, validate: ValidateFn): LAB_L {
	validate(value, 'LAB_L');

	return value as LAB_L;
}

function asLAB_A(value: number, validate: ValidateFn): LAB_A {
	validate(value, 'LAB_A');

	return value as LAB_A;
}

function asLAB_B(value: number, validate: ValidateFn): LAB_B {
	validate(value, 'LAB_B');
	return value as LAB_B;
}

function asPercentile(value: number, validate: ValidateFn): Percentile {
	validate(value, 'Percentile');

	return value as Percentile;
}

function asRadial(value: number, validate: ValidateFn): Radial {
	validate(value, 'Radial');

	return value as Radial;
}

function asRGB(color: UnbrandedRGB, validate: ValidateFn): RGB {
	const brandedRed = asByteRange(color.value.red, validate);
	const brandedGreen = asByteRange(color.value.green, validate);
	const brandedBlue = asByteRange(color.value.blue, validate);

	return {
		value: {
			red: brandedRed,
			green: brandedGreen,
			blue: brandedBlue
		},
		format: 'rgb'
	};
}

function asSL(color: UnbrandedSL, validate: ValidateFn): SL {
	const brandedSaturation = asPercentile(color.value.saturation, validate);
	const brandedLightness = asPercentile(color.value.lightness, validate);

	return {
		value: {
			saturation: brandedSaturation,
			lightness: brandedLightness
		},
		format: 'sl'
	};
}

function asSV(color: UnbrandedSV, validate: ValidateFn): SV {
	const brandedSaturation = asPercentile(color.value.saturation, validate);
	const brandedValue = asPercentile(color.value.value, validate);

	return {
		value: {
			saturation: brandedSaturation,
			value: brandedValue
		},
		format: 'sv'
	};
}

function asXYZ(color: UnbrandedXYZ, validate: ValidateFn): XYZ {
	const brandedX = asXYZ_X(color.value.x, validate);
	const brandedY = asXYZ_Y(color.value.y, validate);
	const brandedZ = asXYZ_Z(color.value.z, validate);

	return {
		value: {
			x: brandedX,
			y: brandedY,
			z: brandedZ
		},
		format: 'xyz'
	};
}

function asXYZ_X(value: number, validate: ValidateFn): XYZ_X {
	validate(value, 'XYZ_X');

	return value as XYZ_X;
}

function asXYZ_Y(value: number, validate: ValidateFn): XYZ_Y {
	validate(value, 'XYZ_Y');

	return value as XYZ_Y;
}

function asXYZ_Z(value: number, validate: ValidateFn): XYZ_Z {
	validate(value, 'XYZ_Z');

	return value as XYZ_Z;
}

function brandColor(
	color: UnbrandedColor,
	validate: ValidationUtilsInterface
): Color {
	switch (color.format) {
		case 'cmyk':
			return {
				value: {
					cyan: asPercentile(0, validate.range),
					magenta: asPercentile(0, validate.range),
					yellow: asPercentile(0, validate.range),
					key: asPercentile(0, validate.range)
				},
				format: 'cmyk'
			};
		case 'hex':
			return {
				value: {
					hex: asHexSet('#000000', validate.hexSet)
				},
				format: 'hex'
			};
		case 'hsl':
			return {
				value: {
					hue: asRadial(0, validate.range),
					saturation: asPercentile(0, validate.range),
					lightness: asPercentile(0, validate.range)
				},
				format: 'hsl'
			};
		case 'hsv':
			return {
				value: {
					hue: asRadial(0, validate.range),
					saturation: asPercentile(0, validate.range),
					value: asPercentile(0, validate.range)
				},
				format: 'hsv'
			};
		case 'lab':
			return {
				value: {
					l: asLAB_L(0, validate.range),
					a: asLAB_A(0, validate.range),
					b: asLAB_B(0, validate.range)
				},
				format: 'lab'
			};
		case 'rgb':
			return {
				value: {
					red: asByteRange(0, validate.range),
					green: asByteRange(0, validate.range),
					blue: asByteRange(0, validate.range)
				},
				format: 'rgb'
			};
		case 'sl':
			return {
				value: {
					saturation: asPercentile(0, validate.range),
					lightness: asPercentile(0, validate.range)
				},
				format: 'sl'
			};
		case 'sv':
			return {
				value: {
					saturation: asPercentile(0, validate.range),
					value: asPercentile(0, validate.range)
				},
				format: 'sv'
			};
		case 'xyz':
			return {
				value: {
					x: asXYZ_X(0, validate.range),
					y: asXYZ_Y(0, validate.range),
					z: asXYZ_Z(0, validate.range)
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
	validate: ValidationUtilsInterface
): Palette {
	return {
		...data,
		metadata: { ...data.metadata },
		items: data.items.map(item => ({
			colors: {
				main: {
					cmyk: {
						cyan: asPercentile(
							item.colors.main.cmyk.cyan ?? 0,
							validate.range
						),
						magenta: asPercentile(
							item.colors.main.cmyk.magenta ?? 0,
							validate.range
						),
						yellow: asPercentile(
							item.colors.main.cmyk.yellow ?? 0,
							validate.range
						),
						key: asPercentile(
							item.colors.main.cmyk.key ?? 0,
							validate.range
						)
					},
					hex: {
						hex: asHexSet(
							item.colors.main.hex.hex ?? '#000000',
							validate.hexSet
						)
					},
					hsl: {
						hue: asRadial(
							item.colors.main.hsl.hue ?? 0,
							validate.range
						),
						saturation: asPercentile(
							item.colors.main.hsl.saturation ?? 0,
							validate.range
						),
						lightness: asPercentile(
							item.colors.main.hsl.lightness ?? 0,
							validate.range
						)
					},
					hsv: {
						hue: asRadial(
							item.colors.main.hsv.hue ?? 0,
							validate.range
						),
						saturation: asPercentile(
							item.colors.main.hsv.saturation ?? 0,
							validate.range
						),
						value: asPercentile(
							item.colors.main.hsv.value ?? 0,
							validate.range
						)
					},
					lab: {
						l: asLAB_L(item.colors.main.lab.l ?? 0, validate.range),
						a: asLAB_A(item.colors.main.lab.a ?? 0, validate.range),
						b: asLAB_B(item.colors.main.lab.b ?? 0, validate.range)
					},
					rgb: {
						red: asByteRange(
							item.colors.main.rgb.red ?? 0,
							validate.range
						),
						green: asByteRange(
							item.colors.main.rgb.green ?? 0,
							validate.range
						),
						blue: asByteRange(
							item.colors.main.rgb.blue ?? 0,
							validate.range
						)
					},
					xyz: {
						x: asXYZ_X(item.colors.main.xyz.x ?? 0, validate.range),
						y: asXYZ_Y(item.colors.main.xyz.y ?? 0, validate.range),
						z: asXYZ_Z(item.colors.main.xyz.z ?? 0, validate.range)
					}
				},
				stringProps: {
					cmyk: {
						cyan: String(item.colors.main.cmyk.cyan ?? 0),
						magenta: String(item.colors.main.cmyk.magenta ?? 0),
						yellow: String(item.colors.main.cmyk.yellow ?? 0),
						key: String(item.colors.main.cmyk.key ?? 0)
					},
					hex: {
						hex: String(item.colors.main.hex.hex ?? '#000000')
					},
					hsl: {
						hue: String(item.colors.main.hsl.hue ?? 0),
						saturation: String(
							item.colors.main.hsl.saturation ?? 0
						),
						lightness: String(item.colors.main.hsl.lightness ?? 0)
					},
					hsv: {
						hue: String(item.colors.main.hsv.hue ?? 0),
						saturation: String(
							item.colors.main.hsv.saturation ?? 0
						),
						value: String(item.colors.main.hsv.value ?? 0)
					},
					lab: {
						l: String(item.colors.main.lab.l ?? 0),
						a: String(item.colors.main.lab.a ?? 0),
						b: String(item.colors.main.lab.b ?? 0)
					},
					rgb: {
						red: String(item.colors.main.rgb.red ?? 0),
						green: String(item.colors.main.rgb.green ?? 0),
						blue: String(item.colors.main.rgb.blue ?? 0)
					},
					xyz: {
						x: String(item.colors.main.xyz.x ?? 0),
						y: String(item.colors.main.xyz.y ?? 0),
						z: String(item.colors.main.xyz.z ?? 0)
					}
				},
				css: {
					cmyk: `cmyk(${item.colors.main.cmyk.cyan}%, ${item.colors.main.cmyk.magenta}%, ${item.colors.main.cmyk.yellow}%, ${item.colors.main.cmyk.key}%)`,
					hex: `${item.colors.main.hex.hex}}`,
					hsl: `hsl(${item.colors.main.hsl.hue}, ${item.colors.main.hsl.saturation}%, ${item.colors.main.hsl.lightness}%)`,
					hsv: `hsv(${item.colors.main.hsv.hue}, ${item.colors.main.hsv.saturation}%, ${item.colors.main.hsv.value}%)`,
					lab: `lab(${item.colors.main.lab.l}, ${item.colors.main.lab.a}, ${item.colors.main.lab.b})`,
					rgb: `rgb(${item.colors.main.rgb.red}, ${item.colors.main.rgb.green}, ${item.colors.main.rgb.blue})`,
					xyz: `xyz(${item.colors.main.xyz.x}, ${item.colors.main.xyz.y}, ${item.colors.main.xyz.z})`
				}
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
