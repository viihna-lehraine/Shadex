// File common/utils/index.js

import { CommonFn_MasterInterface } from '../../types/index.js';
import { colorUtils as color } from './color.js';
import { conversionUtils as conversion } from './conversion.js';
import { paletteUtils as palette } from './palette.js';
import { randomUtils as random } from './random.js';

export const utils: CommonFn_MasterInterface['utils'] = {
	color,
	conversion,
	palette,
	random
} as const;
