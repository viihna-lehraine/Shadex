// File: common/conversion/base.js

import {
	BrandFunctions,
	ColorSpaceExtended,
	CommonFunctionsInterface,
	CMYK,
	CMYK_StringProps,
	Color,
	Color_StringProps,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	RangeKeyMap,
	RGB,
	RGB_StringProps,
	SL,
	SV,
	ValidateFn,
	ValidateFunctions,
	XYZ,
	XYZ_StringProps
} from '../../types/index.js';
import { createLogger } from '../../logger/factory.js';
import { conversionDeps } from './deps.js';
import { coreUtils } from '../core/index.js';
import { validate } from '../core/validate.js';

const brand = coreUtils.brand;
const logger = await createLogger();

const cmykToHSL = conversionDeps.cmykToHSL;
const hexToHSL = conversionDeps.hexToHSL;
const hslToCMYK = conversionDeps.hslToCMYK;
const hslToHex = conversionDeps.hslToHex;
const hslToHSV = conversionDeps.hslToHSV;
const hslToLAB = conversionDeps.hslToLAB;
const hslToRGB = conversionDeps.hslToRGB;
const hslToSL = conversionDeps.hslToSL;
const hslToSV = conversionDeps.hslToSV;
const hslToXYZ = conversionDeps.hslToXYZ;
const hsvToHSL = conversionDeps.hsvToHSL;
const labToHSL = conversionDeps.labToHSL;
const rgbToHSL = conversionDeps.rgbToHSL;
const xyzToHSL = conversionDeps.xyzToHSL;

function initializeDefaultColors() {
	return {
		cmyk: {
			value: {
				cyan: brand.asPercentile(0, validate.range),
				magenta: brand.asPercentile(0, validate.range),
				yellow: brand.asPercentile(0, validate.range),
				key: brand.asPercentile(0, validate.range)
			},
			format: 'cmyk'
		},
		hex: {
			value: {
				hex: brand.asHexSet('#000000', validate.hexSet)
			},
			format: 'hex'
		},
		hsl: {
			value: {
				hue: brand.asRadial(0, validate.range),
				saturation: brand.asPercentile(0, validate.range),
				lightness: brand.asPercentile(0, validate.range)
			},
			format: 'hsl'
		},
		hsv: {
			value: {
				hue: brand.asRadial(0, validate.range),
				saturation: brand.asPercentile(0, validate.range),
				value: brand.asPercentile(0, validate.range)
			},
			format: 'hsv'
		},
		lab: {
			value: {
				l: brand.asLAB_L(0, validate.range),
				a: brand.asLAB_A(0, validate.range),
				b: brand.asLAB_B(0, validate.range)
			},
			format: 'lab'
		},
		rgb: {
			value: {
				red: brand.asByteRange(0, validate.range),
				green: brand.asByteRange(0, validate.range),
				blue: brand.asByteRange(0, validate.range)
			},
			format: 'rgb'
		},
		sl: {
			value: {
				saturation: brand.asPercentile(0, validate.range),
				lightness: brand.asPercentile(0, validate.range)
			},
			format: 'sl'
		},
		sv: {
			value: {
				saturation: brand.asPercentile(0, validate.range),
				value: brand.asPercentile(0, validate.range)
			},
			format: 'sv'
		},
		xyz: {
			value: {
				x: brand.asXYZ_X(0, validate.range),
				y: brand.asXYZ_Y(0, validate.range),
				z: brand.asXYZ_Z(0, validate.range)
			},
			format: 'xyz'
		}
	};
}

function cmykStringToValue(cmyk: CMYK_StringProps['value']): CMYK['value'] {
	return {
		cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100, validate.range),
		magenta: brand.asPercentile(
			parseFloat(cmyk.magenta) / 100,
			validate.range
		),
		yellow: brand.asPercentile(
			parseFloat(cmyk.yellow) / 100,
			validate.range
		),
		key: brand.asPercentile(parseFloat(cmyk.key) / 100, validate.range)
	};
}

function cmykValueToString(cmyk: CMYK['value']): CMYK_StringProps['value'] {
	return {
		cyan: `${cmyk.cyan * 100}%`,
		magenta: `${cmyk.magenta * 100}%`,
		yellow: `${cmyk.yellow * 100}%`,
		key: `${cmyk.key * 100}%`
	};
}

async function colorStringToColor(
	colorString: Color_StringProps
): Promise<Color> {
	const clonedColor = coreUtils.base.clone(colorString);

	const parseValue = (value: string | number): number =>
		typeof value === 'string' && value.endsWith('%')
			? parseFloat(value.slice(0, -1))
			: Number(value);

	const newValue = Object.entries(clonedColor.value).reduce(
		(acc, [key, val]) => {
			acc[key as keyof (typeof clonedColor)['value']] = parseValue(
				val
			) as never;

			return acc;
		},
		{} as Record<keyof (typeof clonedColor)['value'], number>
	);

	switch (clonedColor.format) {
		case 'cmyk':
			return { format: 'cmyk', value: newValue as CMYK['value'] };
		case 'hsl':
			return { format: 'hsl', value: newValue as HSL['value'] };
		case 'hsv':
			return { format: 'hsv', value: newValue as HSV['value'] };
		case 'sl':
			return { format: 'sl', value: newValue as SL['value'] };
		case 'sv':
			return { format: 'sv', value: newValue as SV['value'] };
		default:
			console.error('Unsupported format for colorStringToColor');

			const defaultColors = initializeDefaultColors();

			const unbrandedHSL = defaultColors.hsl;

			const brandedHue = brand.asRadial(
				unbrandedHSL.value.hue,
				validate.range
			);
			const brandedSaturation = brand.asPercentile(
				unbrandedHSL.value.saturation,
				validate.range
			);
			const brandedLightness = brand.asPercentile(
				unbrandedHSL.value.lightness,
				validate.range
			);

			return {
				value: {
					hue: brandedHue,
					saturation: brandedSaturation,
					lightness: brandedLightness
				},
				format: 'hsl'
			};
	}
}

async function colorToCSS(color: Color): Promise<string> {
	try {
		switch (color.format) {
			case 'cmyk':
				return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key}`;
			case 'hex':
				return String(color.value.hex);
			case 'hsl':
				return `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%`;
			case 'hsv':
				return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%`;
			case 'lab':
				return `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
			case 'rgb':
				return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
			case 'xyz':
				return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z}`;
			default:
				console.error(`Unexpected color format: ${color.format}`);

				return '#FFFFFF';
		}
	} catch (error) {
		throw new Error(`getCSSColorString error: ${error}`);
	}
}

function hexStringToValue(hex: Hex_StringProps['value']): Hex['value'] {
	return { hex: brand.asHexSet(hex.hex, validate.hexSet) };
}

function hexValueToString(hex: Hex['value']): Hex_StringProps['value'] {
	return { hex: hex.hex };
}

function hslStringToValue(hsl: HSL_StringProps['value']): HSL['value'] {
	return {
		hue: brand.asRadial(parseFloat(hsl.hue), validate.range),
		saturation: brand.asPercentile(
			parseFloat(hsl.saturation) / 100,
			validate.range
		),
		lightness: brand.asPercentile(
			parseFloat(hsl.lightness) / 100,
			validate.range
		)
	};
}

function hslValueToString(hsl: HSL['value']): HSL_StringProps['value'] {
	return {
		hue: `${hsl.hue}°`,
		saturation: `${hsl.saturation * 100}%`,
		lightness: `${hsl.lightness * 100}%`
	};
}

function hsvStringToValue(hsv: HSV_StringProps['value']): HSV['value'] {
	return {
		hue: brand.asRadial(parseFloat(hsv.hue), validate.range),
		saturation: brand.asPercentile(
			parseFloat(hsv.saturation) / 100,
			validate.range
		),
		value: brand.asPercentile(parseFloat(hsv.value) / 100, validate.range)
	};
}

function hsvValueToString(hsv: HSV['value']): HSV_StringProps['value'] {
	return {
		hue: `${hsv.hue}°`,
		saturation: `${hsv.saturation * 100}%`,
		value: `${hsv.value * 100}%`
	};
}

function labValueToString(lab: LAB['value']): LAB_StringProps['value'] {
	return {
		l: `${lab.l}`,
		a: `${lab.a}`,
		b: `${lab.b}`
	};
}

function labStringToValue(lab: LAB_StringProps['value']): LAB['value'] {
	return {
		l: brand.asLAB_L(parseFloat(lab.l), validate.range),
		a: brand.asLAB_A(parseFloat(lab.a), validate.range),
		b: brand.asLAB_B(parseFloat(lab.b), validate.range)
	};
}

function rgbValueToString(rgb: RGB['value']): RGB_StringProps['value'] {
	return {
		red: `${rgb.red}`,
		green: `${rgb.green}`,
		blue: `${rgb.blue}`
	};
}

function rgbStringToValue(rgb: RGB_StringProps['value']): RGB['value'] {
	return {
		red: brand.asByteRange(parseFloat(rgb.red), validate.range),
		green: brand.asByteRange(parseFloat(rgb.green), validate.range),
		blue: brand.asByteRange(parseFloat(rgb.blue), validate.range)
	};
}

function xyzValueToString(xyz: XYZ['value']): XYZ_StringProps['value'] {
	return {
		x: `${xyz.x}`,
		y: `${xyz.y}`,
		z: `${xyz.z}`
	};
}

function xyzStringToValue(xyz: XYZ_StringProps['value']): XYZ['value'] {
	return {
		x: brand.asXYZ_X(parseFloat(xyz.x), validate.range),
		y: brand.asXYZ_Y(parseFloat(xyz.y), validate.range),
		z: brand.asXYZ_Z(parseFloat(xyz.z), validate.range)
	};
}

function toColorValueRange<T extends keyof RangeKeyMap>(
	value: string | number,
	rangeKey: T,
	brand: BrandFunctions,
	validate: ValidateFunctions
): RangeKeyMap[T] {
	validate.range(value, rangeKey);

	if (rangeKey === 'HexSet') {
		return brand.asHexSet(value as string) as unknown as RangeKeyMap[T];
	}

	return brand.asBranded(value as number, rangeKey);
}

function hslTo(color: HSL, colorSpace: ColorSpaceExtended): Color {
	const thisMethod = 'hslTo()';

	try {
		if (!validate.colorValue(color)) {
			logger.error(
				`Invalid color value ${JSON.stringify(color)}`,
				`conversionUtils > ${thisMethod}`
			);

			return initializeDefaultColors().hsl as Color;
		}

		const clonedColor = coreUtils.base.clone(color) as HSL;

		switch (colorSpace) {
			case 'cmyk':
				return hslToCMYK(clonedColor);
			case 'hex':
				return hslToHex(clonedColor);
			case 'hsl':
				return coreUtils.base.clone(clonedColor);
			case 'hsv':
				return hslToHSV(clonedColor);
			case 'lab':
				return hslToLAB(clonedColor);
			case 'rgb':
				return hslToRGB(clonedColor);
			case 'sl':
				return hslToSL(clonedColor);
			case 'sv':
				return hslToSV(clonedColor);
			case 'xyz':
				return hslToXYZ(clonedColor);
			default:
				throw new Error('Invalid color format');
		}
	} catch (error) {
		throw new Error(`hslTo() error: ${error}`);
	}
}

function toHSL(color: Exclude<Color, SL | SV>): HSL {
	const thisMethod = 'toHSL()';

	try {
		if (!validate.colorValue(color)) {
			logger.error(
				`Invalid color value ${JSON.stringify(color)}`,
				`conversionUtils > ${thisMethod}`
			);

			return initializeDefaultColors().hsl as HSL;
		}

		const clonedColor = coreUtils.base.clone(color);

		switch (color.format) {
			case 'cmyk':
				return cmykToHSL(clonedColor as CMYK, validate.range);
			case 'hex':
				return hexToHSL(clonedColor as Hex);
			case 'hsl':
				return coreUtils.base.clone(clonedColor as HSL);
			case 'hsv':
				return hsvToHSL(clonedColor as HSV);
			case 'lab':
				return labToHSL(clonedColor as LAB);
			case 'rgb':
				return rgbToHSL(clonedColor as RGB);
			case 'xyz':
				return xyzToHSL(clonedColor as XYZ);
			default:
				throw new Error('Invalid color format');
		}
	} catch (error) {
		throw new Error(`toHSL() error: ${error}`);
	}
}

const stringToValue = {
	cmyk: cmykStringToValue,
	hex: hexStringToValue,
	hsl: hslStringToValue,
	hsv: hsvStringToValue,
	lab: labStringToValue,
	rgb: rgbStringToValue,
	xyz: xyzStringToValue
};

const valueToString = {
	cmyk: cmykValueToString,
	hex: hexValueToString,
	hsl: hslValueToString,
	hsv: hsvValueToString,
	lab: labValueToString,
	rgb: rgbValueToString,
	xyz: xyzValueToString
};

export const convert: CommonFunctionsInterface['convert'] = {
	colorToCSS,
	colorStringToColor,
	hslTo,
	stringToValue,
	toColorValueRange,
	toHSL,
	valueToString
};
