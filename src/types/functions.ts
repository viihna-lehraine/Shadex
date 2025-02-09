// File: types/functions.js

import { RangeKeyMap } from './index.js';

export type BrandFunctions = {
	asBranded: <T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T
	) => RangeKeyMap[T];
	asByteRange: (value: number) => number;
	asLAB_A: (value: number) => number;
	asLAB_B: (value: number) => number;
	asLAB_L: (value: number) => number;
	asHexSet: (value: string) => string;
	asPercentile: (value: number) => number;
	asRadial: (value: number) => number;
};

export type ValidateFn = <T extends keyof RangeKeyMap>(
	value: number,
	rangeKey: T
) => void;

export type ValidateFunctions = {
	range: <T extends keyof RangeKeyMap>(value: number, rangeKey: T) => void;
};
