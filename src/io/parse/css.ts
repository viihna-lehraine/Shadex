// File: src/io/parse/css.ts

import {
	CMYKValueString,
	ConfigRegexInterface,
	HexValueString,
	HSLValueString,
	HSVValueString,
	LABValueString,
	PaletteItem,
	RGBValueString,
	XYZValueString
} from '../../index/index.js';
import { common } from '../../common/index.js';
import { config } from '../../config/index.js';
import { data } from '../../data/index.js';
import {
	colorString as parseColorString,
	parseAsColorValue
} from './shared/index.js';

const defaultColors = data.defaults.brandedColors;

const defaultCMYKValue = defaultColors.cmyk.value;
const defaultHexValue = defaultColors.hex.value;
const defaultHSLValue = defaultColors.hsl.value;
const defaultHSVValue = defaultColors.hsv.value;
const defaultLABValue = defaultColors.lab.value;
const defaultRGBValue = defaultColors.rgb.value;
const defaultXYZValue = defaultColors.xyz.value;

const defaultColorValues = {
	cmyk: defaultCMYKValue,
	hex: defaultHexValue,
	hsl: defaultHSLValue,
	hsv: defaultHSVValue,
	lab: defaultLABValue,
	rgb: defaultRGBValue,
	xyz: defaultXYZValue
};

const guards = common.core.guards;
const regex = config.regex;

const convertToColorString = common.utils.color.colorToColorString;
const convertToCSSColorString = common.core.convert.toCSSColorString;

function header(cssData: string): Promise<string | null> {
	// match the pattern
	const headerPattern = regex.file.palette.css.header;

	// execute the regex on the provided CSS data
	const match = cssData.match(headerPattern);

	// if a match is found, return the extracted ID; otherwise, return null
	return Promise.resolve(match ? match[1] : null);
}

function paletteItems(cssData: string): Promise<PaletteItem[]> {
	const lines = cssData.split('\n');
	const items: PaletteItem[] = [];

	let currentId = '';
	let colors: Record<string, string> = {};

	for (const line of lines) {
		const classMatch = line.match(regex.file.palette.css.class);

		if (classMatch) {
			if (currentId) {
				items.push({
					id: currentId,
					colors: {
						cmyk: guards.isColorString(colors.cmyk)
							? parseAsColorValue.cmyk(colors.cmyk)
							: defaultColorValues.cmyk,
						hex: guards.isColorString(colors.hex)
							? parseAsColorValue.hex(colors.hex)
							: defaultColorValues.hex,
						hsl: guards.isColorString(colors.hsl)
							? parseAsColorValue.hsl(colors.hsl)
							: defaultColorValues.hsl,
						hsv: guards.isColorString(colors.hsv)
							? parseAsColorValue.hsv(colors.hsv)
							: defaultColorValues.hsv,
						lab: guards.isColorString(colors.lab)
							? parseAsColorValue.lab(colors.lab)
							: defaultColorValues.lab,
						rgb: guards.isColorString(colors.rgb)
							? parseAsColorValue.rgb(colors.rgb)
							: defaultColorValues.rgb,
						xyz: guards.isColorString(colors.xyz)
							? parseAsColorValue.xyz(colors.xyz)
							: defaultColorValues.xyz
					},
					colorStrings: {
						cmykString: guards.isColorString(colors.cmyk)
							? (convertToColorString(
									parseColorString('cmyk', colors.cmyk)
								).value as CMYKValueString)
							: data.defaults.colorStrings.cmyk.value,
						hexString: guards.isColorString(colors.hex)
							? (convertToColorString(
									parseColorString('hex', colors.hex)
								).value as HexValueString)
							: data.defaults.colorStrings.hex.value,
						hslString: guards.isColorString(colors.hsl)
							? (convertToColorString(
									parseColorString('hsl', colors.hsl)
								).value as HSLValueString)
							: data.defaults.colorStrings.hsl.value,
						hsvString: guards.isColorString(colors.hsv)
							? (convertToColorString(
									parseColorString('hsv', colors.hsv)
								).value as HSVValueString)
							: data.defaults.colorStrings.hsv.value,
						labString: guards.isColorString(colors.lab)
							? (convertToColorString(
									parseColorString('lab', colors.lab)
								).value as LABValueString)
							: data.defaults.colorStrings.lab.value,
						rgbString: guards.isColorString(colors.rgb)
							? (convertToColorString(
									parseColorString('rgb', colors.rgb)
								).value as RGBValueString)
							: data.defaults.colorStrings.rgb.value,
						xyzString: guards.isColorString(colors.xyz)
							? (convertToColorString(
									parseColorString('xyz', colors.xyz)
								).value as XYZValueString as XYZValueString)
							: data.defaults.colorStrings.xyz.value
					},
					cssStrings: {
						cmykCSSString: guards.isColorString(colors.cmyk)
							? convertToCSSColorString(
									parseColorString('cmyk', colors.cmyk)
								)
							: 'cmyk(0%, 0%, 0%, 0%)',
						hexCSSString: guards.isColorString(colors.hex)
							? convertToCSSColorString(
									parseColorString('hex', colors.hex)
								)
							: '#000000',
						hslCSSString: guards.isColorString(colors.hsl)
							? convertToCSSColorString(
									parseColorString('hsl', colors.hsl)
								)
							: 'hsl(0, 0%, 0%)',
						hsvCSSString: guards.isColorString(colors.hsv)
							? convertToCSSColorString(
									parseColorString('hsv', colors.hsv)
								)
							: 'hsv(0, 0%, 0%)',
						labCSSString: guards.isColorString(colors.lab)
							? convertToCSSColorString(
									parseColorString('lab', colors.lab)
								)
							: 'lab(0, 0, 0)',
						rgbCSSString: guards.isColorString(colors.rgb)
							? convertToCSSColorString(
									parseColorString('rgb', colors.rgb)
								)
							: 'rgb(0, 0, 0)',
						xyzCSSString: guards.isColorString(colors.xyz)
							? convertToCSSColorString(
									parseColorString('xyz', colors.xyz)
								)
							: 'xyz(0, 0, 0)'
					}
				});

				colors = {}; // reset for the next item
			}

			currentId = classMatch[1]; // update the current ID
		}

		const propertyMatch = line.match(regex.file.palette.css.colorProperty);
		if (propertyMatch) {
			const [, key, value] = propertyMatch;
			colors[key.replace('-color', '')] = value.trim();
		}
	}

	if (currentId) {
		items.push({
			id: currentId,
			colors: {
				cmyk: guards.isColorString(colors.cmyk)
					? parseAsColorValue.cmyk(colors.cmyk)
					: defaultColorValues.cmyk,
				hex: guards.isColorString(colors.hex)
					? parseAsColorValue.hex(colors.hex)
					: defaultColorValues.hex,
				hsl: guards.isColorString(colors.hsl)
					? parseAsColorValue.hsl(colors.hsl)
					: defaultColorValues.hsl,
				hsv: guards.isColorString(colors.hsv)
					? parseAsColorValue.hsv(colors.hsv)
					: defaultColorValues.hsv,
				lab: guards.isColorString(colors.lab)
					? parseAsColorValue.lab(colors.lab)
					: defaultColorValues.lab,
				rgb: guards.isColorString(colors.rgb)
					? parseAsColorValue.rgb(colors.rgb)
					: defaultColorValues.rgb,
				xyz: guards.isColorString(colors.xyz)
					? parseAsColorValue.xyz(colors.xyz)
					: defaultColorValues.xyz
			},
			colorStrings: {
				cmykString: guards.isColorString(colors.cmyk)
					? (convertToColorString(
							parseColorString('cmyk', colors.cmyk)
						).value as CMYKValueString)
					: data.defaults.colorStrings.cmyk.value,
				hexString: guards.isColorString(colors.hex)
					? (convertToColorString(parseColorString('hex', colors.hex))
							.value as HexValueString)
					: data.defaults.colorStrings.hex.value,
				hslString: guards.isColorString(colors.hsl)
					? (convertToColorString(parseColorString('hsl', colors.hsl))
							.value as HSLValueString)
					: data.defaults.colorStrings.hsl.value,
				hsvString: guards.isColorString(colors.hsv)
					? (convertToColorString(parseColorString('hsv', colors.hsv))
							.value as HSVValueString)
					: data.defaults.colorStrings.hsv.value,
				labString: guards.isColorString(colors.lab)
					? (convertToColorString(parseColorString('lab', colors.lab))
							.value as LABValueString)
					: data.defaults.colorStrings.lab.value,
				rgbString: guards.isColorString(colors.rgb)
					? (convertToColorString(parseColorString('rgb', colors.rgb))
							.value as RGBValueString)
					: data.defaults.colorStrings.rgb.value,
				xyzString: guards.isColorString(colors.xyz)
					? (convertToColorString(parseColorString('xyz', colors.xyz))
							.value as XYZValueString)
					: data.defaults.colorStrings.xyz.value
			},
			cssStrings: {
				cmykCSSString: guards.isColorString(colors.cmyk)
					? convertToCSSColorString(
							parseColorString('cmyk', colors.cmyk)
						)
					: 'cmyk(0%, 0%, 0%, 0%)',
				hexCSSString: guards.isColorString(colors.hex)
					? convertToCSSColorString(
							parseColorString('hex', colors.hex)
						)
					: '#000000',
				hslCSSString: guards.isColorString(colors.hsl)
					? convertToCSSColorString(
							parseColorString('hsl', colors.hsl)
						)
					: 'hsl(0, 0%, 0%)',
				hsvCSSString: guards.isColorString(colors.hsv)
					? convertToCSSColorString(
							parseColorString('hsv', colors.hsv)
						)
					: 'hsv(0, 0%, 0%)',
				labCSSString: guards.isColorString(colors.lab)
					? convertToCSSColorString(
							parseColorString('lab', colors.lab)
						)
					: 'lab(0, 0, 0)',
				rgbCSSString: guards.isColorString(colors.rgb)
					? convertToCSSColorString(
							parseColorString('rgb', colors.rgb)
						)
					: 'rgb(0, 0, 0)',
				xyzCSSString: guards.isColorString(colors.xyz)
					? convertToCSSColorString(
							parseColorString('xyz', colors.xyz)
						)
					: 'xyz(0, 0, 0)'
			}
		});

		colors = {}; // reset for the next item
	}

	return Promise.resolve(items);
}

function settings(data: string): Promise<{
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
} | void> {
	// define regex patterns for the settings
	const settingsPatterns: ConfigRegexInterface['file']['palette']['css']['settings'] =
		{
			enableAlpha: regex.file.palette.css.settings.enableAlpha,
			limitDarkness: regex.file.palette.css.settings.limitDarkness,
			limitGrayness: regex.file.palette.css.settings.limitGrayness,
			limitLightness: regex.file.palette.css.settings.limitLightness
		};

	// initialize default values
	const settings = {
		enableAlpha: false,
		limitDarkness: false,
		limitGrayness: false,
		limitLightness: false
	};

	// iterate through each setting and parse its value
	for (const [key, pattern] of Object.entries(settingsPatterns)) {
		const match = data.match(pattern);
		if (match) {
			// convert 'TRUE'/'FALSE' (case-insensitive) to boolean
			settings[key as keyof typeof settings] =
				match[1].toUpperCase() === 'TRUE';
		}
	}

	return Promise.resolve(settings);
}

export const css = {
	header,
	settings,
	paletteItems
};
