// File: common/helpers/index.js

import { CommonFn_MasterInterface } from '../../types/index.js';
import { conversionHelpers as conversion } from './conversion.js';
import { domHelpers as dom } from './dom.js';

export const helpers: CommonFn_MasterInterface['helpers'] = {
	conversion,
	dom
} as const;
