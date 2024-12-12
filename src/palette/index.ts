// File: src/palette/index.ts

import { PaletteFnMasterInterface } from '../index/index.js';
import { generate } from './generate.js';
import { start } from './start.js';

export { generate, start };

export const palette: PaletteFnMasterInterface = {
	generate,
	start
} as const;
