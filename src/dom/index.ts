// File: src/dom/index.js

import { DOMFnMasterInterface } from '../index/index.js';
import { base } from './base.js';
import { elements } from './elements.js';
import { exportPalette } from './exportPalette.js';
import { history } from './history.js';

export const dom: DOMFnMasterInterface = {
	...base,
	elements,
	exportPalette,
	history
};
