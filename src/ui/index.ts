// File: src/ui/index.ts

import { UIFnMasterInterface } from '../index/index.js';
import { base } from './base.js';
import { io } from './io.js';

export const ui: UIFnMasterInterface = {
	...base,
	io
};
