// File: src/common/dom/index.js

import { CommonDOMFnMasterInterface } from '../../index/index.js';
import { base } from './base.js';

export const domUtils: CommonDOMFnMasterInterface = {
	...base
} as const;
