// File: core/index.js

import { CommonFunctionsInterface } from '../../types/index.js';
import { base } from './base.js';
import { brand, brandColor } from './brand.js';
import { guards } from './guards.js';
import { sanitize } from './sanitize.js';
import { validate } from './validate.js';

export const coreUtils: CommonFunctionsInterface['core'] = {
	base,
	brand,
	brandColor,
	guards,
	sanitize,
	validate
} as const;
