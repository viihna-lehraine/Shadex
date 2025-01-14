// File: src/dom/index.js

import { DOMFnMasterInterface } from '../index/index.js';
import { base } from './base.js';
import { events } from './events/index.js';
import { exportPalette } from './exportPalette.js';
import { history } from './history.js';
import { validate } from './validate.js';

export const dom: DOMFnMasterInterface = {
	...base,
	events,
	exportPalette,
	history,
	validate
};
