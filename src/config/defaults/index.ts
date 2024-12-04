// File: src/config/defaults/index.ts

import { colors } from './colors';
import { colorStrings } from './colors/colorStrings';
import { idb } from './idb';
import { palette } from './palette';

export const defaults = {
	colors,
	colorStrings,
	idb,
	palette
} as const;
