// File: src/data/idb/index.js

import { base } from './base.js';

export const idb: Readonly<{
	DEFAULT_KEYS: Readonly<Record<string, string>>;
	STORE_NAMES: Readonly<Record<string, string>>;
}> = {
	...base
};
