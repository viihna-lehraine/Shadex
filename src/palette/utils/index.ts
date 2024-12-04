// File: src/palette/utils/index.ts

import { adjust } from './adjust';
import { convert, hslTo, toHSL, wrappers } from './convert';
import { create } from './create';
import { genHues } from './genHues';
import { probability } from './probability';
import { sub } from './sub';

export const paletteUtils = {
	adjust,
	convert,
	create,
	genHues,
	hslTo,
	probability,
	sub,
	toHSL,
	wrappers
};
