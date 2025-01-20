// File: src/common/core/index.js

import { CommonCoreFnMasterInterface } from '../../types/index.js';
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

export const core: CommonCoreFnMasterInterface = {
	base,
	brand,
	brandColor,
	convert,
	guards,
	...other,
	sanitize,
	validate
} as const;
