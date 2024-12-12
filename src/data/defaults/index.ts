// File: src/data/defaults/index.ts

import {
	DefaultBaseColorsData,
	DefaultColorStringsData,
	Defaults
} from '../../index/index.js';
import { colors as defaultBaseColors } from './colors/index.js';
import { idb } from './idb.js';
import { palette } from './palette.js';

const colors: DefaultBaseColorsData = { ...defaultBaseColors };
const colorStrings: DefaultColorStringsData = defaultBaseColors.strings;

export const defaults: Defaults = {
	colors,
	colorStrings,
	idb,
	palette
} as const;
