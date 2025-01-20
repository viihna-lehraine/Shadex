// File: src/common/dom/index.js

import { CommonDOMFnMasterInterface } from '../../types/index.js';
import { base } from './base.js';

export const domUtils: CommonDOMFnMasterInterface = {
	...base
} as const;
