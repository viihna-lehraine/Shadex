// File: src/data/defaults/colors/index.js

import { DefaultColorsData } from '../../../index/index.js';
import { colors as base } from './colors.js';
import { colorStrings as strings } from './colorStrings.js';

export const colors: DefaultColorsData = {
	...base,
	strings
} as const;
