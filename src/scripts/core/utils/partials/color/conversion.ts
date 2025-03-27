// File: src/scripts/core/utils/partials/color/conversion.ts

import {
	AdjustmentUtilities,
	BrandingUtilities,
	CMYK,
	Color,
	ColorConversionUtilities,
	ColorSpace,
	FormattingUtilities,
	Helpers,
	Hex,
	HSL,
	RGB,
	SanitationUtilities,
	Services,
	ValidationUtilities
} from '../../../../types/index.js';
import { defaults } from '../../../../config/index.js';

const defaultCMYK = defaults.colors.cmyk;
const defaultHex = defaults.colors.hex;
const defaultHSL = defaults.colors.hsl;
const defaultRGB = defaults.colors.rgb;

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

	function convertHSL(color: HSL, colorSpace: ColorSpace): Color {
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
				case 'rgb':
					return hslToRGB(clonedColor);
				default:
					throw new Error('Invalid color format');
			}
		}, 'Error converting HSL to color');
	}

	function convertToHSL(color: Color): HSL {
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
				case 'rgb':
					return rgbToHSL(clonedColor as RGB);
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
					red: brand.asByteRange(
						sanitize.percentile((bigint >> 16) & 255)
					),
					green: brand.asByteRange(
						sanitize.percentile((bigint >> 8) & 255)
					),
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
				[
					clonedRGB.value.red,
					clonedRGB.value.green,
					clonedRGB.value.blue
				].some(v => isNaN(v) || v < 0 || v > 255)
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
					lightness > 0.5
						? delta / (2 - max - min)
						: delta / (max + min);

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
					saturation: brand.asPercentile(
						sanitize.percentile(saturation * 100)
					),
					lightness: brand.asPercentile(
						sanitize.percentile(lightness * 100)
					)
				},
				format: 'hsl'
			};
		}, 'Error converting RGB to HSL');
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
		hslToRGB,
		rgbToCMYK,
		rgbToHex,
		rgbToHSL
	};

	return errors.handleSync(() => {
		return colorConversionUtilities;
	}, 'Error creating color conversion utilities sub-group.');
}
