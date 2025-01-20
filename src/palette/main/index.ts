// File: src/palete/main/index.js

import { GenPaletteFnInterface } from '../../types/index.js';
import { analogous } from './types/analogous.js';
import { complementary } from './types/complementary.js';
import { diadic } from './types/diadic.js';
import { hexadic } from './types/hexadic.js';
import { monochromatic } from './types/monochromatic.js';
import { random } from './types/random.js';
import { splitComplementary } from './types/splitComplementary.js';
import { tetradic } from './types/tetradic.js';
import { triadic } from './types/triadic.js';

export const genPalette: GenPaletteFnInterface = {
	analogous,
	complementary,
	diadic,
	hexadic,
	monochromatic,
	random,
	splitComplementary,
	tetradic,
	triadic
};
