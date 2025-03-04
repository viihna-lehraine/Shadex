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
import { NumberBrand, StringBrand } from './other';

const cmykMissingProperty = {
	value: {
		cyan: 50 as Percentile,
		magenta: 30 as Percentile,
		key: 10 as Percentile
	},
	format: 'cmyk' as 'cmyk'
};

const hslMissingProperty = {
	value: {
		hue: 200 as Radial,
		lightness: 40 as Percentile
	},
	format: 'hsl' as 'hsl'
};

const hsvMissingProperty = {
	value: {
		hue: 200 as Radial,
		value: 40 as Percentile
	},
	format: 'hsv' as 'hsv'
};

const labMissingProperty = {
	value: {
		l: 75 as LAB_L,
		a: 20 as LAB_A
	},
	format: 'lab' as 'lab'
};

const rgbMissingProperty = {
	value: {
		red: 135 as ByteRange,
		blue: 51 as ByteRange
	},
	format: 'rgb' as 'rgb'
};

const slMissingProperty = {
	value: {
		lightness: 40 as Percentile
	},
	format: 'sl' as 'sl'
};

const svMissingProperty = {
	value: {
		value: 55 as Percentile
	},
	format: 'sv' as 'sv'
};

const xyzMissingProperty = {
	value: {
		x: 20 as XYZ_X,
		z: 40 as XYZ_Z
	},
	format: 'xyz' as 'xyz'
};

const colorsMissingProperty = {
	cmyk: cmykMissingProperty,
	hsl: hslMissingProperty,
	hsv: hsvMissingProperty,
	lab: labMissingProperty,
	rgb: rgbMissingProperty,
	sl: slMissingProperty,
	sv: svMissingProperty,
	xyz: xyzMissingProperty
};

// ****************************************************************
// ****************************************************************

const cmykNoFormat = {
	value: {
		cyan: 50 as Percentile,
		magenta: 30 as Percentile,
		yellow: 20 as Percentile,
		key: 10 as Percentile
	}
};

const hexNoFormat = {
	value: { hex: '#FF5733' as HexSet }
};

const hslNoFormat = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	}
};

const hsvNoFormat = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		value: 40 as Percentile
	}
};

const labNoFormat = {
	value: {
		l: 75 as LAB_L,
		a: 20 as LAB_A,
		b: 30 as LAB_B
	}
};

const rgbNoFormat = {
	value: {
		red: 135 as ByteRange,
		green: 87 as ByteRange,
		blue: 51 as ByteRange
	}
};

const slNoFormat = {
	value: {
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	}
};

const svNoFormat = {
	value: {
		saturation: 50 as Percentile,
		value: 55 as Percentile
	}
};

const xyzNoFormat = {
	value: {
		x: 20 as XYZ_X,
		y: 30 as XYZ_Y,
		z: 40 as XYZ_Z
	}
};

const colorsNoFormat = {
	cmyk: cmykNoFormat,
	hex: hexNoFormat,
	hsl: hslNoFormat,
	hsv: hsvNoFormat,
	lab: labNoFormat,
	rgb: rgbNoFormat,
	sl: slNoFormat,
	sv: svNoFormat,
	xyz: xyzNoFormat
};

// ****************************************************************
// ****************************************************************

const cmykNoValue = { format: 'cmyk' as 'cmyk' };
const hexNoValue = { format: 'hex' as 'hex' };
const hslNoValue = { format: 'hsl' as 'hsl' };
const hsvNoValue = { format: 'hsv' as 'hsv' };
const labNoValue = { format: 'lab' as 'lab' };
const rgbNoValue = { format: 'rgb' as 'rgb' };
const slNoValue = { format: 'sl' as 'sl' };
const svNoValue = { format: 'sv' as 'sv' };
const xyzNoValue = { format: 'xyz' as 'xyz' };

const colorsNoValue = {
	cmyk: cmykNoValue,
	hex: hexNoValue,
	hsl: hslNoValue,
	hsv: hsvNoValue,
	lab: labNoValue,
	rgb: rgbNoValue,
	sl: slNoValue,
	sv: svNoValue,
	xyz: xyzNoValue
};

// ****************************************************************
// ****************************************************************

const cmykOutOfRange = {
	value: {
		cyan: 145 as Percentile,
		magenta: -2 as Percentile,
		yellow: 199 as Percentile,
		key: 118 as Percentile
	},
	format: 'cmyk' as 'cmyk'
};

const hexOutOfRange = {
	value: { hex: '#GGGGGG' as HexSet },
	format: 'hex' as 'hex'
};

const hslOutOfRange = {
	value: {
		hue: 400 as Radial,
		saturation: -5 as Percentile,
		lightness: 101 as Percentile
	},
	format: 'hsl' as 'hsl'
};

const hsvOutOfRange = {
	value: {
		hue: 400 as Radial,
		saturation: -5 as Percentile,
		value: 101 as Percentile
	},
	format: 'hsv' as 'hsv'
};

const labOutOfRange = {
	value: {
		l: 280 as LAB_L,
		a: -589 as LAB_A,
		b: 375 as LAB_B
	},
	format: 'lab' as 'lab'
};

const rgbOutOfRange = {
	value: {
		red: 259 as ByteRange,
		green: -25 as ByteRange,
		blue: 300 as ByteRange
	},
	format: 'rgb' as 'rgb'
};

const slOutOfRange = {
	value: {
		saturation: -5 as Percentile,
		lightness: 101 as Percentile
	},
	format: 'sl' as 'sl'
};

const svOutOfRange = {
	value: {
		saturation: -5 as Percentile,
		value: 101 as Percentile
	},
	format: 'sv' as 'sv'
};

const xyzOutOfRange = {
	value: {
		x: 400 as XYZ_X,
		y: -157 as XYZ_Y,
		z: 559 as XYZ_Z
	},
	format: 'xyz' as 'xyz'
};

const colorsOutOfRange = {
	cmyk: cmykOutOfRange,
	hex: hexOutOfRange,
	hsl: hslOutOfRange,
	hsv: hsvOutOfRange,
	lab: labOutOfRange,
	rgb: rgbOutOfRange,
	sl: slOutOfRange,
	sv: svOutOfRange,
	xyz: xyzOutOfRange
};

// ****************************************************************
// ****************************************************************

const unbrandedCMYK = {
	value: {
		cyan: 50 as Percentile,
		magenta: 30 as Percentile,
		yellow: 20 as Percentile,
		key: 10 as Percentile
	},
	format: 'cmyk' as 'cmyk'
};

const unbrandedHex = {
	value: { hex: '#FF5733' as HexSet },
	format: 'hex' as 'hex'
};

const unbrandedHSL = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'hsl' as 'hsl'
};

const unbrandedHSV = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		value: 40 as Percentile
	},
	format: 'hsv' as 'hsv'
};

const unbrandedLAB = {
	value: {
		l: 75 as LAB_L,
		a: 20 as LAB_A,
		b: 30 as LAB_B
	},
	format: 'lab' as 'lab'
};

const unbrandedRGB = {
	value: {
		red: 135 as ByteRange,
		green: 87 as ByteRange,
		blue: 51 as ByteRange
	},
	format: 'rgb' as 'rgb'
};

const unbrandedSL = {
	value: {
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'sl' as 'sl'
};

const unbrandedSV = {
	value: {
		saturation: 50 as Percentile,
		value: 55 as Percentile
	},
	format: 'sv' as 'sv'
};

const unbrandedXYZ = {
	value: {
		x: 20 as XYZ_X,
		y: 30 as XYZ_Y,
		z: 40 as XYZ_Z
	},
	format: 'xyz' as 'xyz'
};

const unbrandedColors = {
	cmyk: unbrandedCMYK,
	hex: unbrandedHex,
	hsl: unbrandedHSL,
	hsv: unbrandedHSV,
	lab: unbrandedLAB,
	rgb: unbrandedRGB,
	sl: unbrandedSL,
	sv: unbrandedSV,
	xyz: unbrandedXYZ
};

// ****************************************************************
// ****************************************************************

const cmykUnbrandedProp = {
	value: {
		cyan: 50,
		magenta: 30 as Percentile,
		yellow: 20 as Percentile,
		key: 10 as Percentile
	},
	format: 'cmyk' as 'cmyk'
};

const hexUnbrandedProp = {
	value: { hex: '#FF5733' },
	format: 'hex' as 'hex'
};

const hslUnbrandedProp = {
	value: {
		hue: 200,
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'hsl' as 'hsl'
};

const hsvUnbrandedProp = {
	value: {
		hue: 200,
		saturation: 50 as Percentile,
		value: 40 as Percentile
	},
	format: 'hsv' as 'hsv'
};

const labUnbrandedProp = {
	value: {
		l: 75,
		a: 20 as LAB_A,
		b: 30 as LAB_B
	},
	format: 'lab' as 'lab'
};

const rgbUnbrandedProp = {
	value: {
		red: 135,
		green: 87 as ByteRange,
		blue: 51 as ByteRange
	},
	format: 'rgb' as 'rgb'
};

const slUnbrandedProp = {
	value: {
		saturation: 50,
		lightness: 40 as Percentile
	},
	format: 'sl' as 'sl'
};

const svUnbrandedProp = {
	value: {
		saturation: 50,
		value: 55 as Percentile
	},
	format: 'sv' as 'sv'
};

const xyzUnbrandedProp = {
	value: {
		x: 20,
		y: 30 as XYZ_Y,
		z: 40 as XYZ_Z
	},
	format: 'xyz' as 'xyz'
};

const colorsUnbrandedProp = {
	cmyk: cmykUnbrandedProp,
	hex: hexUnbrandedProp,
	hsl: hslUnbrandedProp,
	hsv: hsvUnbrandedProp,
	lab: labUnbrandedProp,
	rgb: rgbUnbrandedProp,
	sl: slUnbrandedProp,
	sv: svUnbrandedProp,
	xyz: xyzUnbrandedProp
};

// ****************************************************************
// ****************************************************************

const validCMYK: CMYK = {
	value: {
		cyan: 50 as Percentile,
		magenta: 30 as Percentile,
		yellow: 20 as Percentile,
		key: 10 as Percentile
	},
	format: 'cmyk' as 'cmyk'
};

const validhex: Hex = {
	value: { hex: '#FF5733' as HexSet },
	format: 'hex' as 'hex'
};

const validHSL: HSL = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'hsl' as 'hsl'
};

const validHSV: HSV = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		value: 40 as Percentile
	},
	format: 'hsv' as 'hsv'
};

const validLAB: LAB = {
	value: {
		l: 75 as LAB_L,
		a: 20 as LAB_A,
		b: 30 as LAB_B
	},
	format: 'lab' as 'lab'
};

const validRGB: RGB = {
	value: {
		red: 135 as ByteRange,
		green: 87 as ByteRange,
		blue: 51 as ByteRange
	},
	format: 'rgb' as 'rgb'
};

const validSL: SL = {
	value: {
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'sl' as 'sl'
};

const validSV: SV = {
	value: {
		saturation: 50 as Percentile,
		value: 55 as Percentile
	},
	format: 'sv' as 'sv'
};

const validXYZ: XYZ = {
	value: {
		x: 20 as XYZ_X,
		y: 30 as XYZ_Y,
		z: 40 as XYZ_Z
	},
	format: 'xyz' as 'xyz'
};

const validColors = {
	cmyk: validCMYK,
	hex: validhex,
	hsl: validHSL,
	hsv: validHSV,
	lab: validLAB,
	rgb: validRGB,
	sl: validSL,
	sv: validSV,
	xyz: validXYZ
};

// ****************************************************************
// ****************************************************************

const cmykWrongBrand = {
	value: {
		cyan: 50 as NumberBrand,
		magenta: 30 as Percentile,
		yellow: 20 as Percentile,
		key: 10 as Percentile
	},
	format: 'cmyk' as 'cmyk'
};

const hexWrongBrand = {
	value: { hex: '#FF5733' as StringBrand },
	format: 'hex' as 'hex'
};

const hslWrongBrand = {
	value: {
		hue: 200 as NumberBrand,
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'hsl' as 'hsl'
};

const hsvWrongBrand = {
	value: {
		hue: 200 as NumberBrand,
		saturation: 50 as Percentile,
		value: 40 as Percentile
	},
	format: 'hsv' as 'hsv'
};

const labWrongBrand = {
	value: {
		l: 75 as NumberBrand,
		a: 20 as LAB_A,
		b: 30 as LAB_B
	},
	format: 'lab' as 'lab'
};

const rgbWrongBrand = {
	value: {
		red: 135 as NumberBrand,
		green: 87 as ByteRange,
		blue: 51 as ByteRange
	},
	format: 'rgb' as 'rgb'
};

const slWrongBrand = {
	value: {
		saturation: 50 as NumberBrand,
		lightness: 40 as Percentile
	},
	format: 'sl' as 'sl'
};

const svWrongBrand = {
	value: {
		saturation: 50 as NumberBrand,
		value: 55 as Percentile
	},
	format: 'sv' as 'sv'
};

const xyzWrongBrand = {
	value: {
		x: 20 as NumberBrand,
		y: 30 as XYZ_Y,
		z: 40 as XYZ_Z
	},
	format: 'xyz' as 'xyz'
};

const colorsWrongBrand = {
	cmyk: cmykWrongBrand,
	hex: hexWrongBrand,
	hsl: hslWrongBrand,
	hsv: hsvWrongBrand,
	lab: labWrongBrand,
	rgb: rgbWrongBrand,
	sl: slWrongBrand,
	sv: svWrongBrand,
	xyz: xyzWrongBrand
};

// ****************************************************************
// ****************************************************************

const cmykWrongFormat = {
	value: {
		cyan: 50 as Percentile,
		magenta: 30 as Percentile,
		yellow: 20 as Percentile,
		key: 10 as Percentile
	},
	format: 'value' as StringBrand
};

const hexWrongFormat = {
	value: { hex: '#FF5733' as HexSet },
	format: 'value' as StringBrand
};

const hslWrongFormat = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'value' as StringBrand
};

const hsvWrongFormat = {
	value: {
		hue: 200 as Radial,
		saturation: 50 as Percentile,
		value: 40 as Percentile
	},
	format: 'value' as StringBrand
};

const labWrongFormat = {
	value: {
		l: 75 as LAB_L,
		a: 20 as LAB_A,
		b: 30 as LAB_B
	},
	format: 'value' as StringBrand
};

const rgbWrongFormat = {
	value: {
		red: 135 as ByteRange,
		green: 87 as ByteRange,
		blue: 51 as ByteRange
	},
	format: 'value' as StringBrand
};

const slWrongFormat = {
	value: {
		saturation: 50 as Percentile,
		lightness: 40 as Percentile
	},
	format: 'value' as StringBrand
};

const svWrongFormat = {
	value: {
		saturation: 50 as Percentile,
		value: 55 as Percentile
	},
	format: 'value' as StringBrand
};

const xyzWrongFormat = {
	value: {
		x: 20 as XYZ_X,
		y: 30 as XYZ_Y,
		z: 40 as XYZ_Z
	},
	format: 'value' as StringBrand
};

const colorsWrongFormat = {
	cmyk: cmykWrongFormat,
	hex: hexWrongFormat,
	hsl: hslWrongFormat,
	hsv: hsvWrongFormat,
	lab: labWrongFormat,
	rgb: rgbWrongFormat,
	sl: slWrongFormat,
	sv: svWrongFormat,
	xyz: xyzWrongFormat
};

// ****************************************************************
// ****************************************************************

export const colors = {
	missingProp: colorsMissingProperty,
	noFormat: colorsNoFormat,
	noValue: colorsNoValue,
	oor: colorsOutOfRange,
	unbranded: unbrandedColors,
	unbrandedProp: colorsUnbrandedProp,
	valid: validColors,
	wrongBrand: colorsWrongBrand,
	wrongFormat: colorsWrongFormat
};
