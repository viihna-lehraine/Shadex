// File: utils/sanitize.js

import {
	ByteRange,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	SanitationUtilsInterface,
	UtilitiesInterface
} from '../types/index.js';

function lab(
	value: number,
	output: 'l' | 'a' | 'b',
	utils: UtilitiesInterface
): LAB_L | LAB_A | LAB_B {
	if (output === 'l') {
		return utils.brand.asLAB_L(
			Math.round(Math.min(Math.max(value, 0), 100)),
			utils
		);
	} else if (output === 'a') {
		return utils.brand.asLAB_A(
			Math.round(Math.min(Math.max(value, -125), 125)),
			utils
		);
	} else if (output === 'b') {
		return utils.brand.asLAB_B(
			Math.round(Math.min(Math.max(value, -125), 125)),
			utils
		);
	} else throw new Error('Unable to return LAB value');
}

function percentile(value: number, utils: UtilitiesInterface): Percentile {
	const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));

	return utils.brand.asPercentile(rawPercentile, utils);
}

function radial(value: number, utils: UtilitiesInterface): Radial {
	const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;

	return utils.brand.asRadial(rawRadial, utils);
}

function rgb(value: number, utils: UtilitiesInterface): ByteRange {
	const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));

	return utils.color.toColorValueRange(rawByteRange, 'ByteRange', utils);
}

export const sanitationUtils: SanitationUtilsInterface = {
	lab,
	percentile,
	radial,
	rgb
};
