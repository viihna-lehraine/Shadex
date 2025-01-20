// File: src/common/superUtils/index.js

import { CommonFunctionsMasterInterface } from '../../types/index.js';
import { dom } from './dom.js';

export const superUtils: CommonFunctionsMasterInterface['superUtils'] = {
	dom
} as const;
