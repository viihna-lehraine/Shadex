// File: src/config/defaults/colors/index.ts

import { colors as base } from './colors';
import { colorStrings as strings } from './colorStrings';

export const colors = {
	...base,
	strings
} as const;
