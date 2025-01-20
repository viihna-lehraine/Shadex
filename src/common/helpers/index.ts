// File: src/common/helpers/index.js

import { CommonFunctionsMasterInterface } from '../../types/index.js';
import { conversion } from './conversion.js';
import { dom } from './dom.js';

export const helpers: CommonFunctionsMasterInterface['helpers'] = {
	conversion,
	dom
} as const;
