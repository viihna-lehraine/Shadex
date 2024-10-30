import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { core } from '../utils/core';
import { defaults } from '../config/defaults';
import { transform } from '../utils/transform';

export function cmykToRGB(cmyk: colors.CMYK): colors.RGB {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
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

		const rgb: colors.RGB = {
			value: { red: r, green: g, blue: b },
			format: 'rgb'
		};

		return conversionHelpers.clampRGB(rgb);
	} catch (error) {
		console.error(`cmykToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

export function hexToRGB(hex: colors.Hex): colors.RGB {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.rgb);
		}

		const clonedHex = core.clone(hex);
		const strippedHex = transform.stripHashFromHex(clonedHex).value.hex;
		const bigint = parseInt(strippedHex, 16);

		return {
			value: {
				red: (bigint >> 16) & 255,
				green: (bigint >> 8) & 255,
				blue: bigint & 255
			},
			format: 'rgb'
		};
	} catch (error) {
		console.error(`hexToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

export function hslToRGB(hsl: colors.HSL): colors.RGB {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
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
				)
			},
			format: 'rgb'
		};
	} catch (error) {
		console.error(`hslToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

export function hsvToRGB(hsv: colors.HSV): colors.RGB {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.rgb);
		}

		const clonedHSV = core.clone(hsv);

		const s = clonedHSV.value.saturation / 100;
		const v = clonedHSV.value.value / 100;

		const i = Math.floor(clonedHSV.value.hue / 60) % 6;
		const f = clonedHSV.value.hue / 60 - i;

		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);

		let rgb: colors.RGB = {
			value: { red: 0, green: 0, blue: 0 },
			format: 'rgb'
		};

		switch (i) {
			case 0:
				rgb = { value: { red: v, green: t, blue: p }, format: 'rgb' };
				break;
			case 1:
				rgb = { value: { red: q, green: v, blue: p }, format: 'rgb' };
				break;
			case 2:
				rgb = { value: { red: p, green: v, blue: t }, format: 'rgb' };
				break;
			case 3:
				rgb = { value: { red: p, green: q, blue: v }, format: 'rgb' };
				break;
			case 4:
				rgb = { value: { red: t, green: p, blue: v }, format: 'rgb' };
				break;
			case 5:
				rgb = { value: { red: v, green: p, blue: q }, format: 'rgb' };
				break;
		}

		return conversionHelpers.clampRGB(rgb);
	} catch (error) {
		console.error(`hsvToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

export function labToRGB(lab: colors.LAB): colors.RGB {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.rgb);
		}

		const xyz = conversionHelpers.labToXYZHelper(core.clone(lab));

		return xyzToRGB(xyz);
	} catch (error) {
		console.error(`labToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

export function xyzToRGB(xyz: colors.XYZ): colors.RGB {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
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

		const rgb: colors.RGB = { value: { red, green, blue }, format: 'rgb' };

		return conversionHelpers.clampRGB(rgb);
	} catch (error) {
		console.error(`xyzToRGB error: ${error}`);

		return core.clone(defaults.rgb);
	}
}

export const toRGB: fnObjects.ToRGB = {
	cmykToRGB,
	hexToRGB,
	hslToRGB,
	hsvToRGB,
	labToRGB,
	xyzToRGB
};
