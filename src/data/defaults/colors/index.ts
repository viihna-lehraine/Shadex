// File: src/data/defaults/colors/index.js

import { DefaultColorsData } from '../../../index/index.js';
import { brandedColors, colors as base } from './colors.js';
import { colorStrings as strings } from './colorStrings.js';
import { cssColorStrings } from './cssColorStrings.js';

export { brandedColors };

export const colors: DefaultColorsData = {
	...base,
	cssColorStrings,
	strings
} as const;
