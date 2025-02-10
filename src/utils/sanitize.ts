// File: utils/sanitize.js

import {
	BrandingUtilsInterface,
	ByteRange,
	ColorUtilsInterface,
	ConfigDataInterface,
	DataSetsInterface,
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
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): LAB_L | LAB_A | LAB_B {
	if (output === 'l') {
		return brand.asLAB_L(
			Math.round(Math.min(Math.max(value, 0), 100)),
			sets,
			validate
		);
	} else if (output === 'a') {
		return brand.asLAB_A(
			Math.round(Math.min(Math.max(value, -125), 125)),
			sets,
			validate
		);
	} else if (output === 'b') {
		return brand.asLAB_B(
			Math.round(Math.min(Math.max(value, -125), 125)),
			sets,
			validate
		);
	} else throw new Error('Unable to return LAB value');
}

function percentile(
	value: number,
	brand: BrandingUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): Percentile {
	const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));

	return brand.asPercentile(rawPercentile, sets, validate);
}

function radial(
	value: number,
	brand: BrandingUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): Radial {
	const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;

	return brand.asRadial(rawRadial, sets, validate);
}

function rgb(
	value: number,
	colorUtils: ColorUtilsInterface,
	brand: BrandingUtilsInterface,
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): ByteRange {
	const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));

	return colorUtils.toColorValueRange(
		rawByteRange,
		'ByteRange',
		brand,
		regex,
		sets,
		validate
	);
}

export const sanitationUtils: SanitationUtilsInterface = {
	lab,
	percentile,
	radial,
	rgb
};
