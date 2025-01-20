// File: src/data/index.js

import { DataInterface } from '../types/index.js';
import { config } from './config/index.js';
import { consts } from './consts/index.js';
import { defaults } from './defaults/index.js';
import { idb } from './idb/index.js';
import { mode } from './mode/index.js';
import { sets } from './sets/index.js';

export const data: DataInterface = {
	config,
	consts,
	defaults,
	idb,
	mode,
	sets
} as const;
