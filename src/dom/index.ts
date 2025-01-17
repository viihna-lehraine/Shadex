// File: src/dom/index.js

import { DOMFnMasterInterface } from '../index/index.js';
import { base } from './events.js';
import { exportPalette } from './exportPalette.js';
import { validate } from './validate.js';

const events = { ...base };

export const dom: DOMFnMasterInterface = {
	events,
	exportPalette,
	validate
};
