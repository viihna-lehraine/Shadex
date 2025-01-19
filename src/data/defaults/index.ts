// File: src/data/defaults/index.js

import {
	DefaultBaseColorsData,
	DefaultColorStringsData,
	DefaultCSSColorStringsData,
	Defaults
} from '../../index/index.js';
import { brandedColors, colors as defaultBaseColors } from './colors/index.js';
import { idb } from './idb.js';
import { palette } from './palette.js';

const colors: DefaultBaseColorsData = { ...defaultBaseColors };
const colorStrings: DefaultColorStringsData = defaultBaseColors.strings;
const cssColorStrings: DefaultCSSColorStringsData =
	defaultBaseColors.cssColorStrings;

export const defaults: Defaults = {
	brandedColors,
	colors,
	colorStrings,
	cssColorStrings,
	idb,
	palette
} as const;
