// File: src/palette/index.js

import { PaletteFnMasterInterface } from '../types/index.js';
import { generate, start } from './main.js';

export { generate, start };

export const palette: PaletteFnMasterInterface = {
	generate,
	start
} as const;
