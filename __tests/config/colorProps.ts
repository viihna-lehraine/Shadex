import {
	ByteRange,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../src/types/index.js';
import { NumberBrand, StringBrand } from './other';

const byteRangeOutOfRange: ByteRange = 256 as ByteRange;
const hexSetInvalid: HexSet = '#GHIJKL' as HexSet;
const lab_AOutOfRange: LAB_A = 422 as LAB_A;
const lab_BOutOfRange: LAB_B = 422 as LAB_B;
const lab_LOutOfRange: LAB_L = 422 as LAB_L;
const percentileOutOfRange: Percentile = 188 as Percentile;
const radialOutOfRange: Radial = 370 as Radial;
const xyz_XOutOfRange: XYZ_X = 422 as XYZ_X;
const xyz_YOutOfRange: XYZ_Y = 422 as XYZ_Y;
const xyz_ZOutOfRange: XYZ_Z = 422 as XYZ_Z;

const propsOutOfRange = {
	byteRange: byteRangeOutOfRange,
	hexSet: hexSetInvalid,
	lab_A: lab_AOutOfRange,
	lab_B: lab_BOutOfRange,
	lab_L: lab_LOutOfRange,
	percentile: percentileOutOfRange,
	radial: radialOutOfRange,
	xyz_X: xyz_XOutOfRange,
	xyz_Y: xyz_YOutOfRange,
	xyz_Z: xyz_ZOutOfRange
};

// ****************************************************************
// ****************************************************************

const unbrandedByteRange = 100;
const unbrandedHexSet = '#ABCDEF';
const unbrandedLAB_A = 20;
const unbrandedLAB_B = 20;
const unbrandedLAB_L = 20;
const unbrandedPercentile = 20;
const unbrandedRadial = 20;
const unbrandedXYZ_X = 20;
const unbrandedYYZ_Y = 20;
const unbrandedZYZ_Z = 20;

const unbrandedProps = {
	ByteRange: unbrandedByteRange,
	HexSet: unbrandedHexSet,
	LAB_A: unbrandedLAB_A,
	LAB_B: unbrandedLAB_B,
	LAB_L: unbrandedLAB_L,
	Percentile: unbrandedPercentile,
	Radial: unbrandedRadial,
	XYZ_X: unbrandedXYZ_X,
	XYZ_Y: unbrandedYYZ_Y,
	XYZ_Z: unbrandedZYZ_Z
};

// ****************************************************************
// ****************************************************************

const validByteRange: ByteRange = 20 as ByteRange;
const validHexSet: HexSet = '#ABCDEF' as HexSet;
const validLAB_A: LAB_A = 20 as LAB_A;
const validLAB_B: LAB_B = 20 as LAB_B;
const validLAB_L: LAB_L = 20 as LAB_L;
const validPercentile: Percentile = 20 as Percentile;
const validRadial: Radial = 20 as Radial;
const validXYZ_X: XYZ_X = 20 as XYZ_X;
const validXYZ_Y: XYZ_Y = 20 as XYZ_Y;
const validXYZ_Z: XYZ_Z = 20 as XYZ_Z;

const validColorProps = {
	byteRange: validByteRange,
	hexSet: validHexSet,
	lab_A: validLAB_A,
	lab_B: validLAB_B,
	lab_L: validLAB_L,
	percentile: validPercentile,
	radial: validRadial,
	xyz_X: validXYZ_X,
	xyz_Y: validXYZ_Y,
	xyz_Z: validXYZ_Z
};

// ****************************************************************
// ****************************************************************

const byteRangeWrongBrand = 20 as NumberBrand;
const hexSetWrongBrand = '#ABCDEF' as StringBrand;
const lab_AWrongBrand = 20 as NumberBrand;
const lab_BWrongBrand = 20 as NumberBrand;
const lab_LWrongBrand = 20 as NumberBrand;
const percentileWrongBrand = 20 as NumberBrand;
const radialWrongBrand = 20 as NumberBrand;
const xyz_XWrongBrand = 20 as NumberBrand;
const xyz_YWrongBrand = 20 as NumberBrand;
const xyz_ZWrongBrand = 20 as NumberBrand;

const propsWrongBrand = {
	byteRange: byteRangeWrongBrand,
	hexSet: hexSetWrongBrand,
	lab_A: lab_AWrongBrand,
	lab_B: lab_BWrongBrand,
	lab_L: lab_LWrongBrand,
	percentile: percentileWrongBrand,
	radial: radialWrongBrand,
	xyz_X: xyz_XWrongBrand,
	xyz_Y: xyz_YWrongBrand,
	xyz_Z: xyz_ZWrongBrand
};

// ****************************************************************
// ****************************************************************

export const colorProps = {
	oor: propsOutOfRange,
	unbranded: unbrandedProps,
	valid: validColorProps,
	wrongBrand: propsWrongBrand
};
