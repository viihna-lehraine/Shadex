// File: src/common/core/index.ts

import { CommonCoreFnMasterInterface } from '../../index/index.js';
import {
	base,
	brand,
	brandColor,
	convert,
	guards,
	sanitize,
	validate
} from './base.js';

export const core: CommonCoreFnMasterInterface = {
	base,
	brand,
	brandColor,
	convert,
	guards,
	sanitize,
	validate
} as const;
