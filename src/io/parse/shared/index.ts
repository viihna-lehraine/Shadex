// File: src/io/parse/shared/index.ts

import { asColorValue } from './colorValue.js';
import { parseColorString, parseCSSColorString } from './color.js';

export const parseAsColorValue = asColorValue;
export const colorString = parseColorString;
export const cssColorString = parseCSSColorString;

export const data = {
	asColorValue,
	asColorString: colorString,
	asCSSColorString: cssColorString
};
