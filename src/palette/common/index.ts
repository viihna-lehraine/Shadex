// File: palette/common/index.js

import { Palette_CommonFn_MasterInterface } from '../../types/index.js';

import { helpers } from './helpers/index.js';
import { superUtils } from './superUtils/index.js';
import { utils } from './utils/index.js';

export { helpers, superUtils, utils };

export const paletteCommonFn: Palette_CommonFn_MasterInterface = {
	helpers,
	superUtils,
	utils
} as const;
