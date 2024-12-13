// File: src/common/superUtils/index.js

import { CommonSuperUtilsFnMasterInterface } from '../../index/index.js';
import { dom } from './dom.js';

export const superUtils: CommonSuperUtilsFnMasterInterface = {
	dom
} as const;
