import { conversionHelpers } from '../helpers/conversion';
import * as types from '../index';
import { defaults } from '../utils/defaults';

export function cmykToXYZ(cmyk: types.CMYK): types.XYZ {
	try {
		return conversionHelpers.cmykToXYZTryCaseHelper(cmyk);
	} catch (error) {
		console.error(`cmykToXYZ error: ${error}`);
		return defaults.defaultXYZ();
	}
}

export function hexToXYZ(hex: types.Hex): types.XYZ {
	try {
		return conversionHelpers.hexToXYZTryCaseHelper(hex);
	} catch (error) {
		console.error(`hexToXYZ error: ${error}`);
		return defaults.defaultXYZ();
	}
}

export function hslToXYZ(hsl: types.HSL): types.XYZ {
	try {
		return conversionHelpers.hslToXYZTryCaseHelper(hsl);
	} catch (error) {
		console.error(`hslToXYZ error: ${error}`);
		return defaults.defaultXYZ();
	}
}

export function hsvToXYZ(hsv: types.HSV): types.XYZ {
	try {
		return conversionHelpers.hsvToXYZTryCaseHelper(hsv);
	} catch (error) {
		console.error(`hsvToXYZ error: ${error}`);
		return defaults.defaultXYZ();
	}
}

export function labToXYZ(lab: types.LAB): types.XYZ {
	try {
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		let y = (lab.value.l + 16) / 116;
		let x = lab.value.a / 500 + y;
		let z = y - lab.value.b / 200;

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
					(pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787)
			},
			format: 'xyz'
		};
	} catch (error) {
		console.error(`labToXYZ error: ${error}`);
		return defaults.defaultXYZ();
	}
}

export function rgbToXYZ(rgb: types.RGB): types.XYZ {
	try {
		rgb.value.red = rgb.value.red / 255;
		rgb.value.green = rgb.value.green / 255;
		rgb.value.blue = rgb.value.blue / 255;

		rgb.value.red =
			rgb.value.red > 0.04045
				? Math.pow((rgb.value.red + 0.055) / 1.055, 2.4)
				: rgb.value.red / 12.92;
		rgb.value.green =
			rgb.value.green > 0.04045
				? Math.pow((rgb.value.green + 0.055) / 1.055, 2.4)
				: rgb.value.green / 12.92;
		rgb.value.blue =
			rgb.value.blue > 0.04045
				? Math.pow((rgb.value.blue + 0.055) / 1.055, 2.4)
				: rgb.value.blue / 12.92;

		rgb.value.red = rgb.value.red * 100;
		rgb.value.green = rgb.value.green * 100;
		rgb.value.blue = rgb.value.blue * 100;

		return {
			value: {
				x:
					rgb.value.red * 0.4124 +
					rgb.value.green * 0.3576 +
					rgb.value.blue * 0.1805,
				y:
					rgb.value.red * 0.2126 +
					rgb.value.green * 0.7152 +
					rgb.value.blue * 0.0722,
				z:
					rgb.value.red * 0.0193 +
					rgb.value.green * 0.1192 +
					rgb.value.blue * 0.9505
			},
			format: 'xyz'
		};
	} catch (error) {
		console.error(`rgbToXYZ error: ${error}`);
		return defaults.defaultXYZ();
	}
}
