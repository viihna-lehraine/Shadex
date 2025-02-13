// File: utils/color.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	CMYK,
	CMYK_StringProps,
	Color,
	ColorDataAssertion,
	ColorSpaceExtended,
	Color_StringProps,
	ColorUtilsInterface,
	ColorUtilHelpersInterface,
	CoreUtilsInterface,
	FormattingUtilsInterface,
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
	SanitationUtilsInterface,
	SL,
	SV,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface,
	XYZ,
	XYZ_StringProps
} from '../types/index.js';
import { configData as config } from '../data/config.js';
import { defaultData as defaults } from '../data/defaults.js';

const defaultColors = defaults.colors;
const defaultColorStrings = defaults.colors.strings;

function convertCMYKStringToValue(
	cmyk: CMYK_StringProps['value'],
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): CMYK['value'] {
	return {
		cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100, validate),
		magenta: brand.asPercentile(parseFloat(cmyk.magenta) / 100, validate),
		yellow: brand.asPercentile(parseFloat(cmyk.yellow) / 100, validate),
		key: brand.asPercentile(parseFloat(cmyk.key) / 100, validate)
	};
}

function convertCMYKValueToString(
	cmyk: CMYK['value']
): CMYK_StringProps['value'] {
	return {
		cyan: `${cmyk.cyan * 100}%`,
		magenta: `${cmyk.magenta * 100}%`,
		yellow: `${cmyk.yellow * 100}%`,
		key: `${cmyk.key * 100}%`
	};
}

function convertColorStringToColor(
	colorString: Color_StringProps,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): Color {
	const clonedColor = coreUtils.clone(colorString);

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

			const unbrandedHSL = defaultColors.hsl;

			const brandedHue = brand.asRadial(unbrandedHSL.value.hue, validate);
			const brandedSaturation = brand.asPercentile(
				unbrandedHSL.value.saturation,
				validate
			);
			const brandedLightness = brand.asPercentile(
				unbrandedHSL.value.lightness,
				validate
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

function convertColorToColorString(
	color: Color,
	appServices: AppServicesInterface,
	coreUtils: CoreUtilsInterface,
	formattingUtils: FormattingUtilsInterface,
	typeGuards: TypeGuardUtilsInterface
): Color_StringProps {
	const log = appServices.log;
	const clonedColor = coreUtils.clone(color);

	if (typeGuards.isColorString(clonedColor)) {
		log(
			'error',
			`Already formatted as color string: ${JSON.stringify(color)}`,
			'colorUtils.convertColorToColorString()'
		);

		return clonedColor;
	}

	if (typeGuards.isCMYKColor(clonedColor)) {
		const newValue = formattingUtils.formatPercentageValues(
			clonedColor.value
		) as CMYK['value'];

		return {
			format: 'cmyk',
			value: {
				cyan: `${newValue.cyan}%`,
				magenta: `${newValue.magenta}%`,
				yellow: `${newValue.yellow}%`,
				key: `${newValue.key}%`
			} as CMYK_StringProps['value']
		};
	} else if (typeGuards.isHex(clonedColor)) {
		const newValue = formattingUtils.formatPercentageValues(
			(clonedColor as Hex).value
		) as Hex['value'];

		return {
			format: 'hex',
			value: {
				hex: `${newValue.hex}`
			} as Hex_StringProps['value']
		};
	} else if (typeGuards.isHSLColor(clonedColor)) {
		const newValue = formattingUtils.formatPercentageValues(
			clonedColor.value
		) as HSL['value'];

		return {
			format: 'hsl',
			value: {
				hue: `${newValue.hue}`,
				saturation: `${newValue.saturation}%`,
				lightness: `${newValue.lightness}%`
			} as HSL_StringProps['value']
		};
	} else if (typeGuards.isHSVColor(clonedColor)) {
		const newValue = formattingUtils.formatPercentageValues(
			clonedColor.value
		) as HSV['value'];

		return {
			format: 'hsv',
			value: {
				hue: `${newValue.hue}`,
				saturation: `${newValue.saturation}%`,
				value: `${newValue.value}%`
			} as HSV_StringProps['value']
		};
	} else if (typeGuards.isLAB(clonedColor)) {
		const newValue = formattingUtils.formatPercentageValues(
			clonedColor.value
		) as LAB['value'];

		return {
			format: 'lab',
			value: {
				l: `${newValue.l}`,
				a: `${newValue.a}`,
				b: `${newValue.b}`
			} as LAB_StringProps['value']
		};
	} else if (typeGuards.isRGB(clonedColor)) {
		const newValue = formattingUtils.formatPercentageValues(
			clonedColor.value
		) as RGB['value'];

		return {
			format: 'rgb',
			value: {
				red: `${newValue.red}`,
				green: `${newValue.green}`,
				blue: `${newValue.blue}`
			} as RGB_StringProps['value']
		};
	} else if (typeGuards.isXYZ(clonedColor)) {
		const newValue = formattingUtils.formatPercentageValues(
			clonedColor.value
		) as XYZ['value'];

		return {
			format: 'xyz',
			value: {
				x: `${newValue.x}`,
				y: `${newValue.y}`,
				z: `${newValue.z}`
			} as XYZ_StringProps['value']
		};
	} else {
		log(
			'error',
			`Unsupported format: ${clonedColor.format}`,
			'colorUtils.convertColorToColorString()'
		);

		return defaultColorStrings.hsl;
	}
}

function convertColorToCSS(color: Color): string {
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

function convertCSSToColor(
	color: string,
	format: FormattingUtilsInterface
): Exclude<Color, SL | SV> | null {
	color = color.trim().toLowerCase();

	const cmykMatch = color.match(config.regex.css.cmyk);
	const hslMatch = color.match(config.regex.css.hsl);
	const hsvMatch = color.match(config.regex.css.hsv);
	const labMatch = color.match(config.regex.css.lab);
	const rgbMatch = color.match(config.regex.css.rgb);
	const xyzMatch = color.match(config.regex.css.xyz);

	if (cmykMatch) {
		return {
			value: {
				cyan: parseInt(cmykMatch[1], 10),
				magenta: parseInt(cmykMatch[2], 10),
				yellow: parseInt(cmykMatch[3], 10),
				key: parseInt(cmykMatch[4], 10)
			},
			format: 'cmyk'
		} as CMYK;
	}

	if (color.startsWith('#')) {
		const hexValue =
			color.length === 7 ? color : format.convertShortHexToLong(color);
		return {
			value: { hex: hexValue },
			format: 'hex'
		} as Hex;
	}

	if (hslMatch) {
		return {
			value: {
				hue: parseInt(hslMatch[1], 10),
				saturation: parseInt(hslMatch[2], 10),
				lightness: parseInt(hslMatch[3], 10)
			},
			format: 'hsl'
		} as HSL;
	}

	if (hsvMatch) {
		return {
			value: {
				hue: parseInt(hsvMatch[1], 10),
				saturation: parseInt(hsvMatch[2], 10),
				value: parseInt(hsvMatch[3], 10)
			},
			format: 'hsv'
		} as HSV;
	}

	if (labMatch) {
		return {
			value: {
				l: parseFloat(labMatch[1]),
				a: parseFloat(labMatch[2]),
				b: parseFloat(labMatch[3])
			},
			format: 'lab'
		} as LAB;
	}

	if (rgbMatch) {
		return {
			value: {
				red: parseInt(rgbMatch[1], 10),
				green: parseInt(rgbMatch[2], 10),
				blue: parseInt(rgbMatch[3], 10)
			},
			format: 'rgb'
		} as RGB;
	}

	if (xyzMatch) {
		return {
			value: {
				x: parseFloat(xyzMatch[1]),
				y: parseFloat(xyzMatch[2]),
				z: parseFloat(xyzMatch[3])
			},
			format: 'xyz'
		} as XYZ;
	}

	return null;
}

function convertHexStringToValue(
	hex: Hex_StringProps['value'],
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): Hex['value'] {
	return { hex: brand.asHexSet(hex.hex, validate) };
}

function convertHexValueToString(hex: Hex['value']): Hex_StringProps['value'] {
	return { hex: hex.hex };
}

function convertHSL(
	color: HSL,
	colorSpace: ColorSpaceExtended,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	sanitize: SanitationUtilsInterface,
	validate: ValidationUtilsInterface
): Color {
	const log = appServices.log;

	try {
		if (!validate.colorValue(color, coreUtils)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(color)}`,
				'colorUtils.convertHSL()'
			);

			return defaultColors.hsl;
		}

		const clonedColor = coreUtils.clone(color) as HSL;

		switch (colorSpace) {
			case 'cmyk':
				return colorHelpers.hslToCMYK(
					clonedColor,
					appServices,
					brand,
					colorUtils,
					coreUtils,
					sanitize,
					validate
				);
			case 'hex':
				return colorHelpers.hslToHex(
					clonedColor,
					appServices,
					brand,
					colorUtils,
					coreUtils,
					format,
					validate
				);
			case 'hsl':
				return coreUtils.clone(clonedColor);
			case 'hsv':
				return colorHelpers.hslToHSV(
					clonedColor,
					appServices,
					brand,
					coreUtils,
					validate
				);
			case 'lab':
				return colorHelpers.hslToLAB(
					clonedColor,
					appServices,
					brand,
					colorUtils,
					coreUtils,
					sanitize,
					validate
				);
			case 'rgb':
				return colorHelpers.hslToRGB(
					clonedColor,
					appServices,
					brand,
					colorUtils,
					coreUtils,
					validate
				);
			case 'sl':
				return colorHelpers.hslToSL(
					clonedColor,
					appServices,
					coreUtils,
					validate
				);
			case 'sv':
				return colorHelpers.hslToSV(
					clonedColor,
					appServices,
					brand,
					colorUtils,
					coreUtils,
					validate
				);
			case 'xyz':
				return colorHelpers.hslToXYZ(
					clonedColor,
					appServices,
					brand,
					colorUtils,
					coreUtils,
					sanitize,
					validate
				);
			default:
				throw new Error('Invalid color format');
		}
	} catch (error) {
		throw new Error(`hslTo() error: ${error}`);
	}
}

function convertHSLStringToValue(
	hsl: HSL_StringProps['value'],
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): HSL['value'] {
	return {
		hue: brand.asRadial(parseFloat(hsl.hue), validate),
		saturation: brand.asPercentile(
			parseFloat(hsl.saturation) / 100,
			validate
		),
		lightness: brand.asPercentile(parseFloat(hsl.lightness) / 100, validate)
	};
}

function convertHSLValueToString(hsl: HSL['value']): HSL_StringProps['value'] {
	return {
		hue: `${hsl.hue}°`,
		saturation: `${hsl.saturation * 100}%`,
		lightness: `${hsl.lightness * 100}%`
	};
}

function convertHSVStringToValue(
	hsv: HSV_StringProps['value'],
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): HSV['value'] {
	return {
		hue: brand.asRadial(parseFloat(hsv.hue), validate),
		saturation: brand.asPercentile(
			parseFloat(hsv.saturation) / 100,
			validate
		),
		value: brand.asPercentile(parseFloat(hsv.value) / 100, validate)
	};
}

function convertHSVValueToString(hsv: HSV['value']): HSV_StringProps['value'] {
	return {
		hue: `${hsv.hue}°`,
		saturation: `${hsv.saturation * 100}%`,
		value: `${hsv.value * 100}%`
	};
}

function convertLABStringToValue(
	lab: LAB_StringProps['value'],
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): LAB['value'] {
	return {
		l: brand.asLAB_L(parseFloat(lab.l), validate),
		a: brand.asLAB_A(parseFloat(lab.a), validate),
		b: brand.asLAB_B(parseFloat(lab.b), validate)
	};
}

function convertLABValueToString(lab: LAB['value']): LAB_StringProps['value'] {
	return {
		l: `${lab.l}`,
		a: `${lab.a}`,
		b: `${lab.b}`
	};
}

function convertRGBStringToValue(
	rgb: RGB_StringProps['value'],
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): RGB['value'] {
	return {
		red: brand.asByteRange(parseFloat(rgb.red), validate),
		green: brand.asByteRange(parseFloat(rgb.green), validate),
		blue: brand.asByteRange(parseFloat(rgb.blue), validate)
	};
}

function convertRGBValueToString(rgb: RGB['value']): RGB_StringProps['value'] {
	return {
		red: `${rgb.red}`,
		green: `${rgb.green}`,
		blue: `${rgb.blue}`
	};
}

function convertToHSL(
	color: Exclude<Color, SL | SV>,
	adjust: AdjustmentUtilsInterface,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	validate: ValidationUtilsInterface
): HSL {
	const log = appServices.log;

	try {
		if (!validate.colorValue(color, coreUtils)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(color)}`,
				'colorUtils.convertToHSL()'
			);

			return defaultColors.hsl as HSL;
		}

		const clonedColor = coreUtils.clone(color);

		switch (color.format) {
			case 'cmyk':
				return colorHelpers.cmykToHSL(
					clonedColor as CMYK,
					adjust,
					appServices,
					brand,
					coreUtils,
					validate
				);
			case 'hex':
				return colorHelpers.hexToHSL(
					clonedColor as Hex,
					appServices,
					brand,
					coreUtils,
					format,
					validate
				);
			case 'hsl':
				return coreUtils.clone(clonedColor as HSL);
			case 'hsv':
				return colorHelpers.hsvToHSL(
					clonedColor as HSV,
					appServices,
					brand,
					coreUtils,
					validate
				);
			case 'lab':
				return colorHelpers.labToHSL(
					clonedColor as LAB,
					adjust,
					appServices,
					brand,
					coreUtils,
					validate
				);
			case 'rgb':
				return colorHelpers.rgbToHSL(
					clonedColor as RGB,
					appServices,
					brand,
					coreUtils,
					validate
				);
			case 'xyz':
				return colorHelpers.xyzToHSL(
					clonedColor as XYZ,
					adjust,
					appServices,
					brand,
					coreUtils,
					validate
				);
			default:
				throw new Error('Invalid color format');
		}
	} catch (error) {
		throw new Error(`toHSL() error: ${error}`);
	}
}

function convertXYZStringToValue(
	xyz: XYZ_StringProps['value'],
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): XYZ['value'] {
	return {
		x: brand.asXYZ_X(parseFloat(xyz.x), validate),
		y: brand.asXYZ_Y(parseFloat(xyz.y), validate),
		z: brand.asXYZ_Z(parseFloat(xyz.z), validate)
	};
}

function convertXYZValueToString(xyz: XYZ['value']): XYZ_StringProps['value'] {
	return {
		x: `${xyz.x}`,
		y: `${xyz.y}`,
		z: `${xyz.z}`
	};
}

function getColorString(
	color: Color,
	log: AppServicesInterface['log']
): string | null {
	try {
		const formatters = {
			cmyk: (c: CMYK) =>
				`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
			hex: (c: Hex) => c.value.hex,
			hsl: (c: HSL) =>
				`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
			hsv: (c: HSV) =>
				`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
			lab: (c: LAB) => `lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
			rgb: (c: RGB) =>
				`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
			xyz: (c: XYZ) => `xyz(${c.value.x}, ${c.value.y}, ${c.value.z})`
		};

		switch (color.format) {
			case 'cmyk':
				return formatters.cmyk(color);
			case 'hex':
				return formatters.hex(color);
			case 'hsl':
				return formatters.hsl(color);
			case 'hsv':
				return formatters.hsv(color);
			case 'lab':
				return formatters.lab(color);
			case 'rgb':
				return formatters.rgb(color);
			case 'xyz':
				return formatters.xyz(color);
			default:
				log(
					'error',
					`Unsupported color format for ${color}`,
					'colorUtils.getColorString()'
				);

				return null;
		}
	} catch (error) {
		log(
			'error',
			`getColorString error: ${error}`,
			'colorUtils.getColorString()'
		);

		return null;
	}
}

function getConversionFn<
	From extends keyof ColorDataAssertion,
	To extends keyof ColorDataAssertion
>(
	from: From,
	to: To,
	conversionUtils: ColorUtilHelpersInterface,
	log: AppServicesInterface['log']
): ((value: ColorDataAssertion[From]) => ColorDataAssertion[To]) | undefined {
	try {
		const fnName =
			`${from}To${to[0].toUpperCase() + to.slice(1)}` as keyof typeof conversionUtils;

		if (!(fnName in conversionUtils)) return undefined;

		const conversionFn = conversionUtils[fnName] as unknown as (
			input: ColorDataAssertion[From]
		) => ColorDataAssertion[To];

		return (value: ColorDataAssertion[From]): ColorDataAssertion[To] =>
			structuredClone(conversionFn(value));
	} catch (error) {
		log(
			'error',
			`Error getting conversion function: ${error}`,
			'colorUtils.getConversionFn()'
		);

		return undefined;
	}
}

export function hueToRGB(
	p: number,
	q: number,
	t: number,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log']
): number {
	try {
		const clonedP = coreUtils.clone(p);
		const clonedQ = coreUtils.clone(q);

		let clonedT = coreUtils.clone(t);

		if (clonedT < 0) clonedT += 1;
		if (clonedT > 1) clonedT -= 1;
		if (clonedT < 1 / 6) return clonedP + (clonedQ - clonedP) * 6 * clonedT;
		if (clonedT < 1 / 2) return clonedQ;
		if (clonedT < 2 / 3)
			return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;

		return clonedP;
	} catch (error) {
		log(
			'error',
			`Error converting hue to RGB: ${error}`,
			'colorUtils.hueToRGB()'
		);

		return 0;
	}
}

function narrowToColor(
	color: Color | Color_StringProps,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
): Color | null {
	if (typeGuards.isColorString(color))
		return convertColorStringToColor(color, brand, coreUtils, validate);

	switch (color.format as ColorSpaceExtended) {
		case 'cmyk':
		case 'hex':
		case 'hsl':
		case 'hsv':
		case 'lab':
		case 'sl':
		case 'sv':
		case 'rgb':
		case 'xyz':
			return color;
		default:
			return null;
	}
}

function toColorValueRange<T extends keyof RangeKeyMap>(
	value: string | number,
	rangeKey: T,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): RangeKeyMap[T] {
	validate.range(value, rangeKey);

	if (rangeKey === 'HexSet') {
		return brand.asHexSet(
			value as string,
			validate
		) as unknown as RangeKeyMap[T];
	}

	return brand.asBranded(value as number, rangeKey, validate);
}

function validateAndConvertColor(
	color: Color | Color_StringProps | null,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
): Color | null {
	const log = appServices.log;

	if (!color) return null;

	const convertedColor = typeGuards.isColorString(color)
		? convertColorStringToColor(color, brand, coreUtils, validate)
		: color;

	if (!validate.colorValue(convertedColor, coreUtils)) {
		log(
			'error',
			`Invalid color: ${JSON.stringify(convertedColor)}`,
			'colorUtils.validateAndConvertColor()'
		);

		return null;
	}

	return convertedColor;
}

export const colorUtils: ColorUtilsInterface = {
	convertCMYKStringToValue,
	convertCMYKValueToString,
	convertColorStringToColor,
	convertColorToColorString,
	convertColorToCSS,
	convertCSSToColor,
	convertHexStringToValue,
	convertHexValueToString,
	convertHSL,
	convertHSLStringToValue,
	convertHSLValueToString,
	convertHSVStringToValue,
	convertHSVValueToString,
	convertLABStringToValue,
	convertLABValueToString,
	convertRGBStringToValue,
	convertRGBValueToString,
	convertToHSL,
	convertXYZStringToValue,
	convertXYZValueToString,
	getColorString,
	getConversionFn,
	hueToRGB,
	narrowToColor,
	toColorValueRange,
	validateAndConvertColor
};
