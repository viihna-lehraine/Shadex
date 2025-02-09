// File common/utils/index.js

import { CommonFunctionsInterface } from '../../types/index.js';
import { colorUtils as color } from './color.js';
import { conversionUtils as conversion } from './conversion.js';
import { getFormattedTimestamp } from './other.js';
import { paletteUtils as palette } from './palette.js';
import { randomUtils as random } from './random.js';

export const utils: CommonFunctionsInterface['utils'] = {
	color,
	conversion,
	getFormattedTimestamp,
	palette,
	random
} as const;
