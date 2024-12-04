// File: src/palete/main/index.ts

import { analogous } from './types/analogous';
import { complementary } from './types/complementary';
import { diadic } from './types/diadic';
import { hexadic } from './types/hexadic';
import { monochromatic } from './types/monochromatic';
import { random } from './types/random';
import { splitComplementary } from './types/splitComplementary';
import { tetradic } from './types/tetradic';
import { triadic } from './types/triadic';

export const genPalette = {
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
