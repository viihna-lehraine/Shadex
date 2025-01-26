// File src/common/utils/index.js

import { CommonFunctionsMasterInterface } from '../../types/index.js';
import { color } from './color.js';
import { conversion } from './conversion.js';
import { errors } from './errors.js';
import { palette } from './palette.js';
import { random } from './random.js';

export const utils: CommonFunctionsMasterInterface['utils'] = {
	color,
	conversion,
	errors,
	palette,
	random
} as const;
