// File: src/data/mode/index.ts

import { ModeData } from '../../index/index.js';
import { base } from './base.js';

export const mode: ModeData = {
	...base
} as const;
