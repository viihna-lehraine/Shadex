// File: src/logger/index.ts

import { LoggerFnMasterInterface } from '../index/index.js';
import { debug } from './debug.js';
import { verbose } from './verbose.js';

export const logger: LoggerFnMasterInterface = {
	debug,
	verbose
} as const;
