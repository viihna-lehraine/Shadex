// File: utils/color.js

import {
	CMYK,
	CMYK_StringProps,
	Color,
	ColorSpaceExtended,
	Color_StringProps,
	ColorUtilsInterface,
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
	RGB,
	RGB_StringProps,
	TypeGuardUtilsInteface,
	ValidationUtilsInterface,
	XYZ,
	XYZ_StringProps,
	BrandingUtilsInterface,
	AdjustmentUtilsInterface
} from '../types/index.js';
import { appServices } from '../services/app.js';
import { colorHelpers as helpers } from './helpers/colors.js';
import { defaultData as defaults } from '../data/defaults.js';

const defaultColors = defaults.colors.base.branded;

function convertColorToColorString(
	color: Color,
	coreUtils: CoreUtilsInterface,
	formattingUtils: FormattingUtilsInterface,
	typeGuards: TypeGuardUtilsInteface
): Color_StringProps {
	const clonedColor = coreUtils.clone(color);
	const log = appServices.log;

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

		return defaults.colors.strings.hsl;
	}
}

function convertHSL(
	color: HSL,
	brand: BrandingUtilsInterface,
	colorSpace: ColorSpaceExtended,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	sanitize: SanitationUtilsInterface,
	validate: ValidationUtilsInterface
): Color {
	const log = appServices.log;

	try {
		if (!validate.colorValue(color)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(color)}`,
				'colorUtils.convertHSL()'
			);

			return defaults.colors.base.branded.hsl;
		}

		const clonedColor = coreUtils.clone(color) as HSL;

		switch (colorSpace) {
			case 'cmyk':
				return helpers.hslToCMYK(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					sanitize,
					validate
				);
			case 'hex':
				return helpers.hslToHex(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					format,
					validate
				);
			case 'hsl':
				return coreUtils.clone(clonedColor);
			case 'hsv':
				return helpers.hslToHSV(
					clonedColor,
					brand,
					coreUtils,
					validate
				);
			case 'lab':
				return helpers.hslToLAB(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					sanitize,
					validate
				);
			case 'rgb':
				return helpers.hslToRGB(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					validate
				);
			case 'sl':
				return helpers.hslToSL(clonedColor, validate);
			case 'sv':
				return helpers.hslToSV(
					clonedColor,
					brand,
					colorUtils,
					coreUtils,
					validate
				);
			case 'xyz':
				return helpers.hslToXYZ(
					clonedColor,
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

function convertToHSL(
	color: Exclude<Color, SL | SV>,
	adjust: AdjustmentUtilsInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	validate: ValidationUtilsInterface
): HSL {
	const log = appServices.log;

	try {
		if (!validate.colorValue(color)) {
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
				return helpers.cmykToHSL(
					clonedColor as CMYK,
					adjust,
					brand,
					coreUtils,
					validate
				);
			case 'hex':
				return helpers.hexToHSL(
					clonedColor as Hex,
					brand,
					coreUtils,
					format,
					validate
				);
			case 'hsl':
				return coreUtils.clone(clonedColor as HSL);
			case 'hsv':
				return helpers.hsvToHSL(
					clonedColor as HSV,
					brand,
					coreUtils,
					validate
				);
			case 'lab':
				return helpers.labToHSL(
					clonedColor as LAB,
					adjust,
					brand,
					coreUtils,
					validate
				);
			case 'rgb':
				return helpers.rgbToHSL(
					clonedColor as RGB,
					brand,
					coreUtils,
					validate
				);
			case 'xyz':
				return helpers.xyzToHSL(
					clonedColor as XYZ,
					adjust,
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

export const colorUtils = {
	convertColorToColorString,
	convertHSL,
	convertToHSL
};
