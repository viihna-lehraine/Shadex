// File: utils/sanitize.js

import {
	BrandingUtilsInterface,
	ByteRange,
	ColorUtilsInterface,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	SanitationUtilsInterface,
	ValidationUtilsInterface
} from '../types/index.js';

function lab(
	value: number,
	output: 'l' | 'a' | 'b',
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): LAB_L | LAB_A | LAB_B {
	if (output === 'l') {
		return brand.asLAB_L(
			Math.round(Math.min(Math.max(value, 0), 100)),
			validate
		);
	} else if (output === 'a') {
		return brand.asLAB_A(
			Math.round(Math.min(Math.max(value, -125), 125)),
			validate
		);
	} else if (output === 'b') {
		return brand.asLAB_B(
			Math.round(Math.min(Math.max(value, -125), 125)),
			validate
		);
	} else throw new Error('Unable to return LAB value');
}

function percentile(
	value: number,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): Percentile {
	const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));

	return brand.asPercentile(rawPercentile, validate);
}

function radial(
	value: number,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): Radial {
	const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;

	return brand.asRadial(rawRadial, validate);
}

function rgb(
	value: number,
	colorUtils: ColorUtilsInterface,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): ByteRange {
	const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));

	return colorUtils.toColorValueRange(
		rawByteRange,
		'ByteRange',
		brand,
		validate
	);
}

export const sanitationUtils: SanitationUtilsInterface = {
	lab,
	percentile,
	radial,
	rgb
};
