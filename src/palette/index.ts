// File: src/palette/index.js

import { PaletteFnMasterInterface } from '../index/index.js';
import { parseColorString } from './colorParser.js';
import { generate, start } from './main.js';
import { serialize } from './io/serialize.js';

export { generate, parseColorString, start };

export const palette: PaletteFnMasterInterface = {
	generate,
	serialize,
	start
} as const;
