import { PaletteType } from '../../src/types/index.js';

export const validPaletteTypes: PaletteType[] = [
	'analogous',
	'complementary',
	'custom',
	'diadic',
	'hexadic',
	'monochromatic',
	'random',
	'splitComplementary',
	'tetradic',
	'triadic'
];

export type ColorBrand = { value: unknown; format: unknown };
export type NumberBrand = number & { __brand: 'NumberBrand' };
export type StringBrand = string & { __brand: 'StringBrand' };
