// File: dom/index.js

import { DOMFn_MasterInterface } from '../types/index.js';
import { base } from './eventListeners.js';
import { fileUtils } from './fileUtils.js';
import { parse } from './parse.js';
import { validate } from './validate.js';

const events = { ...base };

export const domFn: DOMFn_MasterInterface = {
	events,
	fileUtils,
	parse,
	validate
};
