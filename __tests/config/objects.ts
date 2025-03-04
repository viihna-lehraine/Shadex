import {
	ByteRange,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	Palette,
	Percentile,
	Radial,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../src/types/index.js';

const objectMissingProp = { a: 'a', b: 'b' };
const objectNullKey = { a: 1, b: null, c: 3 };
const objectNumericKeys = { a: 1, b: 2, c: 3 };
const objectMixedKeys = { a: 1, b: 'b', c: 3 };
const objectStringKeys = { a: 'a', b: 'b', c: 'c' };
const plainObject = { a: 'a', b: 'b' };
const objectWithFormat = { a: 'a', format: 'format' };
const objectWithValue = { a: 'a', value: 'value' };

// ****************************************************************
// ****************************************************************

const objectCMYKFormat = { value: 'value', format: 'cmyk' as 'cmyk' };
const objectHexFormat = { value: 'value', format: 'hex' as 'hex' };
const objectHSLFormat = { value: 'value', format: 'hsl' as 'hsl' };
const objectHSVFormat = { value: 'value', format: 'hsv' as 'hsv' };
const objectLABFormat = { value: 'value', format: 'lab' as 'lab' };
const objectRGBFormat = { value: 'value', format: 'rgb' as 'rgb' };
const objectSLFormat = { value: 'value', format: 'sl' as 'sl' };
const objectSVFormat = { value: 'value', format: 'sv' as 'sv' };
const objectXYZFormat = { value: 'value', format: 'xyz' as 'xyz' };

const objectsWithFormat = {
	cmyk: objectCMYKFormat,
	hex: objectHexFormat,
	hsl: objectHSLFormat,
	hsv: objectHSVFormat,
	lab: objectLABFormat,
	rgb: objectRGBFormat,
	sl: objectSLFormat,
	sv: objectSVFormat,
	xyz: objectXYZFormat
};

const validPalette: Palette = {
	id: 'palette-1',
	items: [
		{
			itemID: 1,
			colors: {
				cmyk: {
					cyan: 50 as Percentile,
					magenta: 50 as Percentile,
					yellow: 50 as Percentile,
					key: 50 as Percentile
				},
				hex: { hex: '#ff0000' as HexSet },
				hsl: {
					hue: 0 as Radial,
					saturation: 100 as Percentile,
					lightness: 50 as Percentile
				},
				hsv: {
					hue: 0 as Radial,
					saturation: 100 as Percentile,
					value: 100 as Percentile
				},
				lab: { l: 50 as LAB_L, a: 20 as LAB_A, b: 30 as LAB_B },
				rgb: {
					red: 255 as ByteRange,
					green: 0 as ByteRange,
					blue: 0 as ByteRange
				},
				xyz: { x: 0.412 as XYZ_X, y: 0.212 as XYZ_Y, z: 0.019 as XYZ_Z }
			},
			css: {
				cmyk: '50%, 50%, 50%, 50%',
				hex: '#ff0000',
				hsl: 'hsl(0, 100%, 50%)',
				hsv: 'hsv(0, 100%, 100%)',
				lab: 'lab(50, 20, 30)',
				rgb: 'rgb(255, 0, 0)',
				xyz: 'xyz(0.412, 0.212, 0.019)'
			}
		}
	],
	metadata: {
		columnCount: 5,
		limitDark: false,
		limitGray: false,
		limitLight: false,
		timestamp: '2025-03-04T12:00:00Z',
		type: 'analogous'
	}
};

// ****************************************************************
// ****************************************************************

export const objects = {
	missingProp: objectMissingProp,
	mixedKeys: objectMixedKeys,
	nullKey: objectNullKey,
	numKeys: objectNumericKeys,
	stringKeys: objectStringKeys,
	plain: plainObject,
	withFormat: objectsWithFormat,
	withValue: objectWithValue
};

export { validPalette };
