// File: common/core/sanitize.js

import {
	ByteRange,
	LAB_L,
	LAB_A,
	LAB_B,
	Percentile,
	Radial
} from '../../types/index.js';

function lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B {
	if (output === 'l') {
		return brand.asLAB_L(Math.round(Math.min(Math.max(value, 0), 100)));
	} else if (output === 'a') {
		return brand.asLAB_A(Math.round(Math.min(Math.max(value, -125), 125)));
	} else if (output === 'b') {
		return brand.asLAB_B(Math.round(Math.min(Math.max(value, -125), 125)));
	} else throw new Error('Unable to return LAB value');
}

function percentile(value: number): Percentile {
	const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));

	return brand.asPercentile(rawPercentile);
}

function radial(value: number): Radial {
	const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;

	return brand.asRadial(rawRadial);
}

function rgb(value: number): ByteRange {
	const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));

	return toColorValueRange(rawByteRange, 'ByteRange');
}

export const sanitize = {
	lab,
	percentile,
	radial,
	rgb
};
