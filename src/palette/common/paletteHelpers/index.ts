// File: src/palette/common/paletteHelpers/index.js

import { PaletteCommon_Helpers } from '../../../types/index.js';
import { limits } from './limits.js';
import { update } from './update.js';

export const paletteHelpers: PaletteCommon_Helpers = {
	limits,
	update
} as const;
