import { convert } from './conversion-index';
import * as types from '../index';
import { defaults } from '../utils/defaults';

export function xyzToLAB(xyz: types.XYZ): types.LAB {
	try {
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		xyz.x = xyz.x / refX;
		xyz.y = xyz.y / refY;
		xyz.z = xyz.z / refZ;

		xyz.x =
			xyz.x > 0.008856
				? Math.pow(xyz.x, 1 / 3)
				: 7.787 * xyz.x + 16 / 116;
		xyz.y =
			xyz.y > 0.008856
				? Math.pow(xyz.y, 1 / 3)
				: 7.787 * xyz.y + 16 / 116;
		xyz.z =
			xyz.z > 0.008856
				? Math.pow(xyz.z, 1 / 3)
				: 7.787 * xyz.z + 16 / 116;

		let l = parseFloat((116 * xyz.y - 16).toFixed(2));
		let a = parseFloat((500 * (xyz.x - xyz.y)).toFixed(2));
		let b = parseFloat((200 * (xyz.y - xyz.z)).toFixed(2));

		return { l, a, b, format: 'lab' };
	} catch (error) {
		console.error(`xyzToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

export function hexToLAB(hex: types.Hex): types.LAB {
	try {
		const rgb = convert.hexToRGB(hex);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`hexToLAB() error: ${error}`);
		return defaults.defaultLAB();
	}
}

export function rgbToLAB(rgb: types.RGB): types.LAB {
	try {
		const xyz = convert.rgbToXYZ(rgb);
		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`rgbToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

export function hslToLAB(hsl: types.HSL): types.LAB {
	try {
		const rgb = convert.hslToRGB(hsl);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`hslToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

export function hsvToLAB(hsv: types.HSV): types.LAB {
	try {
		const rgb = convert.hsvToRGB(hsv);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`hsvToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

export function cmykToLAB(cmyk: types.CMYK): types.LAB {
	try {
		const rgb = convert.cmykToRGB(cmyk);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`cmykToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}
