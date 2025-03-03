// File: core/utils/partials/color/parse.ts

import {
	ColorParsingUtilities,
	Hex,
	HexStringMap,
	HSL,
	HSLStringMap,
	HSV,
	HSVStringMap,
	LAB,
	LABStringMap,
	RGB,
	RGBStringMap,
	Services,
	XYZ,
	XYZStringMap
} from '../../../../types/index.js';

export function colorParsingUtilitiesFactory(
	services: Services
): ColorParsingUtilities {
	const { errors } = services;

	function parseHexValueAsStringMap(hex: Hex['value']): HexStringMap['value'] {
		return errors.handleSync(() => {
			return { hex: hex.hex };
		}, 'Error parsing hex value as raw hex.');
	}

	function parseHSLValueAsStringMap(hsl: HSL['value']): HSLStringMap['value'] {
		return errors.handleSync(() => {
			return {
				hue: `${hsl.hue}`,
				saturation: `${hsl.saturation * 100}%`,
				lightness: `${hsl.lightness * 100}%`
			};
		}, 'Error parsing HSL value as string map.');
	}

	function parseHSVValueAsStringMap(hsv: HSV['value']): HSVStringMap['value'] {
		return errors.handleSync(() => {
			return {
				hue: `${hsv.hue}`,
				saturation: `${hsv.saturation * 100}%`,
				value: `${hsv.value * 100}%`
			};
		}, 'Error parsing HSV value as string map.');
	}
	function parseLABValueAsStringMap(lab: LAB['value']): LABStringMap['value'] {
		return errors.handleSync(() => {
			return {
				l: `${lab.l}`,
				a: `${lab.a}`,
				b: `${lab.b}`
			};
		}, 'Error parsing LAB value as string map.');
	}

	function parseRGBValueAsStringMap(rgb: RGB['value']): RGBStringMap['value'] {
		return errors.handleSync(() => {
			return {
				red: `${rgb.red}`,
				green: `${rgb.green}`,
				blue: `${rgb.blue}`
			};
		}, 'Error parsing RGB value as string map.');
	}

	function parseXYZValueAsStringMap(xyz: XYZ['value']): XYZStringMap['value'] {
		return errors.handleSync(() => {
			return {
				x: `${xyz.x}`,
				y: `${xyz.y}`,
				z: `${xyz.z}`
			};
		}, 'Error parsing XYZ value as string map.');
	}

	const colorParsingUtilities: ColorParsingUtilities = {
		parseHexValueAsStringMap,
		parseHSLValueAsStringMap,
		parseHSVValueAsStringMap,
		parseLABValueAsStringMap,
		parseRGBValueAsStringMap,
		parseXYZValueAsStringMap
	};

	return errors.handleSync(
		() => colorParsingUtilities,
		'Error occurred while creating color parsing utilities group.'
	);
}
