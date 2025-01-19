// File: src/io/parse/index.ts

import { css } from './css.js';
import { data } from './shared/index.js';
import { json } from './json.js';
import { xml } from './xml.js';

export const parse = {
	css,
	json,
	xml,
	data
};
