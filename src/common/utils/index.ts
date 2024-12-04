// File src/common/utils/index.ts

import { color } from './color';
import { conversion } from './conversion';
import { palette } from './palette';
import { random } from './random';

export const utils = {
	color,
	conversion,
	palette,
	random
} as const;
