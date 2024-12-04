// File: src/logger/index.ts

import { debug } from './debug';
import { verbose } from './verbose';

export const logger = {
	debug,
	verbose
} as const;
