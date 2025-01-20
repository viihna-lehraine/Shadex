// File: src/io/parse/index.ts

import { IO_Interface } from '../../types/index.js';
import { asColorValue } from './colorValue.js';
import { asColorString, asCSSColorString } from './color.js';
import { color } from './base.js';
import { json } from './json.js';

export const parse: IO_Interface['parse'] = {
	asColorValue,
	asColorString,
	asCSSColorString,
	color,
	json
};
