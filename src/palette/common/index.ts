// File: src/palette/common/index.ts

import { PaletteCommon } from '../../index/index.js';
import { paletteHelpers } from './paletteHelpers/index.js';
import { paletteSuperUtils } from './paletteSuperUtils/index.js';
import { paletteUtils } from './paletteUtils/index.js';

export { paletteHelpers };
export { paletteSuperUtils };
export { paletteUtils };

export const paletteCommon: PaletteCommon = {
	helpers: paletteHelpers,
	superUtils: paletteSuperUtils,
	utils: paletteUtils
} as const;
