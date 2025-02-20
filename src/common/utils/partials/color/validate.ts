// File: common/utils/partials/color/validate.ts

import {
	ColorValidationUtils,
	RangeKeyMap,
	Utilities
} from '../../../../types/index.js';

export const colorValidationUtilsFactory = (
	utils: Utilities
): ColorValidationUtils =>
	({
		toColorValueRange<T extends keyof RangeKeyMap>(
			value: string | number,
			rangeKey: T
		): RangeKeyMap[T] {
			utils.validate.range(value, rangeKey);
			if (rangeKey === 'HexSet') {
				return utils.brand.asHexSet(
					value as string
				) as unknown as RangeKeyMap[T];
			}
			return utils.brand.asBranded(value as number, rangeKey);
		}
	}) as const;
