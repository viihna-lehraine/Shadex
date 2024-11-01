import { defaults } from '../config/defaults';
import { conversionHelpers } from '../helpers/conversion';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { colorUtils } from '../utils/color-utils';
import { commonUtils } from '../utils/common-utils';
import { core } from '../utils/core-utils';

function cmykToHSL(cmyk: colors.CMYK): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.hsl);
		}

		return rgbToHSL(cmykToRGB(core.clone(cmyk)));
	} catch (error) {
		console.error(`cmykToHSL() error: ${error}`);

		return core.clone(defaults.hsl);
	}
}

export function cmykToRGB(cmyk: colors.CMYK): colors.RGB {
	try {
		if (!commonUtils.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.rgb);
		}

		const clonedCMYK = core.clone(cmyk);
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
		const rgb: colors.RGB = {
			value: { red: r, green: g, blue: b, alpha },
			format: 'rgb'
		};

		return conversionHelpers.clampRGB(rgb);
	} catch (error) {
		console.error(`cmykToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

function hexToHSL(hex: colors.Hex): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(hex)) {
			console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.hsl);
		}

		return rgbToHSL(hexToRGB(core.clone(hex)));
	} catch (error) {
		console.error(`hexToHSL() error: ${error}`);

		return core.clone(defaults.hsl);
	}
}

export function hexToRGB(hex: colors.Hex): colors.RGB {
	try {
		if (!commonUtils.validateColorValues(hex)) {
			console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.rgb);
		}

		const clonedHex = core.clone(hex);
		const strippedHex = colorUtils.stripHashFromHex(clonedHex).value.hex;
		const bigint = parseInt(strippedHex, 16);

		return {
			value: {
				red: (bigint >> 16) & 255,
				green: (bigint >> 8) & 255,
				blue: bigint & 255,
				alpha: hex.value.numericAlpha
			},
			format: 'rgb'
		};
	} catch (error) {
		console.error(`hexToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

function hslToCMYK(hsl: colors.HSL): colors.CMYK {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.cmyk);
		}

		return rgbToCMYK(hslToRGB(core.clone(hsl)));
	} catch (error) {
		console.error(
			`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`
		);

		return core.clone(defaults.cmyk);
	}
}

function hslToHex(hsl: colors.HSL): colors.Hex {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.hex);
		}

		return rgbToHex(hslToRGB(core.clone(hsl)));
	} catch (error) {
		console.warn(`hslToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function hslToHSV(hsl: colors.HSL): colors.HSV {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.hsv);
		}

		const clonedHSL = core.clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const value = l + s * Math.min(l, 1 - 1);
		const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

		return {
			value: {
				hue: Math.round(clonedHSL.value.hue),
				saturation: Math.round(newSaturation * 100),
				value: Math.round(value * 100),
				alpha: hsl.value.alpha
			},
			format: 'hsv'
		};
	} catch (error) {
		console.error(`hslToHSV() error: ${error}`);

		return core.clone(defaults.hsv);
	}
}

function hslToLAB(hsl: colors.HSL): colors.LAB {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.lab);
		}

		return xyzToLAB(rgbToXYZ(hslToRGB(core.clone(hsl))));
	} catch (error) {
		console.error(`hslToLab() error: ${error}`);

		return core.clone(defaults.lab);
	}
}

export function hslToRGB(hsl: colors.HSL): colors.RGB {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.rgb);
		}

		const clonedHSL = core.clone(hsl);
		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		return {
			value: {
				red: Math.round(
					conversionHelpers.hueToRGB(
						p,
						q,
						clonedHSL.value.hue + 1 / 3
					) * 255
				),
				green: Math.round(
					conversionHelpers.hueToRGB(p, q, clonedHSL.value.hue) * 255
				),
				blue: Math.round(
					conversionHelpers.hueToRGB(
						p,
						q,
						clonedHSL.value.hue - 1 / 3
					) * 255
				),
				alpha: hsl.value.alpha
			},
			format: 'rgb'
		};
	} catch (error) {
		console.error(`hslToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

function hslToSL(hsl: colors.HSL): colors.SL {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.sl);
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
		console.error(`Error converting HSL to SL: ${error}`);

		return defaults.sl;
	}
}

function hslToSV(hsl: colors.HSL): colors.SV {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.sv);
		}

		return hsvToSV(rgbToHSV(hslToRGB(core.clone(hsl))));
	} catch (error) {
		console.error(`Error converting HSL to SV: ${error}`);

		return defaults.sv;
	}
}

function hslToXYZ(hsl: colors.HSL): colors.XYZ {
	try {
		if (!commonUtils.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.xyz);
		}

		return labToXYZ(hslToLAB(core.clone(hsl)));
	} catch (error) {
		console.error(`hslToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function hsvToHSL(hsv: colors.HSV): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.hsl);
		}

		const clonedHSV = core.clone(hsv);
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
				hue: Math.round(clonedHSV.value.hue),
				saturation: Math.round(newSaturation * 100),
				lightness: Math.round(lightness),
				alpha: hsv.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		console.error(`hsvToHSL() error: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function hsvToSV(hsv: colors.HSV): colors.SV {
	try {
		if (!commonUtils.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.sv);
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
		console.error(`Error converting HSV to SV: ${error}`);

		return defaults.sv;
	}
}

function labToHSL(lab: colors.LAB): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.hsl);
		}

		return rgbToHSL(labToRGB(core.clone(lab)));
	} catch (error) {
		console.error(`labToHSL() error: ${error}`);

		return core.clone(defaults.hsl);
	}
}

export function labToRGB(lab: colors.LAB): colors.RGB {
	try {
		if (!commonUtils.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.rgb);
		}

		return xyzToRGB(labToXYZ(core.clone(lab)));
	} catch (error) {
		console.error(`labToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

function labToXYZ(lab: colors.LAB): colors.XYZ {
	try {
		if (!commonUtils.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.xyz);
		}

		const clonedLAB = core.clone(lab);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		let y = (clonedLAB.value.l + 16) / 116;
		let x = clonedLAB.value.a / 500 + y;
		let z = y - clonedLAB.value.b / 200;

		const pow = Math.pow;

		return {
			value: {
				x:
					refX *
					(pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787),
				y:
					refY *
					(pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787),
				z:
					refZ *
					(pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787),
				alpha: lab.value.alpha
			},
			format: 'xyz'
		};
	} catch (error) {
		console.error(`labToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function rgbToCMYK(rgb: colors.RGB): colors.CMYK {
	try {
		if (!commonUtils.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.cmyk);
		}

		const clonedRGB = core.clone(rgb);

		const redPrime = clonedRGB.value.red / 255;
		const greenPrime = clonedRGB.value.green / 255;
		const bluePrime = clonedRGB.value.blue / 255;

		const key = commonUtils.sanitizePercentage(
			1 - Math.max(redPrime, greenPrime, bluePrime)
		);
		const cyan = commonUtils.sanitizePercentage(
			(1 - redPrime - key) / (1 - key) || 0
		);
		const magenta = commonUtils.sanitizePercentage(
			(1 - greenPrime - key) / (1 - key) || 0
		);
		const yellow = commonUtils.sanitizePercentage(
			(1 - bluePrime - key) / (1 - key) || 0
		);
		const alpha: number = rgb.value.alpha;
		const format: 'cmyk' = 'cmyk';

		const cmyk = { value: { cyan, magenta, yellow, key, alpha }, format };

		console.log(
			`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(core.clone(cmyk))}`
		);

		return cmyk;
	} catch (error) {
		console.error(`Error converting RGB to CMYK: ${error}`);

		return core.clone(defaults.cmyk);
	}
}

function rgbToHex(rgb: colors.RGB): colors.Hex {
	try {
		if (!commonUtils.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.hex);
		}

		const clonedRGB = core.clone(rgb);

		if (
			[
				clonedRGB.value.red,
				clonedRGB.value.green,
				clonedRGB.value.blue
			].some(v => isNaN(v) || v < 0 || v > 255) ||
			[clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)
		) {
			console.warn(
				`Invalid RGB values: R=${JSON.stringify(clonedRGB.value.red)}, G=${JSON.stringify(clonedRGB.value.green)}, B=${JSON.stringify(clonedRGB.value.blue)}, A=${JSON.stringify(clonedRGB.value.alpha)}`
			);

			return {
				value: {
					hex: '#000000FF',
					alpha: 'FF',
					numericAlpha: 1
				},
				format: 'hex' as 'hex'
			};
		}

		return {
			value: {
				hex: `#${colorUtils.componentToHex(clonedRGB.value.red)}${colorUtils.componentToHex(clonedRGB.value.green)}${colorUtils.componentToHex(clonedRGB.value.blue)}`,
				alpha: colorUtils.componentToHex(clonedRGB.value.alpha),
				numericAlpha: clonedRGB.value.alpha
			},
			format: 'hex' as 'hex'
		};
	} catch (error) {
		console.warn(`rgbToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function rgbToHSL(rgb: colors.RGB): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.hsl);
		}

		const clonedRGB = core.clone(rgb);

		clonedRGB.value.red /= 255;
		clonedRGB.value.green /= 255;
		clonedRGB.value.blue /= 255;

		const max = Math.max(
			clonedRGB.value.red,
			clonedRGB.value.green,
			clonedRGB.value.blue
		);
		const min = Math.min(
			clonedRGB.value.red,
			clonedRGB.value.green,
			clonedRGB.value.blue
		);

		let hue = 0,
			saturation = 0,
			lightness = (max + min) / 2;

		if (max !== min) {
			const delta = max - min;

			saturation =
				lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

			switch (max) {
				case clonedRGB.value.red:
					hue =
						(clonedRGB.value.green - clonedRGB.value.blue) / delta +
						(clonedRGB.value.green < clonedRGB.value.blue ? 6 : 0);
					break;
				case clonedRGB.value.green:
					hue =
						(clonedRGB.value.blue - clonedRGB.value.red) / delta +
						2;
					break;
				case clonedRGB.value.blue:
					hue =
						(clonedRGB.value.red - clonedRGB.value.green) / delta +
						4;
					break;
			}
			hue *= 60;
		}

		return {
			value: {
				hue: Math.round(hue),
				saturation: Math.round(saturation * 100),
				lightness: Math.round(lightness * 100),
				alpha: rgb.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		console.error(`rgbToHSL() error: ${error}`);

		return core.clone(defaults.hsl);
	}
}

function rgbToHSV(rgb: colors.RGB): colors.HSV {
	try {
		if (!commonUtils.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.hsv);
		}

		const clonedRGB = core.clone(rgb);

		clonedRGB.value.red /= 255;
		clonedRGB.value.green /= 255;
		clonedRGB.value.blue /= 255;

		const max = Math.max(
			clonedRGB.value.red,
			clonedRGB.value.green,
			clonedRGB.value.blue
		);
		const min = Math.min(
			clonedRGB.value.red,
			clonedRGB.value.green,
			clonedRGB.value.blue
		);
		const delta = max - min;

		let hue = 0;

		const value = max;
		const saturation = max === 0 ? 0 : delta / max;

		if (max !== min) {
			switch (max) {
				case clonedRGB.value.red:
					hue =
						(clonedRGB.value.green - clonedRGB.value.blue) / delta +
						(clonedRGB.value.green < clonedRGB.value.blue ? 6 : 0);
					break;
				case clonedRGB.value.green:
					hue =
						(clonedRGB.value.blue - clonedRGB.value.red) / delta +
						2;
					break;
				case clonedRGB.value.blue:
					hue =
						(clonedRGB.value.red - clonedRGB.value.green) / delta +
						4;
					break;
			}

			hue *= 60;
		}

		return {
			value: {
				hue: Math.round(hue),
				saturation: Math.round(saturation * 100),
				value: Math.round(value * 100),
				alpha: rgb.value.alpha
			},
			format: 'hsv'
		};
	} catch (error) {
		console.error(`rgbToHSV() error: ${error}`);

		return core.clone(defaults.hsv);
	}
}

function rgbToXYZ(rgb: colors.RGB): colors.XYZ {
	try {
		if (!commonUtils.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.xyz);
		}

		const clonedRGB = core.clone(rgb);

		clonedRGB.value.red = clonedRGB.value.red / 255;
		clonedRGB.value.green = clonedRGB.value.green / 255;
		clonedRGB.value.blue = clonedRGB.value.blue / 255;

		clonedRGB.value.red =
			clonedRGB.value.red > 0.04045
				? Math.pow((clonedRGB.value.red + 0.055) / 1.055, 2.4)
				: clonedRGB.value.red / 12.92;
		clonedRGB.value.green =
			clonedRGB.value.green > 0.04045
				? Math.pow((clonedRGB.value.green + 0.055) / 1.055, 2.4)
				: clonedRGB.value.green / 12.92;
		clonedRGB.value.blue =
			clonedRGB.value.blue > 0.04045
				? Math.pow((clonedRGB.value.blue + 0.055) / 1.055, 2.4)
				: clonedRGB.value.blue / 12.92;

		clonedRGB.value.red = clonedRGB.value.red * 100;
		clonedRGB.value.green = clonedRGB.value.green * 100;
		clonedRGB.value.blue = clonedRGB.value.blue * 100;

		return {
			value: {
				x:
					clonedRGB.value.red * 0.4124 +
					clonedRGB.value.green * 0.3576 +
					clonedRGB.value.blue * 0.1805,
				y:
					clonedRGB.value.red * 0.2126 +
					clonedRGB.value.green * 0.7152 +
					clonedRGB.value.blue * 0.0722,
				z:
					clonedRGB.value.red * 0.0193 +
					clonedRGB.value.green * 0.1192 +
					clonedRGB.value.blue * 0.9505,
				alpha: rgb.value.alpha
			},
			format: 'xyz'
		};
	} catch (error) {
		console.error(`rgbToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function xyzToLAB(xyz: colors.XYZ): colors.LAB {
	try {
		if (!commonUtils.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.lab);
		}

		const clonedXYZ = core.clone(xyz);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		clonedXYZ.value.x = clonedXYZ.value.x / refX;
		clonedXYZ.value.y = clonedXYZ.value.y / refY;
		clonedXYZ.value.z = clonedXYZ.value.z / refZ;

		clonedXYZ.value.x =
			clonedXYZ.value.x > 0.008856
				? Math.pow(clonedXYZ.value.x, 1 / 3)
				: 7.787 * clonedXYZ.value.x + 16 / 116;
		clonedXYZ.value.y =
			clonedXYZ.value.y > 0.008856
				? Math.pow(clonedXYZ.value.y, 1 / 3)
				: 7.787 * clonedXYZ.value.y + 16 / 116;
		clonedXYZ.value.z =
			clonedXYZ.value.z > 0.008856
				? Math.pow(clonedXYZ.value.z, 1 / 3)
				: 7.787 * clonedXYZ.value.z + 16 / 116;

		const l = commonUtils.sanitizePercentage(
			parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2))
		);
		const a = commonUtils.sanitizeLAB(
			parseFloat(
				(500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)
			)
		);
		const b = commonUtils.sanitizeLAB(
			parseFloat(
				(200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)
			)
		);
		const lab: colors.LAB = {
			value: { l, a, b, alpha: xyz.value.alpha },
			format: 'lab'
		};

		if (!commonUtils.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.lab);
		}

		return lab;
	} catch (error) {
		console.error(`xyzToLab() error: ${error}`);

		return core.clone(defaults.lab);
	}
}

function xyzToHSL(xyz: colors.XYZ): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.hsl);
		}

		return rgbToHSL(xyzToRGB(core.clone(xyz)));
	} catch (error) {
		console.error(`xyzToHSL() error: ${error}`);

		return core.clone(defaults.hsl);
	}
}

export function xyzToRGB(xyz: colors.XYZ): colors.RGB {
	try {
		if (!commonUtils.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.rgb);
		}

		const clonedXYZ = core.clone(xyz);

		clonedXYZ.value.x /= 100;
		clonedXYZ.value.y /= 100;
		clonedXYZ.value.z /= 100;

		let red =
			clonedXYZ.value.x * 3.2406 +
			clonedXYZ.value.y * -1.5372 +
			clonedXYZ.value.z * -0.4986;
		let green =
			clonedXYZ.value.x * -0.9689 +
			clonedXYZ.value.y * 1.8758 +
			clonedXYZ.value.z * 0.0415;
		let blue =
			clonedXYZ.value.x * 0.0557 +
			clonedXYZ.value.y * -0.204 +
			clonedXYZ.value.z * 1.057;

		red = conversionHelpers.applyGammaCorrection(red);
		green = conversionHelpers.applyGammaCorrection(green);
		blue = conversionHelpers.applyGammaCorrection(blue);

		return conversionHelpers.clampRGB({
			value: { red, green, blue, alpha: xyz.value.alpha },
			format: 'rgb'
		});
	} catch (error) {
		console.error(`xyzToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

export const convert: fnObjects.Convert = {
	cmykToHSL,
	hexToHSL,
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
	labToXYZ,
	rgbToCMYK,
	rgbToHex,
	rgbToHSL,
	rgbToHSV,
	rgbToXYZ,
	xyzToHSL,
	xyzToLAB
};

export function hslTo(
	color: colors.HSL,
	colorSpace: colors.ColorSpaceExtended
): colors.Color {
	try {
		if (!commonUtils.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.rgb);
		}

		const clonedColor = core.clone(color) as colors.HSL;

		switch (colorSpace) {
			case 'cmyk':
				return hslToCMYK(clonedColor);
			case 'hex':
				return hslToHex(clonedColor);
			case 'hsl':
				return core.clone(clonedColor);
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

export function toHSL(
	color: Exclude<colors.Color, colors.SL | colors.SV>
): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return core.clone(defaults.hsl);
		}

		const clonedColor = core.clone(color);

		switch (color.format) {
			case 'cmyk':
				return cmykToHSL(clonedColor as colors.CMYK);
			case 'hex':
				return hexToHSL(clonedColor as colors.Hex);
			case 'hsl':
				return core.clone(clonedColor as colors.HSL);
			case 'hsv':
				return hsvToHSL(clonedColor as colors.HSV);
			case 'lab':
				return labToHSL(clonedColor as colors.LAB);
			case 'rgb':
				return rgbToHSL(clonedColor as colors.RGB);
			case 'xyz':
				return xyzToHSL(clonedColor as colors.XYZ);
			default:
				throw new Error('Invalid color format');
		}
	} catch (error) {
		throw new Error(`toHSL() error: ${error}`);
	}
}
