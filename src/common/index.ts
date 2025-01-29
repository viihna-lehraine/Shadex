// File: common/index.js

import { CommonFn_MasterInterface } from '../types/index.js';
import { coreConversionUtils } from './convert.js';
import { coreUtils } from './core.js';
import { helpers } from './helpers/index.js';
import { superUtils } from './superUtils.js';
import { transformUtils } from './transform.js';
import { utils } from './utils/index.js';

export {
	coreConversionUtils,
	coreUtils,
	helpers,
	superUtils,
	transformUtils,
	utils
};

export const commonFn: CommonFn_MasterInterface = {
	convert: coreConversionUtils,
	core: coreUtils,
	helpers,
	superUtils,
	transform: transformUtils,
	utils
} as const;
