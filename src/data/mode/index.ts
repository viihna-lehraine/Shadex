// File: src/data/mode/index.js

import { ModeData } from '../../types/index.js';
import { mode as base } from './base.js';

export const mode: ModeData = {
	...base
} as const;
