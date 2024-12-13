// File: src/palette/index.js

import { PaletteFnMasterInterface } from '../index/index.js';
import { generate, start } from './main.js';

export { generate, start };

export const palette: PaletteFnMasterInterface = {
	generate,
	start
} as const;
