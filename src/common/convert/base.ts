// File: src/common/convert/base.js

import {
	CMYK,
	Color,
	ColorSpaceExtended,
	CommonFunctionsMasterInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SL,
	SV,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../types/index.js';
import {
	applyGammaCorrection,
	clampRGB,
	hueToRGB
} from '../helpers/conversion.js';
import {
	base,
	brand,
	brandColor,
	clone,
	sanitize,
	validate
} from '../core/base.js';
import { componentToHex } from '../transform/base.js';
import { data } from '../../data/index.js';
import { defaults } from '../../data/defaults/index.js';
import { hexAlphaToNumericAlpha, stripHashFromHex } from '../utils/color.js';
import { logger } from '../../logger/index.js';

const logMode = data.mode.logging;
const mode = data.mode;

const defaultCMYKUnbranded = base.clone(defaults.colors.base.unbranded.cmyk);
const defaultHexUnbranded = base.clone(defaults.colors.base.unbranded.hex);
const defaultHSLUnbranded = base.clone(defaults.colors.base.unbranded.hsl);
const defaultHSVUnbranded = base.clone(defaults.colors.base.unbranded.hsv);
const defaultLABUnbranded = base.clone(defaults.colors.base.unbranded.lab);
const defaultRGBUnbranded = base.clone(defaults.colors.base.unbranded.rgb);
const defaultSLUnbranded = base.clone(defaults.colors.base.unbranded.sl);
const defaultSVUnbranded = base.clone(defaults.colors.base.unbranded.sv);
const defaultXYZUnbranded = base.clone(defaults.colors.base.unbranded.xyz);

const defaultCMYKBranded = brandColor.asCMYK(defaultCMYKUnbranded);
const defaultHexBranded = brandColor.asHex(defaultHexUnbranded);
const defaultHSLBranded = brandColor.asHSL(defaultHSLUnbranded);
const defaultHSVBranded = brandColor.asHSV(defaultHSVUnbranded);
const defaultLABBranded = brandColor.asLAB(defaultLABUnbranded);
const defaultRGBBranded = brandColor.asRGB(defaultRGBUnbranded);
const defaultSLBranded = brandColor.asSL(defaultSLUnbranded);
const defaultSVBranded = brandColor.asSV(defaultSVUnbranded);
const defaultXYZBranded = brandColor.asXYZ(defaultXYZUnbranded);

function cmykToHSL(cmyk: CMYK): HSL {
	try {
		if (!validate.colorValues(cmyk)) {
			if (logMode.errors)
				logger.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return defaultHSLBranded;
		}

		return rgbToHSL(cmykToRGB(base.clone(cmyk)));
	} catch (error) {
		if (logMode.errors) logger.error(`cmykToHSL() error: ${error}`);

		return defaultHSLBranded;
	}
}

function cmykToRGB(cmyk: CMYK): RGB {
	try {
		if (!validate.colorValues(cmyk)) {
			if (logMode.errors)
				logger.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return defaultRGBBranded;
		}

		const clonedCMYK = base.clone(cmyk);
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
		const alpha = cmyk.value.alpha;
		const rgb: RGB = {
			value: {
				red: brand.asByteRange(Math.round(r)),
				green: brand.asByteRange(Math.round(g)),
				blue: brand.asByteRange(Math.round(b)),
				alpha: brand.asAlphaRange(alpha)
			},
			format: 'rgb'
		};

		return clampRGB(rgb);
	} catch (error) {
		if (logMode.errors) logger.error(`cmykToRGB error: ${error}`);

		return defaultRGBBranded;
	}
}

function hexToHSL(hex: Hex): HSL {
	try {
		if (!validate.colorValues(hex)) {
			if (logMode.errors)
				logger.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return defaultHSLBranded;
		}

		return rgbToHSL(hexToRGB(base.clone(hex)));
	} catch (error) {
		if (logMode.errors) logger.error(`hexToHSL() error: ${error}`);

		return defaultHSLBranded;
	}
}

function hexToHSLWrapper(input: string | Hex): HSL {
	try {
		const clonedInput = base.clone(input);

		const hex: Hex =
			typeof clonedInput === 'string'
				? {
						value: {
							hex: brand.asHexSet(clonedInput),
							alpha: brand.asHexComponent(clonedInput.slice(-2)),
							numAlpha: brand.asAlphaRange(
								hexAlphaToNumericAlpha(clonedInput.slice(-2))
							)
						},
						format: 'hex'
					}
				: {
						...clonedInput,
						value: {
							...clonedInput.value,
							numAlpha: brand.asAlphaRange(
								hexAlphaToNumericAlpha(
									String(clonedInput.value.alpha)
								)
							)
						}
					};

		return hexToHSL(hex);
	} catch (error) {
		if (logMode.errors) {
			logger.error(`Error converting hex to HSL: ${error}`);
		}

		return defaultHSLBranded;
	}
}

function hexToRGB(hex: Hex): RGB {
	try {
		if (!validate.colorValues(hex)) {
			if (logMode.errors)
				logger.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return defaultRGBBranded;
		}

		const clonedHex = clone(hex);
		const strippedHex = stripHashFromHex(clonedHex).value.hex;
		const bigint = parseInt(strippedHex, 16);

		return {
			value: {
				red: brand.asByteRange(Math.round((bigint >> 16) & 255)),
				green: brand.asByteRange(Math.round((bigint >> 8) & 255)),
				blue: brand.asByteRange(Math.round(bigint & 255)),
				alpha: hex.value.numAlpha
			},
			format: 'rgb'
		};
	} catch (error) {
		if (logMode.errors) logger.error(`hexToRGB error: ${error}`);

		return defaultRGBBranded;
	}
}

function hslToCMYK(hsl: HSL): CMYK {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultCMYKBranded;
		}

		return rgbToCMYK(hslToRGB(clone(hsl)));
	} catch (error) {
		if (logMode.errors)
			logger.error(
				`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`
			);

		return defaultCMYKBranded;
	}
}

function hslToHex(hsl: HSL): Hex {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultHexBranded;
		}

		return rgbToHex(hslToRGB(clone(hsl)));
	} catch (error) {
		if (logMode.errors) logger.error(`hslToHex error: ${error}`);

		return defaultHexBranded;
	}
}

function hslToHSV(hsl: HSL): HSV {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultHSVBranded;
		}

		const clonedHSL = clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const value = l + s * Math.min(l, 1 - 1);
		const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

		return {
			value: {
				hue: brand.asRadial(Math.round(clonedHSL.value.hue)),
				saturation: brand.asPercentile(Math.round(newSaturation * 100)),
				value: brand.asPercentile(Math.round(value * 100)),
				alpha: brand.asAlphaRange(hsl.value.alpha)
			},
			format: 'hsv'
		};
	} catch (error) {
		if (logMode.errors) logger.error(`hslToHSV() error: ${error}`);

		return defaultHSVBranded;
	}
}

function hslToLAB(hsl: HSL): LAB {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultLABBranded;
		}

		return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
	} catch (error) {
		if (logMode.errors) logger.error(`hslToLab() error: ${error}`);

		return defaultLABBranded;
	}
}

function hslToRGB(hsl: HSL): RGB {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultRGBBranded;
		}

		const clonedHSL = clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		return {
			value: {
				red: brand.asByteRange(
					Math.round(
						hueToRGB(p, q, clonedHSL.value.hue + 1 / 3) * 255
					)
				),
				green: brand.asByteRange(
					Math.round(hueToRGB(p, q, clonedHSL.value.hue) * 255)
				),
				blue: brand.asByteRange(
					Math.round(
						hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255
					)
				),
				alpha: brand.asAlphaRange(hsl.value.alpha)
			},
			format: 'rgb'
		};
	} catch (error) {
		if (logMode.errors) logger.error(`hslToRGB error: ${error}`);

		return defaultRGBBranded;
	}
}

function hslToSL(hsl: HSL): SL {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultSLBranded;
		}

		return {
			value: {
				saturation: hsl.value.saturation,
				lightness: hsl.value.lightness,
				alpha: hsl.value.alpha
			},
			format: 'sl' as 'sl'
		};
	} catch (error) {
		if (logMode.errors)
			logger.error(`Error converting HSL to SL: ${error}`);

		return defaultSLBranded;
	}
}

function hslToSV(hsl: HSL): SV {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultSVBranded;
		}

		return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
	} catch (error) {
		if (logMode.errors)
			logger.error(`Error converting HSL to SV: ${error}`);

		return defaultSVBranded;
	}
}

function hslToXYZ(hsl: HSL): XYZ {
	try {
		if (!validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return defaultXYZBranded;
		}

		return labToXYZ(hslToLAB(clone(hsl)));
	} catch (error) {
		if (logMode.errors) logger.error(`hslToXYZ error: ${error}`);

		return defaultXYZBranded;
	}
}

function hsvToHSL(hsv: HSV): HSL {
	try {
		if (!validate.colorValues(hsv)) {
			if (logMode.errors)
				logger.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return defaultHSLBranded;
		}

		const clonedHSV = clone(hsv);
		const newSaturation =
			clonedHSV.value.value * (1 - clonedHSV.value.saturation / 100) ===
				0 || clonedHSV.value.value === 0
				? 0
				: (clonedHSV.value.value -
						clonedHSV.value.value *
							(1 - clonedHSV.value.saturation / 100)) /
					Math.min(
						clonedHSV.value.value,
						100 - clonedHSV.value.value
					);
		const lightness =
			clonedHSV.value.value * (1 - clonedHSV.value.saturation / 200);

		return {
			value: {
				hue: brand.asRadial(Math.round(clonedHSV.value.hue)),
				saturation: brand.asPercentile(Math.round(newSaturation * 100)),
				lightness: brand.asPercentile(Math.round(lightness)),
				alpha: hsv.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		if (logMode.errors) logger.error(`hsvToHSL() error: ${error}`);

		return defaultHSLBranded;
	}
}

function hsvToSV(hsv: HSV): SV {
	try {
		if (!validate.colorValues(hsv)) {
			if (logMode.errors)
				logger.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return defaultSVBranded;
		}

		return {
			value: {
				saturation: hsv.value.saturation,
				value: hsv.value.value,
				alpha: hsv.value.alpha
			},
			format: 'sv' as 'sv'
		};
	} catch (error) {
		if (logMode.errors)
			logger.error(`Error converting HSV to SV: ${error}`);

		return defaultSVBranded;
	}
}

function labToHSL(lab: LAB): HSL {
	try {
		if (!validate.colorValues(lab)) {
			if (logMode.errors)
				logger.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return defaultHSLBranded;
		}

		return rgbToHSL(labToRGB(clone(lab)));
	} catch (error) {
		if (logMode.errors) logger.error(`labToHSL() error: ${error}`);

		return defaultHSLBranded;
	}
}

function labToRGB(lab: LAB): RGB {
	try {
		if (!validate.colorValues(lab)) {
			if (logMode.errors)
				logger.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return defaultRGBBranded;
		}

		return xyzToRGB(labToXYZ(clone(lab)));
	} catch (error) {
		if (logMode.errors) logger.error(`labToRGB error: ${error}`);

		return defaultRGBBranded;
	}
}

function labToXYZ(lab: LAB): XYZ {
	try {
		if (!validate.colorValues(lab)) {
			if (logMode.errors)
				logger.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return defaultXYZBranded;
		}

		const clonedLAB = clone(lab);
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
					Math.round(
						refX *
							(pow(x, 3) > 0.008856
								? pow(x, 3)
								: (x - 16 / 116) / 7.787)
					)
				),
				y: brand.asXYZ_Y(
					Math.round(
						refY *
							(pow(y, 3) > 0.008856
								? pow(y, 3)
								: (y - 16 / 116) / 7.787)
					)
				),
				z: brand.asXYZ_Z(
					Math.round(
						refZ *
							(pow(z, 3) > 0.008856
								? pow(z, 3)
								: (z - 16 / 116) / 7.787)
					)
				),
				alpha: brand.asAlphaRange(lab.value.alpha)
			},
			format: 'xyz'
		};
	} catch (error) {
		if (logMode.errors) logger.error(`labToXYZ error: ${error}`);

		return defaultXYZBranded;
	}
}

function rgbToCMYK(rgb: RGB): CMYK {
	try {
		if (!validate.colorValues(rgb)) {
			if (logMode.errors)
				logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return defaultCMYKBranded;
		}

		const clonedRGB = clone(rgb);

		const redPrime = clonedRGB.value.red / 255;
		const greenPrime = clonedRGB.value.green / 255;
		const bluePrime = clonedRGB.value.blue / 255;

		const key = sanitize.percentile(
			Math.round(1 - Math.max(redPrime, greenPrime, bluePrime))
		);
		const cyan = sanitize.percentile(
			Math.round((1 - redPrime - key) / (1 - key) || 0)
		);
		const magenta = sanitize.percentile(
			Math.round((1 - greenPrime - key) / (1 - key) || 0)
		);
		const yellow = sanitize.percentile(
			Math.round((1 - bluePrime - key) / (1 - key) || 0)
		);
		const alpha = brand.asAlphaRange(rgb.value.alpha);
		const format: 'cmyk' = 'cmyk';

		const cmyk = { value: { cyan, magenta, yellow, key, alpha }, format };

		if (!mode.quiet)
			logger.info(
				`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`
			);

		return cmyk;
	} catch (error) {
		if (logMode.errors)
			logger.error(`Error converting RGB to CMYK: ${error}`);

		return defaultCMYKBranded;
	}
}

function rgbToHex(rgb: RGB): Hex {
	try {
		if (!validate.colorValues(rgb)) {
			if (logMode.errors)
				logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return defaultHexBranded;
		}

		const clonedRGB = clone(rgb);

		if (
			[
				clonedRGB.value.red,
				clonedRGB.value.green,
				clonedRGB.value.blue
			].some(v => isNaN(v) || v < 0 || v > 255) ||
			[clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)
		) {
			if (logMode.warnings)
				logger.warning(
					`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nA=${JSON.stringify(clonedRGB.value.alpha)}`
				);

			return {
				value: {
					hex: brand.asHexSet('#000000FF'),
					alpha: brand.asHexComponent('FF'),
					numAlpha: brand.asAlphaRange(1)
				},
				format: 'hex' as 'hex'
			};
		}

		return {
			value: {
				hex: brand.asHexSet(
					`#${componentToHex(clonedRGB.value.red)}${componentToHex(clonedRGB.value.green)}${componentToHex(clonedRGB.value.blue)}`
				),
				alpha: brand.asHexComponent(
					componentToHex(clonedRGB.value.alpha)
				),
				numAlpha: clonedRGB.value.alpha
			},
			format: 'hex' as 'hex'
		};
	} catch (error) {
		if (logMode.errors) logger.warning(`rgbToHex error: ${error}`);

		return defaultHexBranded;
	}
}

function rgbToHSL(rgb: RGB): HSL {
	try {
		if (!validate.colorValues(rgb)) {
			if (logMode.errors) {
				logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
			}
			return defaultHSLBranded;
		}

		const clonedRGB = clone(rgb);

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
				hue: brand.asRadial(Math.round(hue)),
				saturation: brand.asPercentile(Math.round(saturation * 100)),
				lightness: brand.asPercentile(Math.round(lightness * 100)),
				alpha: brand.asAlphaRange(rgb.value.alpha)
			},
			format: 'hsl'
		};
	} catch (error) {
		if (logMode.errors) {
			logger.error(`rgbToHSL() error: ${error}`);
		}

		return defaultHSLBranded;
	}
}

function rgbToHSV(rgb: RGB): HSV {
	try {
		if (!validate.colorValues(rgb)) {
			if (logMode.errors) {
				logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
			}
			return defaultHSVBranded;
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
				hue: brand.asRadial(Math.round(hue)),
				saturation: brand.asPercentile(Math.round(saturation * 100)),
				value: brand.asPercentile(Math.round(value * 100)),
				alpha: brand.asAlphaRange(rgb.value.alpha)
			},
			format: 'hsv'
		};
	} catch (error) {
		if (logMode.errors) {
			logger.error(`rgbToHSV() error: ${error}`);
		}

		return defaultHSVBranded;
	}
}

function rgbToXYZ(rgb: RGB): XYZ {
	try {
		if (!validate.colorValues(rgb)) {
			if (logMode.errors) {
				logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
			}
			return defaultXYZBranded;
		}

		const red = (rgb.value.red as unknown as number) / 255;
		const green = (rgb.value.green as unknown as number) / 255;
		const blue = (rgb.value.blue as unknown as number) / 255;

		const correctedRed =
			red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
		const correctedGreen =
			green > 0.04045
				? Math.pow((green + 0.055) / 1.055, 2.4)
				: green / 12.92;
		const correctedBlue =
			blue > 0.04045
				? Math.pow((blue + 0.055) / 1.055, 2.4)
				: blue / 12.92;

		const scaledRed = correctedRed * 100;
		const scaledGreen = correctedGreen * 100;
		const scaledBlue = correctedBlue * 100;

		return {
			value: {
				x: brand.asXYZ_X(
					Math.round(
						scaledRed * 0.4124 +
							scaledGreen * 0.3576 +
							scaledBlue * 0.1805
					)
				),
				y: brand.asXYZ_Y(
					Math.round(
						scaledRed * 0.2126 +
							scaledGreen * 0.7152 +
							scaledBlue * 0.0722
					)
				),
				z: brand.asXYZ_Z(
					Math.round(
						scaledRed * 0.0193 +
							scaledGreen * 0.1192 +
							scaledBlue * 0.9505
					)
				),
				alpha: brand.asAlphaRange(rgb.value.alpha)
			},
			format: 'xyz'
		};
	} catch (error) {
		if (logMode.errors) {
			logger.error(`rgbToXYZ error: ${error}`);
		}
		return defaultXYZBranded;
	}
}

function xyzToHSL(xyz: XYZ): HSL {
	try {
		if (!validate.colorValues(xyz)) {
			if (logMode.errors)
				logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return defaultHSLBranded;
		}

		return rgbToHSL(xyzToRGB(clone(xyz)));
	} catch (error) {
		if (logMode.errors) logger.error(`xyzToHSL() error: ${error}`);

		return defaultHSLBranded;
	}
}

function xyzToLAB(xyz: XYZ): LAB {
	try {
		if (!validate.colorValues(xyz)) {
			if (logMode.errors)
				logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return defaultLABBranded;
		}

		const clonedXYZ = clone(xyz);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		clonedXYZ.value.x = (clonedXYZ.value.x / refX) as XYZ_X;
		clonedXYZ.value.y = (clonedXYZ.value.y / refY) as XYZ_Y;
		clonedXYZ.value.z = (clonedXYZ.value.z / refZ) as XYZ_Z;

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
			parseFloat(
				(500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)
			),
			'a'
		);
		const b = sanitize.lab(
			parseFloat(
				(200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)
			),
			'b'
		);

		const lab: LAB = {
			value: {
				l: brand.asLAB_L(Math.round(l)),
				a: brand.asLAB_A(Math.round(a)),
				b: brand.asLAB_B(Math.round(b)),
				alpha: xyz.value.alpha
			},
			format: 'lab'
		};

		if (!validate.colorValues(lab)) {
			if (logMode.errors)
				logger.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return defaultLABBranded;
		}

		return lab;
	} catch (error) {
		if (logMode.errors) logger.error(`xyzToLab() error: ${error}`);

		return defaultLABBranded;
	}
}

function xyzToRGB(xyz: XYZ): RGB {
	try {
		if (!validate.colorValues(xyz)) {
			if (logMode.errors) {
				logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
			}
			return defaultRGBBranded;
		}

		const x = (xyz.value.x as unknown as number) / 100;
		const y = (xyz.value.y as unknown as number) / 100;
		const z = (xyz.value.z as unknown as number) / 100;

		let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
		let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
		let blue = x * 0.0557 + y * -0.204 + z * 1.057;

		red = applyGammaCorrection(red);
		green = applyGammaCorrection(green);
		blue = applyGammaCorrection(blue);

		const rgb: RGB = clampRGB({
			value: {
				red: brand.asByteRange(Math.round(red)),
				green: brand.asByteRange(Math.round(green)),
				blue: brand.asByteRange(Math.round(blue)),
				alpha: xyz.value.alpha
			},
			format: 'rgb'
		});

		return rgb;
	} catch (error) {
		if (logMode.errors) {
			logger.error(`xyzToRGB error: ${error}`);
		}
		return defaultRGBBranded;
	}
}

// ******** BUNDLED CONVERSION FUNCTIONS ********

function hslTo(color: HSL, colorSpace: ColorSpaceExtended): Color {
	try {
		if (!validate.colorValues(color)) {
			logger.error(`Invalid color value ${JSON.stringify(color)}`);

			return defaultRGBBranded;
		}

		const clonedColor = clone(color) as HSL;

		switch (colorSpace) {
			case 'cmyk':
				return hslToCMYK(clonedColor);
			case 'hex':
				return hslToHex(clonedColor);
			case 'hsl':
				return clone(clonedColor);
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
	} catch (error) {
		throw new Error(`hslTo() error: ${error}`);
	}
}

function toHSL(color: Exclude<Color, SL | SV>): HSL {
	try {
		if (!validate.colorValues(color)) {
			logger.error(`Invalid color value ${JSON.stringify(color)}`);

			return defaultHSLBranded;
		}

		const clonedColor = clone(color);

		switch (color.format) {
			case 'cmyk':
				return cmykToHSL(clonedColor as CMYK);
			case 'hex':
				return hexToHSL(clonedColor as Hex);
			case 'hsl':
				return clone(clonedColor as HSL);
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
	} catch (error) {
		throw new Error(`toHSL() error: ${error}`);
	}
}

export const convert: CommonFunctionsMasterInterface['convert'] = {
	hslTo,
	toHSL,
	wrappers: {
		hexToHSL: hexToHSLWrapper
	}
};
