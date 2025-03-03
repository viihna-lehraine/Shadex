import {
	ByteRange,
	CMYK,
	Hex,
	HexSet,
	HSL,
	HSV,
	LAB,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	RGB,
	SL,
	SV,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../src/types/index.js';

const mockByteRange = (value: number): ByteRange => value as ByteRange;
const mockHexSet = (value: string): HexSet => value as HexSet;
const mockLAB_A = (value: number): LAB_A => value as LAB_A;
const mockLAB_B = (value: number): LAB_B => value as LAB_B;
const mockLAB_L = (value: number): LAB_L => value as LAB_L;
const mockPercentile = (value: number): Percentile => value as Percentile;
const mockRadial = (value: number): Radial => value as Radial;
const mockXYZ_X = (value: number): XYZ_X => value as XYZ_X;
const mockXYZ_Y = (value: number): XYZ_Y => value as XYZ_Y;
const mockXYZ_Z = (value: number): XYZ_Z => value as XYZ_Z;

export const mockColors = {
	cmyk: {
		value: {
			cyan: 0 as Percentile,
			magenta: 0 as Percentile,
			yellow: 0 as Percentile,
			key: 0 as Percentile
		},
		format: 'cmyk' as 'cmyk'
	} as CMYK,
	hex: {
		value: { hex: '#FFFFFF' as HexSet },
		format: 'hex' as 'hex'
	} as Hex,
	hsl: {
		value: {
			hue: 0 as Radial,
			saturation: 100 as Percentile,
			lightness: 50 as Percentile
		},
		format: 'hsl'
	} as HSL,
	hsv: {
		value: {
			hue: 0 as Radial,
			saturation: 100 as Percentile,
			value: 100 as Percentile
		},
		format: 'hsv'
	} as HSV,
	lab: {
		value: { l: 100 as LAB_L, a: 0 as LAB_A, b: 0 as LAB_B },
		format: 'lab'
	} as LAB,
	rgb: {
		value: {
			red: 255 as ByteRange,
			green: 255 as ByteRange,
			blue: 255 as ByteRange
		},
		format: 'rgb'
	} as RGB,
	sl: {
		value: { saturation: 100 as Percentile, lightness: 50 as Percentile },
		format: 'sl'
	} as SL,
	sv: {
		value: { saturation: 100 as Percentile, value: 100 as Percentile },
		format: 'sv'
	} as SV,
	xyz: {
		value: { x: 95.047 as XYZ_X, y: 100.0 as XYZ_Y, z: 108.883 as XYZ_Z },
		format: 'xyz'
	} as XYZ
};

export {
	mockByteRange,
	mockHexSet,
	mockLAB_A,
	mockLAB_B,
	mockLAB_L,
	mockPercentile,
	mockRadial,
	mockXYZ_X,
	mockXYZ_Y,
	mockXYZ_Z
};
