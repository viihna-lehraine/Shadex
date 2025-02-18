// File: common/utils/color.js

import {
	CMYK,
	CMYKStringObject,
	Color,
	ColorDataAssertion,
	ColorSpaceExtended,
	ColorStringObject,
	ColorUtilsInterface,
	HelpersInterface,
	Hex,
	HexStringObject,
	HSL,
	HSLStringObject,
	HSV,
	HSVStringObject,
	LAB,
	LABStringObject,
	RangeKeyMap,
	RGB,
	RGBStringObject,
	ServicesInterface,
	SL,
	SV,
	UtilitiesInterface,
	XYZ,
	XYZStringObject
} from '../../types/index.js';
import { data } from '../../data/index.js';

const config = data.config;
const defaultColors = data.defaults.colors;
const defaultColorStrings = data.defaults.colors.strings;

export function createColorUtils(
	helpers: HelpersInterface,
	services: ServicesInterface,
	utils: UtilitiesInterface
): ColorUtilsInterface {
	function convertColorStringToColor(colorString: ColorStringObject): Color {
		const clonedColor = utils.core.clone(colorString);

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

				const brandedHue = utils.brand.asRadial(unbrandedHSL.value.hue);
				const brandedSaturation = utils.brand.asPercentile(
					unbrandedHSL.value.saturation
				);
				const brandedLightness = utils.brand.asPercentile(
					unbrandedHSL.value.lightness
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

	return {
		convertColorStringToColor,
		convertCMYKStringToValue(cmyk) {
			return {
				cyan: utils.brand.asPercentile(parseFloat(cmyk.cyan) / 100),
				magenta: utils.brand.asPercentile(
					parseFloat(cmyk.magenta) / 100
				),
				yellow: utils.brand.asPercentile(parseFloat(cmyk.yellow) / 100),
				key: utils.brand.asPercentile(parseFloat(cmyk.key) / 100)
			};
		},
		convertCMYKValueToString(
			cmyk: CMYK['value']
		): CMYKStringObject['value'] {
			return {
				cyan: `${cmyk.cyan * 100}%`,
				magenta: `${cmyk.magenta * 100}%`,
				yellow: `${cmyk.yellow * 100}%`,
				key: `${cmyk.key * 100}%`
			};
		},
		convertColorToColorString(color: Color): ColorStringObject {
			const log = services.log;
			const clonedColor = utils.core.clone(color);

			if (utils.typeGuards.isColorString(clonedColor)) {
				log(
					'error',
					`Already formatted as color string: ${JSON.stringify(color)}`,
					'colorUtils.convertColorToColorString()'
				);

				return clonedColor;
			}

			if (utils.typeGuards.isCMYKColor(clonedColor)) {
				const newValue = utils.format.formatPercentageValues(
					clonedColor.value
				) as CMYK['value'];

				return {
					format: 'cmyk',
					value: {
						cyan: `${newValue.cyan}%`,
						magenta: `${newValue.magenta}%`,
						yellow: `${newValue.yellow}%`,
						key: `${newValue.key}%`
					} as CMYKStringObject['value']
				};
			} else if (utils.typeGuards.isHex(clonedColor)) {
				const newValue = utils.format.formatPercentageValues(
					(clonedColor as Hex).value
				) as Hex['value'];

				return {
					format: 'hex',
					value: {
						hex: `${newValue.hex}`
					} as HexStringObject['value']
				};
			} else if (utils.typeGuards.isHSLColor(clonedColor)) {
				const newValue = utils.format.formatPercentageValues(
					clonedColor.value
				) as HSL['value'];

				return {
					format: 'hsl',
					value: {
						hue: `${newValue.hue}`,
						saturation: `${newValue.saturation}%`,
						lightness: `${newValue.lightness}%`
					} as HSLStringObject['value']
				};
			} else if (utils.typeGuards.isHSVColor(clonedColor)) {
				const newValue = utils.format.formatPercentageValues(
					clonedColor.value
				) as HSV['value'];

				return {
					format: 'hsv',
					value: {
						hue: `${newValue.hue}`,
						saturation: `${newValue.saturation}%`,
						value: `${newValue.value}%`
					} as HSVStringObject['value']
				};
			} else if (utils.typeGuards.isLAB(clonedColor)) {
				const newValue = utils.format.formatPercentageValues(
					clonedColor.value
				) as LAB['value'];

				return {
					format: 'lab',
					value: {
						l: `${newValue.l}`,
						a: `${newValue.a}`,
						b: `${newValue.b}`
					} as LABStringObject['value']
				};
			} else if (utils.typeGuards.isRGB(clonedColor)) {
				const newValue = utils.format.formatPercentageValues(
					clonedColor.value
				) as RGB['value'];

				return {
					format: 'rgb',
					value: {
						red: `${newValue.red}`,
						green: `${newValue.green}`,
						blue: `${newValue.blue}`
					} as RGBStringObject['value']
				};
			} else if (utils.typeGuards.isXYZ(clonedColor)) {
				const newValue = utils.format.formatPercentageValues(
					clonedColor.value
				) as XYZ['value'];

				return {
					format: 'xyz',
					value: {
						x: `${newValue.x}`,
						y: `${newValue.y}`,
						z: `${newValue.z}`
					} as XYZStringObject['value']
				};
			} else {
				log(
					'error',
					`Unsupported format: ${clonedColor.format}`,
					'colorUtils.convertColorToColorString()'
				);

				return defaultColorStrings.hsl;
			}
		},
		convertColorToCSS(color: Color): string {
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
						console.error(
							`Unexpected color format: ${color.format}`
						);

						return '#FFFFFF';
				}
			} catch (error) {
				throw new Error(`getCSSColorString error: ${error}`);
			}
		},
		convertCSSToColor(color: string): Exclude<Color, SL | SV> | null {
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
					color.length === 7
						? color
						: utils.format.convertShortHexToLong(color);
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
		},
		convertHexStringToValue(hex: HexStringObject['value']): Hex['value'] {
			return { hex: utils.brand.asHexSet(hex.hex) };
		},
		convertHexValueToString(hex: Hex['value']): HexStringObject['value'] {
			return { hex: hex.hex };
		},
		convertHSL(color: HSL, colorSpace: ColorSpaceExtended): Color {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(color)) {
					log(
						'error',
						`Invalid color value ${JSON.stringify(color)}`,
						'colorUtils.convertHSL()'
					);

					return defaultColors.hsl;
				}

				const clonedColor = utils.core.clone(color) as HSL;

				switch (colorSpace) {
					case 'cmyk':
						return helpers.color.hslToCMYK(clonedColor);
					case 'hex':
						return helpers.color.hslToHex(clonedColor);
					case 'hsl':
						return utils.core.clone(clonedColor);
					case 'hsv':
						return helpers.color.hslToHSV(clonedColor);
					case 'lab':
						return helpers.color.hslToLAB(clonedColor);
					case 'rgb':
						return helpers.color.hslToRGB(clonedColor);
					case 'sl':
						return helpers.color.hslToSL(clonedColor);
					case 'sv':
						return helpers.color.hslToSV(clonedColor);
					case 'xyz':
						return helpers.color.hslToXYZ(clonedColor);
					default:
						throw new Error('Invalid color format');
				}
			} catch (error) {
				throw new Error(`hslTo() error: ${error}`);
			}
		},
		convertHSLStringToValue(hsl: HSLStringObject['value']): HSL['value'] {
			return {
				hue: utils.brand.asRadial(parseFloat(hsl.hue)),
				saturation: utils.brand.asPercentile(
					parseFloat(hsl.saturation) / 100
				),
				lightness: utils.brand.asPercentile(
					parseFloat(hsl.lightness) / 100
				)
			};
		},
		convertHSLValueToString(hsl: HSL['value']): HSLStringObject['value'] {
			return {
				hue: `${hsl.hue}°`,
				saturation: `${hsl.saturation * 100}%`,
				lightness: `${hsl.lightness * 100}%`
			};
		},
		convertHSVStringToValue(hsv: HSVStringObject['value']): HSV['value'] {
			return {
				hue: utils.brand.asRadial(parseFloat(hsv.hue)),
				saturation: utils.brand.asPercentile(
					parseFloat(hsv.saturation) / 100
				),
				value: utils.brand.asPercentile(parseFloat(hsv.value) / 100)
			};
		},
		convertHSVValueToString(hsv: HSV['value']): HSVStringObject['value'] {
			return {
				hue: `${hsv.hue}°`,
				saturation: `${hsv.saturation * 100}%`,
				value: `${hsv.value * 100}%`
			};
		},
		convertLABStringToValue(lab: LABStringObject['value']): LAB['value'] {
			return {
				l: utils.brand.asLAB_L(parseFloat(lab.l)),
				a: utils.brand.asLAB_A(parseFloat(lab.a)),
				b: utils.brand.asLAB_B(parseFloat(lab.b))
			};
		},
		convertLABValueToString(lab: LAB['value']): LABStringObject['value'] {
			return {
				l: `${lab.l}`,
				a: `${lab.a}`,
				b: `${lab.b}`
			};
		},
		convertRGBStringToValue(rgb: RGBStringObject['value']): RGB['value'] {
			return {
				red: utils.brand.asByteRange(parseFloat(rgb.red)),
				green: utils.brand.asByteRange(parseFloat(rgb.green)),
				blue: utils.brand.asByteRange(parseFloat(rgb.blue))
			};
		},
		convertRGBValueToString(rgb: RGB['value']): RGBStringObject['value'] {
			return {
				red: `${rgb.red}`,
				green: `${rgb.green}`,
				blue: `${rgb.blue}`
			};
		},
		convertToHSL(color: Exclude<Color, SL | SV>): HSL {
			const log = services.log;

			try {
				if (!utils.validate.colorValue(color)) {
					log(
						'error',
						`Invalid color value ${JSON.stringify(color)}`,
						'colorUtils.convertToHSL()'
					);

					return defaultColors.hsl as HSL;
				}

				const clonedColor = utils.core.clone(color);

				switch (color.format) {
					case 'cmyk':
						return helpers.color.cmykToHSL(clonedColor as CMYK);
					case 'hex':
						return helpers.color.hexToHSL(clonedColor as Hex);
					case 'hsl':
						return utils.core.clone(clonedColor as HSL);
					case 'hsv':
						return helpers.color.hsvToHSL(clonedColor as HSV);
					case 'lab':
						return helpers.color.labToHSL(clonedColor as LAB);
					case 'rgb':
						return helpers.color.rgbToHSL(clonedColor as RGB);
					case 'xyz':
						return helpers.color.xyzToHSL(clonedColor as XYZ);
					default:
						throw new Error('Invalid color format');
				}
			} catch (error) {
				throw new Error(`toHSL() error: ${error}`);
			}
		},
		convertXYZStringToValue(xyz: XYZStringObject['value']): XYZ['value'] {
			return {
				x: utils.brand.asXYZ_X(parseFloat(xyz.x)),
				y: utils.brand.asXYZ_Y(parseFloat(xyz.y)),
				z: utils.brand.asXYZ_Z(parseFloat(xyz.z))
			};
		},
		convertXYZValueToString(xyz: XYZ['value']): XYZStringObject['value'] {
			return {
				x: `${xyz.x}`,
				y: `${xyz.y}`,
				z: `${xyz.z}`
			};
		},
		getColorString(color: Color): string | null {
			try {
				const formatters = {
					cmyk: (c: CMYK) =>
						`cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
					hex: (c: Hex) => c.value.hex,
					hsl: (c: HSL) =>
						`hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
					hsv: (c: HSV) =>
						`hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
					lab: (c: LAB) =>
						`lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
					rgb: (c: RGB) =>
						`rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
					xyz: (c: XYZ) =>
						`xyz(${c.value.x}, ${c.value.y}, ${c.value.z})`
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
						services.log(
							'error',
							`Unsupported color format for ${color}`,
							'colorUtils.getColorString()'
						);

						return null;
				}
			} catch (error) {
				services.log(
					'error',
					`getColorString error: ${error}`,
					'colorUtils.getColorString()'
				);

				return null;
			}
		},
		getConversionFn<
			From extends keyof ColorDataAssertion,
			To extends keyof ColorDataAssertion
		>(
			from: From,
			to: To
		):
			| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
			| undefined {
			try {
				const fnName =
					`${from}To${to[0].toUpperCase() + to.slice(1)}` as keyof typeof helpers.color;

				if (!(fnName in helpers.color)) return undefined;

				const conversionFn = helpers.color[fnName] as unknown as (
					input: ColorDataAssertion[From]
				) => ColorDataAssertion[To];

				return (
					value: ColorDataAssertion[From]
				): ColorDataAssertion[To] =>
					structuredClone(conversionFn(value));
			} catch (error) {
				services.log(
					'error',
					`Error getting conversion function: ${error}`,
					'colorUtils.getConversionFn()'
				);

				return undefined;
			}
		},
		hueToRGB(p: number, q: number, t: number): number {
			try {
				const clonedP = utils.core.clone(p);
				const clonedQ = utils.core.clone(q);

				let clonedT = utils.core.clone(t);

				if (clonedT < 0) clonedT += 1;
				if (clonedT > 1) clonedT -= 1;
				if (clonedT < 1 / 6)
					return clonedP + (clonedQ - clonedP) * 6 * clonedT;
				if (clonedT < 1 / 2) return clonedQ;
				if (clonedT < 2 / 3)
					return (
						clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6
					);

				return clonedP;
			} catch (error) {
				services.log(
					'error',
					`Error converting hue to RGB: ${error}`,
					'colorUtils.hueToRGB()'
				);

				return 0;
			}
		},
		narrowToColor(color: Color | ColorStringObject): Color | null {
			if (utils.typeGuards.isColorString(color))
				return convertColorStringToColor(color);

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
		toColorValueRange<T extends keyof RangeKeyMap>(
			value: string | number,
			rangeKey: T
		): RangeKeyMap[T] {
			utils.validate.range(value, rangeKey);

			if (rangeKey === 'HexSet') {
				return utils.brand.asHexSet(
					value as string
				) as unknown as RangeKeyMap[T];
			}

			return utils.brand.asBranded(value as number, rangeKey);
		},
		validateAndConvertColor(
			color: Color | ColorStringObject | null
		): Color | null {
			const log = services.log;

			if (!color) return null;

			const convertedColor = utils.typeGuards.isColorString(color)
				? convertColorStringToColor(color)
				: color;

			if (!utils.validate.colorValue(convertedColor)) {
				log(
					'error',
					`Invalid color: ${JSON.stringify(convertedColor)}`,
					'colorUtils.validateAndConvertColor()'
				);

				return null;
			}

			return convertedColor;
		}
	};
}
