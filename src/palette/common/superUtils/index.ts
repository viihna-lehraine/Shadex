// File: palette/common/superUtils.js

import { Palette_CommonFn_MasterInterface } from '../../../types/index.js';
import { create } from './create.js';
import { genHues } from './genHues.js';

export const superUtils: Palette_CommonFn_MasterInterface['superUtils'] = {
	create,
	genHues
} as const;
