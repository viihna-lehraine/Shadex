// File: app/ui/dom/index.js

import { DOMFn_MasterInterface } from '../../../types/index.js';
import { initializeEventListeners } from './eventListeners/index.js';
import { parse } from './parse.js';
import { utils } from './utils.js';
import { validate } from './validate.js';

export const domFn: DOMFn_MasterInterface = {
	initializeEventListeners,
	parse,
	utils,
	validate
};
