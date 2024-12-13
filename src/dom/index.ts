// File: src/dom/index.js

import { DOMFnMasterInterface } from '../index/index.js';
import { base } from './base.js';
import { buttons } from './buttons.js';
import { exportPalette } from './exportPalette.js';
import { history } from './history.js';

export const dom: DOMFnMasterInterface = {
	...base,
	buttons,
	exportPalette,
	history
};
