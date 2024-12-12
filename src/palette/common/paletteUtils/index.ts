// File: src/palette/common/paletteUtils/index.ts

import { PaletteCommon_Utils } from '../../../index/index.js';
import { adjust } from './adjust.js';
import { convert } from './convert.js';
import { probability } from './probability.js';

export const paletteUtils: PaletteCommon_Utils = {
	adjust,
	convert,
	probability
} as const;
