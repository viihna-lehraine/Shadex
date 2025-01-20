// File: src/data/defaults/index.js

import { DefaultData } from '../../types/index.js';
import { colors } from './colors.js';
import { idb } from './idb.js';
import { palette } from './palette.js';

export const defaults: DefaultData = {
	colors,
	idb,
	palette
} as const;
