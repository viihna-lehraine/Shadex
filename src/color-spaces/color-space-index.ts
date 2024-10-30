import { toCMYK } from './toCMYK';
import { toHex } from './toHex';
import { toHSL } from './toHSL';
import { toHSV } from './toHSV';
import { toLAB } from './toLAB';
import { toRGB } from './toRGB';
import { toSL } from './toSL';
import { toSV } from './toSV';
import { toXYZ } from './toXYZ';
import * as fnObjects from '../index/fn-objects';

const cmykToHex = toHex.cmykToHex;
const cmykToHSL = toHSL.cmykToHSL;
const cmykToHSV = toHSV.cmykToHSV;
const cmykToLAB = toLAB.cmykToLAB;
const cmykToRGB = toRGB.cmykToRGB;
const cmykToSL = toSL.cmykToSL;
const cmykToSV = toSV.cmykToSV;
const cmykToXYZ = toXYZ.cmykToXYZ;

const hexToCMYK = toCMYK.hexToCMYK;
const hexToHSL = toHSL.hexToHSL;
const hexToHSV = toHSV.hexToHSV;
const hexToLAB = toLAB.hexToLAB;
const hexToRGB = toRGB.hexToRGB;
const hexToSL = toSL.hexToSL;
const hexToSV = toSV.hexToSV;
const hexToXYZ = toXYZ.hexToXYZ;

const hslToCMYK = toCMYK.hslToCMYK;
const hslToHex = toHex.hslToHex;
const hslToHSV = toHSV.hslToHSV;
const hslToLAB = toLAB.hslToLAB;
const hslToRGB = toRGB.hslToRGB;
const hslToSL = toSL.hslToSL;
const hslToSV = toSV.hslToSV;
const hslToXYZ = toXYZ.hslToXYZ;

const hsvToCMYK = toCMYK.hsvToCMYK;
const hsvToHex = toHex.hsvToHex;
const hsvToHSL = toHSL.hsvToHSL;
const hsvToLAB = toLAB.hsvToLAB;
const hsvToRGB = toRGB.hsvToRGB;
const hsvToSL = toSL.hsvToSL;
const hsvToSV = toSV.hsvToSV;
const hsvToXYZ = toXYZ.hsvToXYZ;

const labToCMYK = toCMYK.labToCMYK;
const labToHex = toHex.labToHex;
const labToHSL = toHSL.labToHSL;
const labToHSV = toHSV.labToHSV;
const labToRGB = toRGB.labToRGB;
const labToSL = toSL.labToSL;
const labToSV = toSV.labToSV;
const labToXYZ = toXYZ.labToXYZ;

const rgbToCMYK = toCMYK.rgbToCMYK;
const rgbToHex = toHex.rgbToHex;
const rgbToHSL = toHSL.rgbToHSL;
const rgbToHSV = toHSV.rgbToHSV;
const rgbToLAB = toLAB.rgbToLAB;
const rgbToSL = toSL.rgbToSL;
const rgbToSV = toSV.rgbToSV;
const rgbToXYZ = toXYZ.rgbToXYZ;

const xyzToCMYK = toCMYK.xyzToCMYK;
const xyzToHex = toHex.xyzToHex;
const xyzToHSL = toHSL.xyzToHSL;
const xyzToHSV = toHSV.xyzToHSV;
const xyzToLAB = toLAB.xyzToLAB;
const xyzToSL = toSL.xyzToSL;
const xyzToSV = toSV.xyzToSV;
const xyzToRGB = toRGB.xyzToRGB;

export const cmykTo: fnObjects.CMYKTo = {
	cmykToHex,
	cmykToHSL,
	cmykToHSV,
	cmykToLAB,
	cmykToRGB,
	cmykToSL,
	cmykToSV,
	cmykToXYZ
};

export const hexTo: fnObjects.HexTo = {
	hexToCMYK,
	hexToHSL,
	hexToHSV,
	hexToLAB,
	hexToRGB,
	hexToSL,
	hexToSV,
	hexToXYZ
};

export const hslTo: fnObjects.HSLTo = {
	hslToCMYK,
	hslToHex,
	hslToHSV,
	hslToLAB,
	hslToRGB,
	hslToSL,
	hslToSV,
	hslToXYZ
};

export const hsvTo: fnObjects.HSVTo = {
	hsvToCMYK,
	hsvToHex,
	hsvToHSL,
	hsvToLAB,
	hsvToRGB,
	hsvToSL,
	hsvToSV,
	hsvToXYZ
};

export const labTo: fnObjects.LABTo = {
	labToCMYK,
	labToHex,
	labToHSL,
	labToHSV,
	labToRGB,
	labToSL,
	labToSV,
	labToXYZ
};

export const rgbTo: fnObjects.RGBTo = {
	rgbToCMYK,
	rgbToHex,
	rgbToHSL,
	rgbToHSV,
	rgbToLAB,
	rgbToSL,
	rgbToSV,
	rgbToXYZ
};

export const xyzTo: fnObjects.XYZTo = {
	xyzToCMYK,
	xyzToHex,
	xyzToHSL,
	xyzToHSV,
	xyzToLAB,
	xyzToSL,
	xyzToSV,
	xyzToRGB
};

export const convert: fnObjects.Convert = {
	...toCMYK,
	...toHex,
	...toHSL,
	...toHSV,
	...toLAB,
	...toRGB,
	...toSL,
	...toSV,
	...toXYZ
};
