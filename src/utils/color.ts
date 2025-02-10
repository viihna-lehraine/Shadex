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
	DataSetsInterface,
	DefaultDataInterface,
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
	TypeGuardUtilsInteface,
	ValidationUtilsInterface,
	XYZ,
	XYZ_StringProps,
	ConfigDataInterface
} from '../types/index.js';

function convertCMYKStringToValue(
	cmyk: CMYK_StringProps['value'],
	brand: BrandingUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): CMYK['value'] {
	return {
		cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100, sets, validate),
		magenta: brand.asPercentile(
			parseFloat(cmyk.magenta) / 100,
			sets,
			validate
		),
		yellow: brand.asPercentile(
			parseFloat(cmyk.yellow) / 100,
			sets,
			validate
		),
		key: brand.asPercentile(parseFloat(cmyk.key) / 100, sets, validate)
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
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	sets: DataSetsInterface,
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

			const brandedHue = brand.asRadial(
				unbrandedHSL.value.hue,
				sets,
				validate
			);
			const brandedSaturation = brand.asPercentile(
				unbrandedHSL.value.saturation,
				sets,
				validate
			);
			const brandedLightness = brand.asPercentile(
				unbrandedHSL.value.lightness,
				sets,
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
	coreUtils: CoreUtilsInterface,
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	formattingUtils: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	typeGuards: TypeGuardUtilsInteface
): Color_StringProps {
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

function convertHexStringToValue(
	hex: Hex_StringProps['value'],
	brand: BrandingUtilsInterface,
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): Hex['value'] {
	return { hex: brand.asHexSet(hex.hex, regex, validate) };
}

function convertHexValueToString(hex: Hex['value']): Hex_StringProps['value'] {
	return { hex: hex.hex };
}

function convertHSL(
	color: HSL,
	colorSpace: ColorSpaceExtended,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): Color {
	try {
		if (!validate.colorValue(color, coreUtils, regex)) {
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
					brand,
					colorUtils,
					coreUtils,
					log,
					regex,
					sanitize,
					sets,
					validate
				);
			case 'hex':
				return colorHelpers.hslToHex(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					format,
					log,
					regex,
					sets,
					validate
				);
			case 'hsl':
				return coreUtils.clone(clonedColor);
			case 'hsv':
				return colorHelpers.hslToHSV(
					clonedColor,
					brand,
					coreUtils,
					log,
					regex,
					sets,
					validate
				);
			case 'lab':
				return colorHelpers.hslToLAB(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					log,
					regex,
					sanitize,
					sets,
					validate
				);
			case 'rgb':
				return colorHelpers.hslToRGB(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					log,
					regex,
					sets,
					validate
				);
			case 'sl':
				return colorHelpers.hslToSL(
					clonedColor,
					coreUtils,
					log,
					regex,
					validate
				);
			case 'sv':
				return colorHelpers.hslToSV(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					log,
					regex,
					sets,
					validate
				);
			case 'xyz':
				return colorHelpers.hslToXYZ(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					log,
					regex,
					sanitize,
					sets,
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
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL['value'] {
	return {
		hue: brand.asRadial(parseFloat(hsl.hue), sets, validate),
		saturation: brand.asPercentile(
			parseFloat(hsl.saturation) / 100,
			sets,
			validate
		),
		lightness: brand.asPercentile(
			parseFloat(hsl.lightness) / 100,
			sets,
			validate
		)
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
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSV['value'] {
	return {
		hue: brand.asRadial(parseFloat(hsv.hue), sets, validate),
		saturation: brand.asPercentile(
			parseFloat(hsv.saturation) / 100,
			sets,
			validate
		),
		value: brand.asPercentile(parseFloat(hsv.value) / 100, sets, validate)
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
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): LAB['value'] {
	return {
		l: brand.asLAB_L(parseFloat(lab.l), sets, validate),
		a: brand.asLAB_A(parseFloat(lab.a), sets, validate),
		b: brand.asLAB_B(parseFloat(lab.b), sets, validate)
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
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RGB['value'] {
	return {
		red: brand.asByteRange(parseFloat(rgb.red), sets, validate),
		green: brand.asByteRange(parseFloat(rgb.green), sets, validate),
		blue: brand.asByteRange(parseFloat(rgb.blue), sets, validate)
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
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(color, coreUtils, regex)) {
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
					brand,
					coreUtils,
					defaultColors,
					log,
					regex,
					sets,
					validate
				);
			case 'hex':
				return colorHelpers.hexToHSL(
					clonedColor as Hex,
					brand,
					coreUtils,
					defaultColors,
					format,
					log,
					regex,
					sets,
					validate
				);
			case 'hsl':
				return coreUtils.clone(clonedColor as HSL);
			case 'hsv':
				return colorHelpers.hsvToHSL(
					clonedColor as HSV,
					brand,
					coreUtils,
					log,
					regex,
					sets,
					validate
				);
			case 'lab':
				return colorHelpers.labToHSL(
					clonedColor as LAB,
					adjust,
					brand,
					coreUtils,
					defaultColors,
					log,
					regex,
					sets,
					validate
				);
			case 'rgb':
				return colorHelpers.rgbToHSL(
					clonedColor as RGB,
					brand,
					coreUtils,
					log,
					regex,
					sets,
					validate
				);
			case 'xyz':
				return colorHelpers.xyzToHSL(
					clonedColor as XYZ,
					adjust,
					brand,
					coreUtils,
					defaultColors,
					log,
					regex,
					sets,
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
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): XYZ['value'] {
	return {
		x: brand.asXYZ_X(parseFloat(xyz.x), sets, validate),
		y: brand.asXYZ_Y(parseFloat(xyz.y), sets, validate),
		z: brand.asXYZ_Z(parseFloat(xyz.z), sets, validate)
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
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Color | null {
	if (typeGuards.isColorString(color)) {
		return convertColorStringToColor(
			color,
			brand,
			coreUtils,
			defaultColors,
			sets,
			validate
		);
	}

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
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RangeKeyMap[T] {
	validate.range(value, rangeKey, sets);

	if (rangeKey === 'HexSet') {
		return brand.asHexSet(
			value as string,
			regex,
			validate
		) as unknown as RangeKeyMap[T];
	}

	return brand.asBranded(value as number, rangeKey, sets, validate);
}

function validateAndConvertColor(
	color: Color | Color_StringProps | null,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Color | null {
	if (!color) return null;

	const convertedColor = typeGuards.isColorString(color)
		? convertColorStringToColor(
				color,
				brand,
				coreUtils,
				defaultColors,
				sets,
				validate
			)
		: color;

	if (!validate.colorValue(convertedColor, coreUtils, regex)) {
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
