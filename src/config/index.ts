// File: src/config/index.ts

import { consts } from './consts';
import { defaults } from './defaults';
import { idb } from './idb';
import { mode } from './mode';

export const config = {
	consts,
	defaults,
	idb,
	mode
} as const;
