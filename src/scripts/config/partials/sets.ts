// File: src/scripts/config/partials/sets.ts

import { SetsData } from '../../types/index.js';

export const sets: Readonly<SetsData> = {
	ByteRange: [0, 255] as const,
	HexSet: 'HexSet' as const,
	Percentile: [0, 100] as const,
	Radial: [0, 360] as const
} as const;
