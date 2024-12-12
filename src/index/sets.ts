// File: src/index/sets.ts

import { data } from '../data/index.js';

export type AlphaRange = number & { __brand: 'AlphaRange' };

export type ByteRange = number & { __brand: 'ByteRange' };

export type HexComponent = number & { __brand: 'HexComponent' };

export type HexSet = string & { __brand: 'HexSet' };

export type LAB_L = number & { __brand: 'LAB_L' };

export type LAB_A = number & { __brand: 'LAB_A' };

export type LAB_B = number & { __brand: 'LAB_B' };

export type Percentile = number & { __brand: 'Percentile' };

export type Radial = number & { __brand: 'Radial' };

export type XYZ_X = number & { __brand: 'XYZ_X' };

export type XYZ_Y = number & { __brand: 'XYZ_Y' };

export type XYZ_Z = number & { __brand: 'XYZ_Z' };

export type RangeKeyMap = {
	AlphaRange: AlphaRange;
	ByteRange: ByteRange;
	HexComponent: HexComponent;
	HexSet: HexSet;
	LAB_L: LAB_L;
	LAB_A: LAB_A;
	LAB_B: LAB_B;
	Percentile: Percentile;
	Radial: Radial;
	XYZ_X: XYZ_X;
	XYZ_Y: XYZ_Y;
	XYZ_Z: XYZ_Z;
};

export type ColorValueRange = RangeKeyMap[keyof RangeKeyMap];

export type NumericRangeKey = Exclude<
	keyof typeof data.sets,
	'HexSet' | 'HexComponent'
>;

export type Sets = typeof data.sets;
