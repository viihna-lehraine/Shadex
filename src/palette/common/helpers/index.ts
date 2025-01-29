// File: palette/common/helpers/index.js

import { Palette_CommonFn_MasterInterface } from '../../../types/index.js';
import { limits } from './limits.js';
import { update } from './update.js';

export const helpers: Palette_CommonFn_MasterInterface['helpers'] = {
	limits,
	update
} as const;
