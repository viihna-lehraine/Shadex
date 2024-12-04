// File: src/palette/index.ts

import { generate } from './generate';
import { start } from './start';

export { generate, start };

export const palette = {
	generate,
	start
} as const;
