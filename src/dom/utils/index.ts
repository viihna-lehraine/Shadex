// File: src/dom/utils/index.ts

import { DOMSharedUtilsBase, base } from './base.js';

interface DOMSharedUtils extends DOMSharedUtilsBase {}

export const domUtils: DOMSharedUtils = {
	...base
};
