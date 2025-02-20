// File: common/utils/partials/color/format.ts

import {
	CMYK,
	CMYKStringMap,
	Color,
	ColorFormat,
	ColorFormatUtils,
	ColorStringMap,
	Helpers,
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
	SL,
	SV,
	Utilities,
	XYZ,
	XYZStringMap
} from '../../../../types/index.js';
import { defaults, regex } from '../../../../config/index.js';

const defaultColors = defaults.colors;

export function colorFormattingUtilsFactory(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): ColorFormatUtils {
	const { clone } = helpers.data;
	const { log } = services;
	const { format, typeGuards } = utils;

	return {
		formatColorAsCSS(color: Color): string {
			try {
				switch (color.format) {
					case 'cmyk':
						return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key})`;
					case 'hex':
						return String(color.value.hex);
					case 'hsl':
						return `hsl(${Math.round(color.value.hue)},
									${Math.round(color.value.saturation)}%,
									${Math.round(color.value.lightness)}%)`;
					case 'hsv':
						return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%)`;
					case 'lab':
						return `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
					case 'rgb':
						return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
					case 'xyz':
						return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z})`;
					default:
						console.error(
							`Unexpected color format: ${color.format}`
						);

						return '#FFFFFF';
				}
			} catch (error) {
				throw new Error(`getCSSColorString error: ${error}`);
			}
		},
		formatColorAsStringMap(color: Color): ColorStringMap {
			const clonedColor = clone(color);

			if (utils.typeGuards.isColorStringMap(clonedColor)) {
				log(
					`Already formatted as color string: ${JSON.stringify(color)}`,
					'error'
				);

				return clonedColor;
			}

			if (
				utils.typeGuards.isColorFormat(
					clonedColor,
					'cmyk' as ColorFormat
				)
			) {
				const newValue = format.formatPercentageValues(
					clonedColor.value
				) as CMYK['value'];

				return {
					format: 'cmyk',
					value: {
						cyan: `${newValue.cyan}%`,
						magenta: `${newValue.magenta}%`,
						yellow: `${newValue.yellow}%`,
						key: `${newValue.key}%`
					} as CMYKStringMap['value']
				};
			} else if (typeGuards.isHex(clonedColor)) {
				const newValue = format.formatPercentageValues(
					(clonedColor as Hex).value
				) as Hex['value'];

				return {
					format: 'hex',
					value: {
						hex: `${newValue.hex}`
					} as HexStringMap['value']
				};
			} else if (typeGuards.isColorFormat(clonedColor, 'hsl')) {
				const newValue = format.formatPercentageValues(
					clonedColor.value
				) as HSL['value'];

				return {
					format: 'hsl',
					value: {
						hue: `${newValue.hue}`,
						saturation: `${newValue.saturation}%`,
						lightness: `${newValue.lightness}%`
					} as HSLStringMap['value']
				};
			} else if (
				typeGuards.isColorFormat(clonedColor, 'hsv' as ColorFormat)
			) {
				const newValue = format.formatPercentageValues(
					clonedColor.value
				) as HSV['value'];

				return {
					format: 'hsv',
					value: {
						hue: `${newValue.hue}`,
						saturation: `${newValue.saturation}%`,
						value: `${newValue.value}%`
					} as HSVStringMap['value']
				};
			} else if (typeGuards.isLAB(clonedColor)) {
				const newValue = format.formatPercentageValues(
					clonedColor.value
				) as LAB['value'];

				return {
					format: 'lab',
					value: {
						l: `${newValue.l}`,
						a: `${newValue.a}`,
						b: `${newValue.b}`
					} as LABStringMap['value']
				};
			} else if (typeGuards.isRGB(clonedColor)) {
				const newValue = format.formatPercentageValues(
					clonedColor.value
				) as RGB['value'];

				return {
					format: 'rgb',
					value: {
						red: `${newValue.red}`,
						green: `${newValue.green}`,
						blue: `${newValue.blue}`
					} as RGBStringMap['value']
				};
			} else if (typeGuards.isXYZ(clonedColor)) {
				const newValue = format.formatPercentageValues(
					clonedColor.value
				) as XYZ['value'];

				return {
					format: 'xyz',
					value: {
						x: `${newValue.x}`,
						y: `${newValue.y}`,
						z: `${newValue.z}`
					} as XYZStringMap['value']
				};
			} else {
				log(`Unsupported format: ${clonedColor.format}`, 'error');

				return defaultColors.hslString;
			}
		},
		formatCSSAsColor(color: string): Exclude<Color, SL | SV> | null {
			color = color.trim().toLowerCase();

			const cmykMatch = color.match(regex.css.cmyk);
			const hslMatch = color.match(regex.css.hsl);
			const hsvMatch = color.match(regex.css.hsv);
			const labMatch = color.match(regex.css.lab);
			const rgbMatch = color.match(regex.css.rgb);
			const xyzMatch = color.match(regex.css.xyz);

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
					color.length === 7
						? color
						: format.convertShortHexToLong(color);
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
	};
}
