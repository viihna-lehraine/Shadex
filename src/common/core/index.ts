// File: src/common/core/index.js

import { CommonFunctionsMasterInterface } from '../../types/index.js';
import {
	base,
	brand,
	brandColor,
	convert,
	guards,
	other,
	sanitize,
	validate
} from './base.js';

export const core: CommonFunctionsMasterInterface['core'] = {
	base,
	brand,
	brandColor,
	convert,
	guards,
	...other,
	sanitize,
	validate
} as const;
