// File: common/utils/sanitize.js

import {
	ByteRange,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	SanitationUtilsInterface,
	UtilitiesInterface
} from '../../types/index.js';

export function createSanitationUtils(
	utils: UtilitiesInterface
): SanitationUtilsInterface {
	return {
		lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B {
			if (output === 'l') {
				return utils.brand.asLAB_L(
					Math.round(Math.min(Math.max(value, 0), 100))
				);
			} else if (output === 'a') {
				return utils.brand.asLAB_A(
					Math.round(Math.min(Math.max(value, -125), 125))
				);
			} else if (output === 'b') {
				return utils.brand.asLAB_B(
					Math.round(Math.min(Math.max(value, -125), 125))
				);
			} else throw new Error('Unable to return LAB value');
		},
		percentile(value: number): Percentile {
			const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));

			return utils.brand.asPercentile(rawPercentile);
		},
		radial(value: number): Radial {
			const rawRadial =
				Math.round(Math.min(Math.max(value, 0), 360)) & 360;

			return utils.brand.asRadial(rawRadial);
		},
		rgb(value: number): ByteRange {
			const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));

			return utils.color.toColorValueRange(rawByteRange, 'ByteRange');
		}
	};
}
