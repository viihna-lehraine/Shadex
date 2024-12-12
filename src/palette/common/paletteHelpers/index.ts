// File: src/palette/common/paletteHelpers/index.ts

import { PaletteCommon_Helpers } from '../../../index/index.js';
import { limits } from './limits.js';
import { update } from './update.js';

export const paletteHelpers: PaletteCommon_Helpers = {
	limits,
	update
} as const;
