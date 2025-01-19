// File: src/config/index.ts

import { ConfigInterface } from '../index/index.js';
import { db } from './db.js';
import { regex } from './regex.js';

export const config: ConfigInterface = {
	db,
	regex
};
