import { convert } from './conversion-index';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { defaults } from '../utils/defaults';

function cmykToLAB(cmyk: types.CMYK): types.LAB {
	try {
		const rgb = convert.cmykToRGB(cmyk);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`cmykToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

function hexToLAB(hex: types.Hex): types.LAB {
	try {
		const rgb = convert.hexToRGB(hex);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`hexToLAB() error: ${error}`);
		return defaults.defaultLAB();
	}
}

function hslToLAB(hsl: types.HSL): types.LAB {
	try {
		const rgb = convert.hslToRGB(hsl);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`hslToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

function hsvToLAB(hsv: types.HSV): types.LAB {
	try {
		const rgb = convert.hsvToRGB(hsv);
		const xyz = convert.rgbToXYZ(rgb);

		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`hsvToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

function rgbToLAB(rgb: types.RGB): types.LAB {
	try {
		const xyz = convert.rgbToXYZ(rgb);
		return xyzToLAB(xyz);
	} catch (error) {
		console.error(`rgbToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

function xyzToLAB(xyz: types.XYZ): types.LAB {
	try {
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		xyz.value.x = xyz.value.x / refX;
		xyz.value.y = xyz.value.y / refY;
		xyz.value.z = xyz.value.z / refZ;

		xyz.value.x =
			xyz.value.x > 0.008856
				? Math.pow(xyz.value.x, 1 / 3)
				: 7.787 * xyz.value.x + 16 / 116;
		xyz.value.y =
			xyz.value.y > 0.008856
				? Math.pow(xyz.value.y, 1 / 3)
				: 7.787 * xyz.value.y + 16 / 116;
		xyz.value.z =
			xyz.value.z > 0.008856
				? Math.pow(xyz.value.z, 1 / 3)
				: 7.787 * xyz.value.z + 16 / 116;

		let l = parseFloat((116 * xyz.value.y - 16).toFixed(2));
		let a = parseFloat((500 * (xyz.value.x - xyz.value.y)).toFixed(2));
		let b = parseFloat((200 * (xyz.value.y - xyz.value.z)).toFixed(2));

		return { value: { l, a, b }, format: 'lab' };
	} catch (error) {
		console.error(`xyzToLab() error: ${error}`);
		return defaults.defaultLAB();
	}
}

export const toLAB: fnObjects.ToLAB = {
	cmykToLAB,
	hexToLAB,
	hslToLAB,
	hsvToLAB,
	rgbToLAB,
	xyzToLAB
};
