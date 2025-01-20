// File: src/palette/common/paletteUtils/index.js

import { PaletteCommon_Utils } from '../../../types/index.js';
import { adjust } from './adjust.js';
import { probability } from './probability.js';

export const paletteUtils: PaletteCommon_Utils = {
	adjust,
	probability
} as const;
