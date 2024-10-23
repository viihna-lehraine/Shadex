import { labToXYZ } from './toXYZ';
import * as types from '../index';
import { stripHashFromHex } from '../utils/transforms';
import { conversionHelpers } from '../helpers/conversion';
import { defaults } from '../utils/defaults';

export function xyzToRGB(xyz: types.XYZ): types.RGB {
	try {
		xyz.value.x /= 100;
		xyz.value.y /= 100;
		xyz.value.z /= 100;

		let red =
			xyz.value.x * 3.2406 +
			xyz.value.y * -1.5372 +
			xyz.value.z * -0.4986;
		let green =
			xyz.value.x * -0.9689 + xyz.value.y * 1.8758 + xyz.value.z * 0.0415;
		let blue =
			xyz.value.x * 0.0557 + xyz.value.y * -0.204 + xyz.value.z * 1.057;

		red = conversionHelpers.applyGammaCorrection(red);
		green = conversionHelpers.applyGammaCorrection(green);
		blue = conversionHelpers.applyGammaCorrection(blue);

		const rgb: types.RGB = { value: { red, green, blue }, format: 'rgb' };

		return conversionHelpers.clampRGB(rgb);
	} catch (error) {
		console.error(`xyzToRGB error: ${error}`);
		return defaults.defaultRGB();
	}
}

export function hexToRGB(hex: types.Hex): types.RGB {
	try {
		const strippedHex = stripHashFromHex(hex).value.hex;
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
		return defaults.defaultRGB();
	}
}

export function hslToRGB(hsl: types.HSL): types.RGB {
	try {
		const s = hsl.value.saturation / 100;
		const l = hsl.value.lightness / 100;

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		return {
			value: {
				red: Math.round(
					conversionHelpers.hueToRGB(p, q, hsl.value.hue + 1 / 3) *
						255
				),
				green: Math.round(
					conversionHelpers.hueToRGB(p, q, hsl.value.hue) * 255
				),
				blue: Math.round(
					conversionHelpers.hueToRGB(p, q, hsl.value.hue - 1 / 3) *
						255
				)
			},
			format: 'rgb'
		};
	} catch (error) {
		console.error(`hslToRGB error: ${error}`);
		return defaults.defaultRGB();
	}
}

export function hsvToRGB(hsv: types.HSV): types.RGB {
	try {
		const s = hsv.value.saturation / 100;
		const v = hsv.value.value / 100;

		const i = Math.floor(hsv.value.hue / 60) % 6;
		const f = hsv.value.hue / 60 - i;

		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);

		let rgb: types.RGB = {
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
		return defaults.defaultRGB();
	}
}

export function cmykToRGB(cmyk: types.CMYK): types.RGB {
	try {
		const r =
			255 * (1 - cmyk.value.cyan / 100) * (1 - cmyk.value.key / 100);
		const g =
			255 * (1 - cmyk.value.magenta / 100) * (1 - cmyk.value.key / 100);
		const b =
			255 * (1 - cmyk.value.yellow / 100) * (1 - cmyk.value.key / 100);

		const rgb: types.RGB = {
			value: { red: r, green: g, blue: b },
			format: 'rgb'
		};

		return conversionHelpers.clampRGB(rgb);
	} catch (error) {
		console.error(`cmykToRGB error: ${error}`);
		return defaults.defaultRGB();
	}
}

export function labToRGB(lab: types.LAB): types.RGB {
	try {
		const xyz = labToXYZ(lab);
		return xyzToRGB(xyz);
	} catch (error) {
		console.error(`labToRGB error: ${error}`);
		return defaults.defaultRGB();
	}
}
