import { labToXYZ } from './toXYZ';
import * as types from '../index';
import { stripHashFromHex } from '../utils/transforms';
import { conversionHelpers } from '../helpers/conversion';
import { defaults } from '../utils/defaults';

export function xyzToRGB(xyz: types.XYZ): types.RGB {
	try {
		xyz.x /= 100;
		xyz.y /= 100;
		xyz.z /= 100;

		let red = xyz.x * 3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986;
		let green = xyz.x * -0.9689 + xyz.y * 1.8758 + xyz.z * 0.0415;
		let blue = xyz.x * 0.0557 + xyz.y * -0.204 + xyz.z * 1.057;

		red = conversionHelpers.applyGammaCorrection(red);
		green = conversionHelpers.applyGammaCorrection(green);
		blue = conversionHelpers.applyGammaCorrection(blue);

		const rgb: types.RGB = { red, green, blue, format: 'rgb' };

		return conversionHelpers.clampRGB(rgb);
	} catch (error) {
		console.error(`xyzToRGB error: ${error}`);
		return defaults.defaultRGB();
	}
}

export function hexToRGB(hex: types.Hex): types.RGB {
	try {
		const strippedHex = stripHashFromHex(hex).hex;
		const bigint = parseInt(strippedHex, 16);

		return {
			red: (bigint >> 16) & 255,
			green: (bigint >> 8) & 255,
			blue: bigint & 255,
			format: 'rgb'
		};
	} catch (error) {
		console.error(`hexToRGB error: ${error}`);
		return defaults.defaultRGB();
	}
}

export function hslToRGB(hsl: types.HSL): types.RGB {
	try {
		const s = hsl.saturation / 100;
		const l = hsl.lightness / 100;

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		return {
			red: Math.round(
				conversionHelpers.hueToRGB(p, q, hsl.hue + 1 / 3) * 255
			),
			green: Math.round(conversionHelpers.hueToRGB(p, q, hsl.hue) * 255),
			blue: Math.round(
				conversionHelpers.hueToRGB(p, q, hsl.hue - 1 / 3) * 255
			),
			format: 'rgb'
		};
	} catch (error) {
		console.error(`hslToRGB error: ${error}`);
		return defaults.defaultRGB();
	}
}

export function hsvToRGB(hsv: types.HSV): types.RGB {
	try {
		const s = hsv.saturation / 100;
		const v = hsv.value / 100;

		const i = Math.floor(hsv.hue / 60) % 6;
		const f = hsv.hue / 60 - i;

		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);

		let rgb: types.RGB = { red: 0, green: 0, blue: 0, format: 'rgb' };

		switch (i) {
			case 0:
				rgb = { red: v, green: t, blue: p, format: 'rgb' };
				break;
			case 1:
				rgb = { red: q, green: v, blue: p, format: 'rgb' };
				break;
			case 2:
				rgb = { red: p, green: v, blue: t, format: 'rgb' };
				break;
			case 3:
				rgb = { red: p, green: q, blue: v, format: 'rgb' };
				break;
			case 4:
				rgb = { red: t, green: p, blue: v, format: 'rgb' };
				break;
			case 5:
				rgb = { red: v, green: p, blue: q, format: 'rgb' };
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
		const r = 255 * (1 - cmyk.cyan / 100) * (1 - cmyk.key / 100);
		const g = 255 * (1 - cmyk.magenta / 100) * (1 - cmyk.key / 100);
		const b = 255 * (1 - cmyk.yellow / 100) * (1 - cmyk.key / 100);

		const rgb: types.RGB = { red: r, green: g, blue: b, format: 'rgb' };

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
