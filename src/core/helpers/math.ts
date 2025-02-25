// File: File: core/helpers/math.ts

import { MathHelpers, NumericRangeKey } from '../../types/index.js';
import { sets } from '../../config/index.js';

export const mathHelpersFactory = (): MathHelpers =>
	({
		clampToRange(value: number, rangeKey: NumericRangeKey): number {
			const [min, max] = sets[rangeKey];

			return Math.min(Math.max(value, min), max);
		}
	}) as const;
