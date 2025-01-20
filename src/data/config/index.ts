// File: src/data/config/index.ts

import { ConfigInterface } from '../../types/index.js';
import { db } from './db.js';
import { regex } from './regex.js';

export const config: ConfigInterface = {
	db,
	regex
};
