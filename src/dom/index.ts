// File: src/dom/index.js

import { DOMFnMasterInterface } from '../types/index.js';
import { base } from './events.js';
import { fileUtils } from './fileUtils.js';
import { parse } from './parse.js';
import { validate } from './validate.js';

const events = { ...base };

export const dom: DOMFnMasterInterface = {
	events,
	fileUtils,
	parse,
	validate
};
