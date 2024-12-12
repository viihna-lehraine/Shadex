// File: src/data/consts/index.ts

import { ConstsData } from '../../index/index.js';
import {
	adjustments,
	debounce,
	limits,
	paletteRanges,
	probabilities,
	thresholds,
	timeouts
} from './base.js';
import { dom } from './dom.js';

export const consts: ConstsData = {
	adjustments,
	debounce,
	dom,
	limits,
	paletteRanges,
	probabilities,
	thresholds,
	timeouts
} as const;
