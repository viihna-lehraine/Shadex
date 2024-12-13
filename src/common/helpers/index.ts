// File: src/common/helpers/index.js

import { CommonHelpersFnMasterInterface } from '../../index/index.js';
import { conversion } from './conversion.js';
import { dom } from './dom.js';

export const helpers: CommonHelpersFnMasterInterface = {
	conversion,
	dom
} as const;
