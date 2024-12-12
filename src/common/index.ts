// File: src/common/index.ts

import { CommonFnMasterInterface } from '../index/index.js';
import { core } from './core/index.js';
import { helpers } from './helpers/index.js';
import { superUtils } from './superUtils/index.js';
import { transform } from './transform/index.js';
import { utils } from './utils/index.js';

export { core, helpers, superUtils, utils };

export const common: CommonFnMasterInterface = {
	core,
	helpers,
	superUtils,
	transform,
	utils
};
