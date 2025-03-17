import {
	ColorParsingUtilities,
	Hex,
	HexStringMap,
	HSL,
	HSLStringMap,
	RGB,
	RGBStringMap,
	Services
} from '../../../../types/index.js';

export function colorParsingUtilitiesFactory(
	services: Services
): ColorParsingUtilities {
	const { errors } = services;

	function parseHexValueAsStringMap(
		hex: Hex['value']
	): HexStringMap['value'] {
		return errors.handleSync(() => {
			return { hex: hex.hex };
		}, 'Error parsing hex value as raw hex.');
	}

	function parseHSLValueAsStringMap(
		hsl: HSL['value']
	): HSLStringMap['value'] {
		return errors.handleSync(() => {
			return {
				hue: `${hsl.hue}`,
				saturation: `${hsl.saturation * 100}%`,
				lightness: `${hsl.lightness * 100}%`
			};
		}, 'Error parsing HSL value as string map.');
	}

	function parseRGBValueAsStringMap(
		rgb: RGB['value']
	): RGBStringMap['value'] {
		return errors.handleSync(() => {
			return {
				red: `${rgb.red}`,
				green: `${rgb.green}`,
				blue: `${rgb.blue}`
			};
		}, 'Error parsing RGB value as string map.');
	}

	const colorParsingUtilities: ColorParsingUtilities = {
		parseHexValueAsStringMap,
		parseHSLValueAsStringMap,
		parseRGBValueAsStringMap
	};

	return errors.handleSync(
		() => colorParsingUtilities,
		'Error occurred while creating color parsing utilities group.'
	);
}
