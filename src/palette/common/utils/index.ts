// File: palette/common/utils/index.js

import { Palette_CommonFn_MasterInterface } from '../../../types/index.js';
import { adjust } from './adjust.js';
import { probability } from './probability.js';

export const utils: Palette_CommonFn_MasterInterface['utils'] = {
	adjust,
	probability
} as const;
