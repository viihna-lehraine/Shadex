// File: io/parse/colorValue.js

import { CMYK, Hex, HSL, HSV, LAB, RGB, XYZ } from '../../types/index.js';
import { asColorString } from './color.js';

function asCMYKValue(colorString: string): CMYK['value'] {
	const parsed = asColorString('cmyk', colorString);

	if (parsed && parsed.format === 'cmyk') {
		return parsed.value as CMYK['value'];
	}

	throw new Error(`Invalid CMYK color string: ${colorString}`);
}

function asHexValue(colorValue: string): Hex['value'] {
	const parsed = asColorString('hex', colorValue);

	if (parsed && parsed.format === 'hex') {
		return parsed.value as Hex['value'];
	}

	throw new Error(`Invalid Hex color value: ${colorValue}`);
}

function asHSLValue(colorValue: string): HSL['value'] {
	const parsed = asColorString('hsl', colorValue);

	if (parsed && parsed.format === 'hsl') {
		return parsed.value as HSL['value'];
	}

	throw new Error(`Invalid HSL color value: ${colorValue}`);
}

function asHSVValue(colorValue: string): HSV['value'] {
	const parsed = asColorString('hsv', colorValue);

	if (parsed && parsed.format === 'hsv') {
		return parsed.value as HSV['value'];
	}

	throw new Error(`Invalid HSV color value: ${colorValue}`);
}

function asLABValue(colorValue: string): LAB['value'] {
	const parsed = asColorString('lab', colorValue);

	if (parsed && parsed.format === 'lab') {
		return parsed.value as LAB['value'];
	}

	throw new Error(`Invalid LAB color value: ${colorValue}`);
}

function asRGBValue(colorValue: string): RGB['value'] {
	const parsed = asColorString('rgb', colorValue);

	if (parsed && parsed.format === 'rgb') {
		return parsed.value as RGB['value'];
	}

	throw new Error(`Invalid RGB color value: ${colorValue}`);
}

function asXYZValue(colorValue: string): XYZ['value'] {
	const parsed = asColorString('xyz', colorValue);

	if (parsed && parsed.format === 'xyz') {
		return parsed.value as XYZ['value'];
	}

	throw new Error(`Invalid XYZ color value: ${colorValue}`);
}

export const asColorValue = {
	cmyk: asCMYKValue,
	hex: asHexValue,
	hsl: asHSLValue,
	hsv: asHSVValue,
	lab: asLABValue,
	rgb: asRGBValue,
	xyz: asXYZValue
};
