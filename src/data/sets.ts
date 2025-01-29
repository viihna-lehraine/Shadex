// File: data/sets.js

import { DataSetsInterface } from '../types/index.js';

export const dataSets: DataSetsInterface = {
	AlphaRange: [0, 1] as const,
	ByteRange: [0, 255] as const,
	HexComponent: 'HexComponent' as const,
	HexSet: 'HexSet' as const,
	LAB_L: [0, 100] as const,
	LAB_A: [-128, 127] as const,
	LAB_B: [-128, 127] as const,
	Percentile: [0, 100] as const,
	Radial: [0, 360] as const,
	XYZ_X: [0, 95.047] as const,
	XYZ_Y: [0, 100] as const,
	XYZ_Z: [0, 108.883] as const
} as const;
