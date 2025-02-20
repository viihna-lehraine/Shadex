// File: common/utils/partials/color/parse.ts

import {
	Color,
	ColorParseUtils,
	ColorSpaceExtended,
	ColorStringMap,
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
	Utilities,
	XYZ,
	XYZStringMap
} from '../../../../types/index.js';

export function colorParsingUtilsFactory(utils: Utilities): ColorParseUtils {
	const { brandColorStringMap } = utils.color;
	const { isColorStringMap } = utils.typeGuards;

	return {
		narrowToColor(color: Color | ColorStringMap): Color | null {
			if (isColorStringMap(color)) return brandColorStringMap(color);

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
		},
		parseHexValueAsStringMap(hex: Hex['value']): HexStringMap['value'] {
			return { hex: hex.hex };
		},
		parseHSLValueAsStringMap(hsl: HSL['value']): HSLStringMap['value'] {
			return {
				hue: `${hsl.hue}°`,
				saturation: `${hsl.saturation * 100}%`,
				lightness: `${hsl.lightness * 100}%`
			};
		},
		parseHSVValueAsStringMap(hsv: HSV['value']): HSVStringMap['value'] {
			return {
				hue: `${hsv.hue}°`,
				saturation: `${hsv.saturation * 100}%`,
				value: `${hsv.value * 100}%`
			};
		},
		parseLABValueAsStringMap(lab: LAB['value']): LABStringMap['value'] {
			return {
				l: `${lab.l}`,
				a: `${lab.a}`,
				b: `${lab.b}`
			};
		},
		parseRGBValueAsStringMap(rgb: RGB['value']): RGBStringMap['value'] {
			return {
				red: `${rgb.red}`,
				green: `${rgb.green}`,
				blue: `${rgb.blue}`
			};
		},
		parseXYZValueAsStringMap(xyz: XYZ['value']): XYZStringMap['value'] {
			return {
				x: `${xyz.x}`,
				y: `${xyz.y}`,
				z: `${xyz.z}`
			};
		}
	};
}
