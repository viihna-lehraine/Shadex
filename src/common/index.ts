// File: common/index.js

import { CommonFunctionsInterface } from '../types/index.js';
import { coreConversionUtils } from './convert.js';
import { coreUtils } from './core/index.js';
import { helpers } from './helpers/index.js';
import { transformUtils } from './transform.js';
import { utils } from './utils/index.js';

export { coreConversionUtils, coreUtils, helpers, transformUtils, utils };

export const commonFn: CommonFunctionsInterface = {
	convert: coreConversionUtils,
	core: coreUtils,
	helpers,
	transform: transformUtils,
	utils
} as const;
