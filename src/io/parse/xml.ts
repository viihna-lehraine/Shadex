// File: src/io/parse/xml.ts

import {
	PaletteItem,
	CMYKValue,
	CMYKValueString,
	HexValue,
	HexValueString,
	HSLValue,
	HSLValueString,
	HSVValue,
	HSVValueString,
	LABValue,
	LABValueString,
	RGBValue,
	RGBValueString,
	XYZValue,
	XYZValueString
} from '../../index/index.js';
import { common } from '../../common/index.js';
import { data } from '../../data/index.js';
import { parseAsColorValue } from './shared/index.js';

const guards = common.core.guards;
const convertToColorString = common.utils.color.colorToColorString;
const convertToCSSColorString = common.core.convert.toCSSColorString;

const defaultColors = data.defaults.brandedColors;

const defaultColorValues = {
	cmyk: defaultColors.cmyk.value as CMYKValue,
	hex: defaultColors.hex.value as HexValue,
	hsl: defaultColors.hsl.value as HSLValue,
	hsv: defaultColors.hsv.value as HSVValue,
	lab: defaultColors.lab.value as LABValue,
	rgb: defaultColors.rgb.value as RGBValue,
	xyz: defaultColors.xyz.value as XYZValue
};

function flags(xmlString: string): {
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
} {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
	const parseError = xmlDoc.querySelector('parsererror');
	const paletteElement = xmlDoc.querySelector('Palette');

	if (parseError) {
		throw new Error('Invalid XML format');
	}
	if (!paletteElement) {
		throw new Error('Invalid XML format: No Palette element found.');
	}

	return {
		enableAlpha:
			paletteElement.querySelector('EnableAlpha')?.textContent === 'true',
		limitDarkness:
			paletteElement.querySelector('LimitDarkness')?.textContent ===
			'true',
		limitGrayness:
			paletteElement.querySelector('LimitGrayness')?.textContent ===
			'true',
		limitLightness:
			paletteElement.querySelector('LimitLightness')?.textContent ===
			'true'
	};
}

function paletteItems(xmlData: string): Promise<PaletteItem[]> {
	try {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
		const parseError = xmlDoc.querySelector('parsererror');

		if (parseError) {
			throw new Error('Invalid XML format');
		}

		// extract items
		const items: PaletteItem[] = Array.from(
			xmlDoc.querySelectorAll('PaletteItem')
		).map(item => {
			const id = item.getAttribute('id') || 'unknown';

			// parse each color property
			const colors = {
				cmyk: guards.isColorString(
					item.querySelector('CMYK')?.textContent || ''
				)
					? parseAsColorValue.cmyk(
							item.querySelector('CMYK')?.textContent || ''
						)
					: defaultColorValues.cmyk,
				hex: guards.isColorString(
					item.querySelector('Hex')?.textContent || ''
				)
					? parseAsColorValue.hex(
							item.querySelector('Hex')?.textContent || ''
						)
					: defaultColorValues.hex,
				hsl: guards.isColorString(
					item.querySelector('HSL')?.textContent || ''
				)
					? parseAsColorValue.hsl(
							item.querySelector('HSL')?.textContent || ''
						)
					: defaultColorValues.hsl,
				hsv: guards.isColorString(
					item.querySelector('HSV')?.textContent || ''
				)
					? parseAsColorValue.hsv(
							item.querySelector('HSV')?.textContent || ''
						)
					: defaultColorValues.hsv,
				lab: guards.isColorString(
					item.querySelector('LAB')?.textContent || ''
				)
					? parseAsColorValue.lab(
							item.querySelector('LAB')?.textContent || ''
						)
					: defaultColorValues.lab,
				rgb: guards.isColorString(
					item.querySelector('RGB')?.textContent || ''
				)
					? parseAsColorValue.rgb(
							item.querySelector('RGB')?.textContent || ''
						)
					: defaultColorValues.rgb,
				xyz: guards.isColorString(
					item.querySelector('XYZ')?.textContent || ''
				)
					? parseAsColorValue.xyz(
							item.querySelector('XYZ')?.textContent || ''
						)
					: defaultColorValues.xyz
			};
			const cmykColorString = convertToColorString({
				value: colors.cmyk,
				format: 'cmyk'
			}).value as CMYKValueString;
			const cmykCSSColorString = convertToCSSColorString({
				value: colors.cmyk,
				format: 'cmyk'
			});
			const hexColorString = convertToColorString({
				value: colors.hex,
				format: 'hex'
			}).value as HexValueString;
			const hexCSSColorString = convertToCSSColorString({
				value: colors.hex,
				format: 'hex'
			});
			const hslColorString = convertToColorString({
				value: colors.hsl,
				format: 'hsl'
			}).value as HSLValueString;
			const hslCSSColorString = convertToCSSColorString({
				value: colors.hsl,
				format: 'hsl'
			});
			const hsvColorString = convertToColorString({
				value: colors.hsv,
				format: 'hsv'
			}).value as HSVValueString;
			const hsvCSSColorString = convertToCSSColorString({
				value: colors.hsv,
				format: 'hsv'
			});
			const labColorString = convertToColorString({
				value: colors.lab,
				format: 'lab'
			}).value as LABValueString;
			const labCSSColorString = convertToCSSColorString({
				value: colors.lab,
				format: 'lab'
			});
			const rgbColorString = convertToColorString({
				value: colors.rgb,
				format: 'rgb'
			}).value as RGBValueString;
			const rgbCSSColorString = convertToCSSColorString({
				value: colors.rgb,
				format: 'rgb'
			});
			const xyzColorString = convertToColorString({
				value: colors.xyz,
				format: 'xyz'
			}).value as XYZValueString;
			const xyzCSSColorString = convertToCSSColorString({
				value: colors.xyz,
				format: 'xyz'
			});
			const colorStrings = {
				cmykString: cmykColorString,
				hexString: hexColorString,
				hslString: hslColorString,
				hsvString: hsvColorString,
				labString: labColorString,
				rgbString: rgbColorString,
				xyzString: xyzColorString
			};
			const cssStrings = {
				cmykCSSString: cmykCSSColorString,
				hexCSSString: hexCSSColorString,
				hslCSSString: hslCSSColorString,
				hsvCSSString: hsvCSSColorString,
				labCSSString: labCSSColorString,
				rgbCSSString: rgbCSSColorString,
				xyzCSSString: xyzCSSColorString
			};

			// generate color strings and CSS strings
			return {
				id,
				colors,
				colorStrings,
				cssStrings
			};
		});

		return Promise.resolve(items);
	} catch (error) {
		console.error('Error parsing XML palette items:', error);

		return Promise.resolve([]);
	}
}

export const xml = {
	flags,
	paletteItems
};
