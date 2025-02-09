// File: common/core/brand.js

import {
	BrandFunctions,
	ByteRange,
	CMYK,
	CommonFunctionsInterface,
	Hex,
	HexSet,
	HSL,
	HSV,
	LAB,
	LAB_L,
	LAB_A,
	LAB_B,
	Percentile,
	Radial,
	RGB,
	RangeKeyMap,
	SL,
	SV,
	UnbrandedCMYK,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedRGB,
	UnbrandedSL,
	UnbrandedSV,
	UnbrandedXYZ,
	ValidateFn,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../types/index.js';

// ******** 1. Value Branding Functions ********

export function asBranded<T extends keyof RangeKeyMap>(
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

function asHexSet(value: string, validateHexSet: (value: string) => boolean): HexSet {
	if (/^#[0-9a-fA-F]{8}$/.test(value)) {
		value = value.slice(0, 7);
	}

	if (!validateHexSet(value)) {
		throw new Error(`Invalid HexSet value: ${value}`);
	}

	return value as HexSet;
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

export const brand: CommonFunctionsInterface['core']['brand'] = {
	asBranded,
	asByteRange,
	asHexSet,
	asLAB_L,
	asLAB_A,
	asLAB_B,
	asPercentile,
	asRadial,
	asXYZ_X,
	asXYZ_Y,
	asXYZ_Z
} as const;

// ******** 2. Color Branding Functions ********

function asCMYK(color: UnbrandedCMYK, validate: ValidateFn): CMYK {
	const brandedCyan = brand.asPercentile(color.value.cyan, validate);
	const brandedMagenta = brand.asPercentile(color.value.magenta, validate);
	const brandedYellow = brand.asPercentile(color.value.yellow, validate);
	const brandedKey = brand.asPercentile(color.value.key, validate);

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

	const brandedHex = brand.asHexSet(hexRaw);

	return {
		value: { hex: brandedHex },
		format: 'hex'
	};
}

function asHSL(color: UnbrandedHSL, validate: ValidateFuntions): HSL {
	const brandedHue = brand.asRadial(color.value.hue, validate);
	const brandedSaturation = brand.asPercentile(color.value.saturation, validate);
	const brandedLightness = brand.asPercentile(color.value.lightness, validate);

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
	const brandedHue = brand.asRadial(color.value.hue, validate);
	const brandedSaturation = brand.asPercentile(color.value.saturation, validate);
	const brandedValue = brand.asPercentile(color.value.value, validate);

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
	const brandedL = brand.asLAB_L(color.value.l, validate);
	const brandedA = brand.asLAB_A(color.value.a, validate);
	const brandedB = brand.asLAB_B(color.value.b, validate);

	return {
		value: {
			l: brandedL,
			a: brandedA,
			b: brandedB
		},
		format: 'lab'
	};
}

function asRGB(color: UnbrandedRGB, validate: ValidateFn): RGB {
	const brandedRed = brand.asByteRange(color.value.red, validate);
	const brandedGreen = brand.asByteRange(color.value.green, validate);
	const brandedBlue = brand.asByteRange(color.value.blue, validate);

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
	const brandedSaturation = brand.asPercentile(color.value.saturation, validate);
	const brandedLightness = brand.asPercentile(color.value.lightness, validate);

	return {
		value: {
			saturation: brandedSaturation,
			lightness: brandedLightness
		},
		format: 'sl'
	};
}

function asSV(color: UnbrandedSV, validate: ValidateFn): SV {
	const brandedSaturation = brand.asPercentile(color.value.saturation, validate);
	const brandedValue = brand.asPercentile(color.value.value, validate);

	return {
		value: {
			saturation: brandedSaturation,
			value: brandedValue
		},
		format: 'sv'
	};
}

function asXYZ(color: UnbrandedXYZ, validate: ValidateFn): XYZ {
	const brandedX = brand.asXYZ_X(color.value.x, validate);
	const brandedY = brand.asXYZ_Y(color.value.y, validate);
	const brandedZ = brand.asXYZ_Z(color.value.z, validate);

	return {
		value: {
			x: brandedX,
			y: brandedY,
			z: brandedZ
		},
		format: 'xyz'
	};
}

export const brandColor: CommonFunctionsInterface['core']['brandColor'] = {
	asCMYK,
	asHex,
	asHSL,
	asHSV,
	asLAB,
	asRGB,
	asSL,
	asSV,
	asXYZ
};
