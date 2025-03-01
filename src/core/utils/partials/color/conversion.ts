// File: common/utils/partials/conversion.ts

import {
	AdjustmentUtilities,
	BrandingUtilities,
	CMYK,
	Color,
	ColorConversionUtilities,
	ColorSpaceExtended,
	FormattingUtilities,
	Helpers,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SanitationUtilities,
	Services,
	SL,
	SV,
	ValidationUtilities,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../../../types/index.js';
import { config, defaults } from '../../../../config/index.js';

const defaultCMYK = defaults.colors.cmyk;
const defaultHex = defaults.colors.hex;
const defaultHSL = defaults.colors.hsl;
const defaultHSV = defaults.colors.hsv;
const defaultLAB = defaults.colors.lab;
const defaultRGB = defaults.colors.rgb;
const defaultSL = defaults.colors.sl;
const defaultSV = defaults.colors.sv;
const defaultXYZ = defaults.colors.xyz;

const math = config.math;

export function colorConversionUtilitiesFactory(
	adjust: AdjustmentUtilities,
	brand: BrandingUtilities,
	format: FormattingUtilities,
	helpers: Helpers,
	sanitize: SanitationUtilities,
	services: Services,
	validate: ValidationUtilities
): ColorConversionUtilities {
	const {
		color: { hueToRGB },
		data: { deepClone }
	} = helpers;
	const { errors, log } = services;

	function cmykToHSL(cmyk: CMYK): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(cmyk)) {
				log.info(
					`Invalid CMYK value ${JSON.stringify(cmyk)}. Returning default HSL`,
					`utils.color.cmykToHSL`
				);

				return defaultHSL;
			}

			return rgbToHSL(cmykToRGB(deepClone(cmyk)));
		}, 'Error converting CMYK to HSL');
	}

	function cmykToRGB(cmyk: CMYK): RGB {
		return errors.handleSync(() => {
			if (!validate.colorValue(cmyk)) {
				log.info(
					`Invalid CMYK value ${JSON.stringify(cmyk)}. Returning default RGB.`,
					`utils.color.cmykToRGB`
				);

				return defaultRGB;
			}

			const clonedCMYK = deepClone(cmyk);
			const r =
				255 *
				(1 - clonedCMYK.value.cyan / 100) *
				(1 - clonedCMYK.value.key / 100);
			const g =
				255 *
				(1 - clonedCMYK.value.magenta / 100) *
				(1 - clonedCMYK.value.key / 100);
			const b =
				255 *
				(1 - clonedCMYK.value.yellow / 100) *
				(1 - clonedCMYK.value.key / 100);
			const rgb: RGB = {
				value: {
					red: brand.asByteRange(sanitize.percentile(r)),
					green: brand.asByteRange(sanitize.percentile(g)),
					blue: brand.asByteRange(sanitize.percentile(b))
				},
				format: 'rgb'
			};

			return adjust.clampRGB(rgb);
		}, 'Error converting CMYK to RGB');
	}

	function convertHSL(color: HSL, colorSpace: ColorSpaceExtended): Color {
		return errors.handleSync(() => {
			if (!validate.colorValue(color)) {
				log.info(
					`Invalid color value ${JSON.stringify(color)}. Returning default HSL.`,
					`utils.color.convertHSL`
				);

				return defaultHSL;
			}

			const clonedColor = deepClone(color) as HSL;

			switch (colorSpace) {
				case 'cmyk':
					return hslToCMYK(clonedColor);
				case 'hex':
					return hslToHex(clonedColor);
				case 'hsl':
					return deepClone(clonedColor);
				case 'hsv':
					return hslToHSV(clonedColor);
				case 'lab':
					return hslToLAB(clonedColor);
				case 'rgb':
					return hslToRGB(clonedColor);
				case 'sl':
					return hslToSL(clonedColor);
				case 'sv':
					return hslToSV(clonedColor);
				case 'xyz':
					return hslToXYZ(clonedColor);
				default:
					throw new Error('Invalid color format');
			}
		}, 'Error converting HSL to color');
	}

	function convertToHSL(color: Exclude<Color, SL | SV>): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(color)) {
				log.info(
					`Invalid color value ${JSON.stringify(color)}. Returning default HSL`,
					`utils.color.convertToHSL`
				);

				return defaultHSL;
			}

			const clonedColor = deepClone(color);

			switch (color.format) {
				case 'cmyk':
					return cmykToHSL(clonedColor as CMYK);
				case 'hex':
					return hexToHSL(clonedColor as Hex);
				case 'hsl':
					return deepClone(clonedColor as HSL);
				case 'hsv':
					return hsvToHSL(clonedColor as HSV);
				case 'lab':
					return labToHSL(clonedColor as LAB);
				case 'rgb':
					return rgbToHSL(clonedColor as RGB);
				case 'xyz':
					return xyzToHSL(clonedColor as XYZ);
				default:
					throw new Error('Invalid color format');
			}
		}, 'Error converting color to HSL');
	}

	function hexToHSL(hex: Hex): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(hex)) {
				log.info(
					`Invalid Hex value ${JSON.stringify(hex)}. Returning default HSL`,
					`utils.color.hexToHSL`
				);

				return defaultHSL;
			}

			return rgbToHSL(hexToRGB(deepClone(hex)));
		}, 'Error converting Hex to HSL');
	}

	function hexToHSLWrapper(input: string | Hex): HSL {
		return errors.handleSync(() => {
			const clonedInput = deepClone(input);

			const hex: Hex =
				typeof clonedInput === 'string'
					? {
							value: {
								hex: brand.asHexSet(clonedInput)
							},
							format: 'hex'
						}
					: {
							value: {
								hex: brand.asHexSet(clonedInput.value.hex)
							},
							format: 'hex'
						};
			return hexToHSL(hex);
		}, 'Error converting Hex to HSL');
	}

	function hexToRGB(hex: Hex): RGB {
		return errors.handleSync(() => {
			if (!validate.colorValue(hex)) {
				log.info(
					`Invalid Hex value ${JSON.stringify(hex)}. Returning default RGB`,
					`utils.color.hexToRGB`
				);

				return defaultRGB;
			}

			const clonedHex = deepClone(hex);
			const strippedHex = format.stripHashFromHex(clonedHex).value.hex;
			const bigint = parseInt(strippedHex, 16);

			return {
				value: {
					red: brand.asByteRange(sanitize.percentile((bigint >> 16) & 255)),
					green: brand.asByteRange(sanitize.percentile((bigint >> 8) & 255)),
					blue: brand.asByteRange(sanitize.percentile(bigint & 255))
				},
				format: 'rgb'
			};
		}, 'Error converting Hex to RGB');
	}

	function hslToCMYK(hsl: HSL): CMYK {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default CMYK.`,
					`utils.color.hslToCMYK`
				);

				return defaultCMYK;
			}

			return rgbToCMYK(hslToRGB(deepClone(hsl)));
		}, 'Error converting HSL to CMYK');
	}

	function hslToHex(hsl: HSL): Hex {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default Hex`,
					`utils.color.hslToHex`
				);

				return defaultHex;
			}

			return rgbToHex(hslToRGB(deepClone(hsl)));
		}, 'Error converting HSL to Hex');
	}

	function hslToHSV(hsl: HSL): HSV {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default HSV`,
					`utils.color.hslToHSV`
				);

				return defaultHSV;
			}

			const clonedHSL = deepClone(hsl);
			const s = clonedHSL.value.saturation / 100;
			const l = clonedHSL.value.lightness / 100;
			const value = l + s * Math.min(l, 1 - 1);
			const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

			return {
				value: {
					hue: brand.asRadial(sanitize.percentile(clonedHSL.value.hue)),
					saturation: brand.asPercentile(
						sanitize.percentile(newSaturation * 100)
					),
					value: brand.asPercentile(sanitize.percentile(value * 100))
				},
				format: 'hsv'
			};
		}, 'Error converting HSL to HSV');
	}

	function hslToLAB(hsl: HSL): LAB {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default LAB`,
					`utils.color.hslToLAB`
				);

				return defaultLAB;
			}

			return xyzToLAB(rgbToXYZ(hslToRGB(deepClone(hsl))));
		}, 'Error converting HSL to LAB');
	}

	function hslToRGB(hsl: HSL): RGB {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default RGB`,
					`utils.color.hslToRGB`
				);

				return defaultRGB;
			}

			const clonedHSL = deepClone(hsl);
			const hue = clonedHSL.value.hue / 360;

			const s = clonedHSL.value.saturation / 100;
			const l = clonedHSL.value.lightness / 100;
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			return {
				value: {
					red: brand.asByteRange(
						sanitize.percentile(hueToRGB(p, q, hue + 1 / 3) * 255)
					),
					green: brand.asByteRange(
						sanitize.percentile(hueToRGB(p, q, hue) * 255)
					),
					blue: brand.asByteRange(
						sanitize.percentile(hueToRGB(p, q, hue - 1 / 3) * 255)
					)
				},
				format: 'rgb'
			};
		}, 'Error converting HSL to RGB');
	}

	function hslToSL(hsl: HSL): SL {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default SL`,
					`utils.color.hslToSL`
				);

				return defaultSL;
			}

			return {
				value: {
					saturation: hsl.value.saturation,
					lightness: hsl.value.lightness
				},
				format: 'sl' as 'sl'
			};
		}, 'Error converting HSL to SL');
	}

	function hslToSV(hsl: HSL): SV {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default SV`,
					`utils.color.hslToSV`
				);

				return defaultSV;
			}

			return hsvToSV(rgbToHSV(hslToRGB(deepClone(hsl))));
		}, 'Error converting HSL to SV');
	}

	function hslToXYZ(hsl: HSL): XYZ {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.info(
					`Invalid HSL value ${JSON.stringify(hsl)}. Returning default HSL.`,
					`utils.color.hslToXYZ`
				);

				return defaultXYZ;
			}

			return labToXYZ(hslToLAB(deepClone(hsl)));
		}, 'Error converting HSL to XYZ');
	}

	function hsvToHSL(hsv: HSV): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsv)) {
				log.info(
					`Invalid HSV value ${JSON.stringify(hsv)}. Returning default HSL`,
					`utils.color.hsvToHSL`
				);

				return defaultHSL;
			}

			const clonedHSV = deepClone(hsv);

			const s = clonedHSV.value.saturation / 100;
			const v = clonedHSV.value.value / 100;
			const l = v * (1 - s / 2);

			const newSaturation =
				l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
			const lightness =
				clonedHSV.value.value * (1 - clonedHSV.value.saturation / 200);

			return {
				value: {
					hue: brand.asRadial(sanitize.percentile(clonedHSV.value.hue)),
					saturation: brand.asPercentile(
						sanitize.percentile(newSaturation * 100)
					),
					lightness: brand.asPercentile(sanitize.percentile(lightness))
				},
				format: 'hsl'
			};
		}, 'Error converting HSV to HSL');
	}

	function hsvToSV(hsv: HSV): SV {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsv)) {
				log.info(
					`Invalid HSV value ${JSON.stringify(hsv)}. Returning default SV`,
					`utils.color.hsvToSV`
				);

				return defaultSV;
			}

			return {
				value: {
					saturation: hsv.value.saturation,
					value: hsv.value.value
				},
				format: 'sv' as 'sv'
			};
		}, 'Error converting HSV to SV');
	}

	function labToHSL(lab: LAB): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(lab)) {
				log.info(
					`Invalid LAB value ${JSON.stringify(lab)}. Returning default HSL.`,
					`utils.color.labToHSL`
				);

				return defaultHSL;
			}

			return rgbToHSL(labToRGB(deepClone(lab)));
		}, 'Error converting LAB to HSL');
	}

	function labToRGB(lab: LAB): RGB {
		return errors.handleSync(() => {
			if (!validate.colorValue(lab)) {
				log.info(
					`Invalid LAB value ${JSON.stringify(lab)}. . Returning default RGB.`,
					`utils.color.labToRGB`
				);

				return defaultRGB;
			}

			return xyzToRGB(labToXYZ(deepClone(lab)));
		}, 'Error converting LAB to RGB');
	}

	function labToXYZ(lab: LAB): XYZ {
		return errors.handleSync(() => {
			if (!validate.colorValue(lab)) {
				log.info(
					`Invalid LAB value ${JSON.stringify(lab)}. Returning default XYZ.`,
					`utils.color.labToXYZ`
				);

				return defaultXYZ;
			}

			const clonedLAB = deepClone(lab);
			const refX = 95.047,
				refY = 100.0,
				refZ = 108.883;

			let y = (clonedLAB.value.l + 16) / 116;
			let x = clonedLAB.value.a / 500 + y;
			let z = y - clonedLAB.value.b / 200;

			const pow = Math.pow;

			return {
				value: {
					x: brand.asXYZ_X(
						sanitize.percentile(
							refX * (pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787)
						)
					),
					y: brand.asXYZ_Y(
						sanitize.percentile(
							refY * (pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787)
						)
					),
					z: brand.asXYZ_Z(
						sanitize.percentile(
							refZ * (pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787)
						)
					)
				},
				format: 'xyz'
			};
		}, 'Error converting LAB to XYZ');
	}

	function rgbToCMYK(rgb: RGB): CMYK {
		return errors.handleSync(() => {
			if (!validate.colorValue(rgb)) {
				log.info(
					`Invalid RGB value ${JSON.stringify(rgb)}.. Returning default CMYK`,
					`utils.color.rgbToCMYK`
				);

				return defaultCMYK;
			}

			const clonedRGB = deepClone(rgb);

			const redPrime = clonedRGB.value.red / 255;
			const greenPrime = clonedRGB.value.green / 255;
			const bluePrime = clonedRGB.value.blue / 255;

			const key = 1 - Math.max(redPrime, greenPrime, bluePrime);

			if (key === 1) {
				return {
					value: {
						cyan: brand.asPercentile(0),
						magenta: brand.asPercentile(0),
						yellow: brand.asPercentile(0),
						key: brand.asPercentile(1)
					},
					format: 'cmyk' as 'cmyk'
				};
			}

			const invK = 1 - key;
			const cyan = (1 - redPrime - key) / invK;
			const magenta = (1 - greenPrime - key) / invK;
			const yellow = (1 - bluePrime - key) / invK;

			const cmyk = {
				value: {
					cyan: sanitize.percentile(brand.asPercentile(cyan)),
					magenta: sanitize.percentile(brand.asPercentile(magenta)),
					yellow: sanitize.percentile(brand.asPercentile(yellow)),
					key: sanitize.percentile(brand.asPercentile(key))
				},
				format: 'cmyk' as 'cmyk'
			};

			log.info(
				`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(deepClone(cmyk))}`,
				`utils.color.rgbToCMYK`
			);

			return cmyk;
		}, 'Error converting RGB to CMYK');
	}

	function rgbToHex(rgb: RGB): Hex {
		return errors.handleSync(() => {
			if (!validate.colorValue(rgb)) {
				log.info(
					`Invalid RGB value ${JSON.stringify(rgb)}. . Returning default Hex.`,
					`utils.color.rgbToHex`
				);

				return defaultHex;
			}

			const clonedRGB = deepClone(rgb);

			if (
				[clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue].some(
					v => isNaN(v) || v < 0 || v > 255
				)
			) {
				log.info(
					`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nReturning default Hex.`,
					`utils.color.rgbToHex`
				);

				return defaultHex;
			}

			return {
				value: {
					hex: brand.asHexSet(
						`#${format.componentToHex(clonedRGB.value.red)}${format.componentToHex(clonedRGB.value.green)}${format.componentToHex(clonedRGB.value.blue)}`
					)
				},
				format: 'hex' as 'hex'
			};
		}, 'Error converting RGB to Hex');
	}

	function rgbToHSL(rgb: RGB): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(rgb)) {
				log.info(
					`Invalid RGB value ${JSON.stringify(rgb)}. Returning default HSL.`,
					`utils.color.rgbToHSL`
				);

				return defaultHSL;
			}

			const clonedRGB = deepClone(rgb);

			const red = (clonedRGB.value.red as unknown as number) / 255;
			const green = (clonedRGB.value.green as unknown as number) / 255;
			const blue = (clonedRGB.value.blue as unknown as number) / 255;

			const max = Math.max(red, green, blue);
			const min = Math.min(red, green, blue);

			let hue = 0,
				saturation = 0,
				lightness = (max + min) / 2;

			if (max !== min) {
				const delta = max - min;

				saturation =
					lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

				switch (max) {
					case red:
						hue = (green - blue) / delta + (green < blue ? 6 : 0);
						break;
					case green:
						hue = (blue - red) / delta + 2;
						break;
					case blue:
						hue = (red - green) / delta + 4;
						break;
				}
				hue *= 60;
			}

			return {
				value: {
					hue: brand.asRadial(sanitize.percentile(hue)),
					saturation: brand.asPercentile(sanitize.percentile(saturation * 100)),
					lightness: brand.asPercentile(sanitize.percentile(lightness * 100))
				},
				format: 'hsl'
			};
		}, 'Error converting RGB to HSL');
	}

	function rgbToHSV(rgb: RGB): HSV {
		return errors.handleSync(() => {
			if (!validate.colorValue(rgb)) {
				log.info(
					`Invalid RGB value ${JSON.stringify(rgb)}. Returning default HSV.`,
					`utils.color.rgbToHSV`
				);

				return defaultHSV;
			}

			const red = (rgb.value.red as unknown as number) / 255;
			const green = (rgb.value.green as unknown as number) / 255;
			const blue = (rgb.value.blue as unknown as number) / 255;

			const max = Math.max(red, green, blue);
			const min = Math.min(red, green, blue);
			const delta = max - min;

			let hue = 0;

			const value = max;
			const saturation = max === 0 ? 0 : delta / max;

			if (max !== min) {
				switch (max) {
					case red:
						hue = (green - blue) / delta + (green < blue ? 6 : 0);
						break;
					case green:
						hue = (blue - red) / delta + 2;
						break;
					case blue:
						hue = (red - green) / delta + 4;
						break;
				}

				hue *= 60;
			}

			return {
				value: {
					hue: brand.asRadial(sanitize.percentile(hue)),
					saturation: brand.asPercentile(sanitize.percentile(saturation * 100)),
					value: brand.asPercentile(sanitize.percentile(value * 100))
				},
				format: 'hsv'
			};
		}, 'Error converting RGB to HSV');
	}

	function rgbToXYZ(rgb: RGB): XYZ {
		return errors.handleSync(() => {
			if (!validate.colorValue(rgb)) {
				log.info(
					`Invalid RGB value ${JSON.stringify(rgb)}. Returning default XYZ`,
					`utils.color.rgbToXYZ`
				);

				return defaultXYZ;
			}

			// convert RGB values to linear space
			const red = (rgb.value.red as number) / 255;
			const green = (rgb.value.green as number) / 255;
			const blue = (rgb.value.blue as number) / 255;

			const linearRed =
				red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
			const linearGreen =
				green > 0.04045
					? Math.pow((green + 0.055) / 1.055, 2.4)
					: green / 12.92;
			const linearBlue =
				blue > 0.04045 ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue / 12.92;

			// scale to 100
			const scaledRed = linearRed * 100;
			const scaledGreen = linearGreen * 100;
			const scaledBlue = linearBlue * 100;

			const x = brand.asXYZ_X(
				adjust.clampXYZ(
					scaledRed * 0.4124 + scaledGreen * 0.3576 + scaledBlue * 0.1805,
					math.maxXYZ_X
				)
			);
			const y = brand.asXYZ_Y(
				adjust.clampXYZ(
					scaledRed * 0.2126 + scaledGreen * 0.7152 + scaledBlue * 0.0722,
					math.maxXYZ_Y
				)
			);
			const z = brand.asXYZ_Z(
				adjust.clampXYZ(
					scaledRed * 0.0193 + scaledGreen * 0.1192 + scaledBlue * 0.9505,
					math.maxXYZ_Z
				)
			);

			const xyz: XYZ = { value: { x, y, z }, format: 'xyz' };

			return validate.colorValue(xyz) ? xyz : defaultXYZ;
		}, 'Error converting RGB to XYZ');
	}

	function xyzToHSL(xyz: XYZ): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(xyz)) {
				log.info(
					`Invalid XYZ value ${JSON.stringify(xyz)}. Returning default HSL.`,
					`utils.color.xyzToHSL`
				);

				return defaultHSL;
			}

			return rgbToHSL(xyzToRGB(deepClone(xyz)));
		}, 'Error converting XYZ to HSL');
	}

	function xyzToLAB(xyz: XYZ): LAB {
		return errors.handleSync(() => {
			if (!validate.colorValue(xyz)) {
				log.info(
					`Invalid XYZ value ${JSON.stringify(xyz)}. Returning default LAB.`,
					`utils.color.xyzToLAB`
				);

				return defaultLAB;
			}

			const clonedXYZ = deepClone(xyz);
			const refX = math.maxXYZ_X,
				refY = math.maxXYZ_Y,
				refZ = math.maxXYZ_Z;

			clonedXYZ.value.x = adjust.normalizeXYZ(clonedXYZ.value.x, refX) as XYZ_X;
			clonedXYZ.value.y = adjust.normalizeXYZ(clonedXYZ.value.y, refY) as XYZ_Y;
			clonedXYZ.value.z = adjust.normalizeXYZ(clonedXYZ.value.z, refZ) as XYZ_Z;

			clonedXYZ.value.x =
				clonedXYZ.value.x > 0.008856
					? (Math.pow(clonedXYZ.value.x, 1 / 3) as XYZ_X)
					: ((7.787 * clonedXYZ.value.x + 16 / 116) as XYZ_X);
			clonedXYZ.value.y =
				clonedXYZ.value.y > 0.008856
					? (Math.pow(clonedXYZ.value.y, 1 / 3) as XYZ_Y)
					: ((7.787 * clonedXYZ.value.y + 16 / 116) as XYZ_Y);
			clonedXYZ.value.z =
				clonedXYZ.value.z > 0.008856
					? (Math.pow(clonedXYZ.value.z, 1 / 3) as XYZ_Z)
					: ((7.787 * clonedXYZ.value.z + 16 / 116) as XYZ_Z);

			const l = sanitize.percentile(
				parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2))
			);
			const a = sanitize.lab(
				parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)),
				'a'
			);
			const b = sanitize.lab(
				parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)),
				'b'
			);

			const lab: LAB = {
				value: {
					l: brand.asLAB_L(sanitize.percentile(l)),
					a: brand.asLAB_A(sanitize.percentile(a)),
					b: brand.asLAB_B(sanitize.percentile(b))
				},
				format: 'lab'
			};

			if (!validate.colorValue(lab)) {
				log.info(
					`Invalid LAB value ${JSON.stringify(lab)}. Returning default LAB.`,
					`utils.color.xyzToLAB`
				);

				return defaultLAB;
			}

			return lab;
		}, 'Error converting XYZ to LAB');
	}

	function xyzToRGB(xyz: XYZ): RGB {
		return errors.handleSync(() => {
			if (!validate.colorValue(xyz)) {
				log.info(
					`Invalid XYZ value ${JSON.stringify(xyz)}. Returning default RGB.`,
					`utils.color.xyzToRGB`
				);

				return defaultRGB;
			}

			const x = (xyz.value.x as unknown as number) / 100;
			const y = (xyz.value.y as unknown as number) / 100;
			const z = (xyz.value.z as unknown as number) / 100;

			let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
			let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
			let blue = x * 0.0557 + y * -0.204 + z * 1.057;

			red = adjust.applyGammaCorrection(red);
			green = adjust.applyGammaCorrection(green);
			blue = adjust.applyGammaCorrection(blue);

			const rgb: RGB = adjust.clampRGB({
				value: {
					red: brand.asByteRange(sanitize.percentile(red)),
					green: brand.asByteRange(sanitize.percentile(green)),
					blue: brand.asByteRange(sanitize.percentile(blue))
				},
				format: 'rgb'
			});

			return rgb;
		}, 'Error converting XYZ to RGB');
	}

	const colorConversionUtilities: ColorConversionUtilities = {
		cmykToHSL,
		cmykToRGB,
		convertHSL,
		convertToHSL,
		hexToHSL,
		hexToHSLWrapper,
		hexToRGB,
		hslToCMYK,
		hslToHex,
		hslToHSV,
		hslToLAB,
		hslToRGB,
		hslToSL,
		hslToSV,
		hslToXYZ,
		hsvToHSL,
		hsvToSV,
		labToHSL,
		labToRGB,
		labToXYZ,
		rgbToCMYK,
		rgbToHex,
		rgbToHSL,
		rgbToHSV,
		rgbToXYZ,
		xyzToHSL,
		xyzToLAB,
		xyzToRGB
	};

	return errors.handleSync(() => {
		return colorConversionUtilities;
	}, 'Error creating color conversion utilities sub-group.');
}
