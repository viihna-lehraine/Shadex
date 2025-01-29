// File: palette/index.js

import { PaletteFn_MasterInterface } from '../types/index.js';
import { generate, start } from './main.js';

export { generate, start };

export const paletteFn: PaletteFn_MasterInterface = {
	generate,
	start
} as const;
