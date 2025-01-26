// File: src/dom/index.js

import { DOM_FunctionsMasterInterface } from '../types/index.js';
import { base } from './events.js';
import { fileUtils } from './fileUtils.js';
import { parse } from './parse.js';
import { validate } from './validate.js';

const events = { ...base };

export const dom: DOM_FunctionsMasterInterface = {
	events,
	fileUtils,
	parse,
	validate
};
