import { genAnalogousHues, genAnalogousPalette } from './analogous';
import { genComplementaryPalette } from './complementary';
import { genDiadicHues, genDiadicPalette } from './diadic';
import { genHexadicHues, genHexadicPalette } from './hexadic';
import { genMonochromaticPalette } from './monochromatic';
import { genRandomPalette } from './random';
import {
	genSplitComplementaryHues,
	genSplitComplementaryPalette
} from './split-complementary';
import { genTetradicHues, genTetradicPalette } from './tetradic';
import { genTriadicHues, genTriadicPalette } from './triadic';

export const palette = {
	genAnalogousHues,
	genAnalogousPalette,
	genComplementaryPalette,
	genDiadicHues,
	genDiadicPalette,
	genHexadicHues,
	genHexadicPalette,
	genMonochromaticPalette,
	genRandomPalette,
	genSplitComplementaryHues,
	genSplitComplementaryPalette,
	genTetradicHues,
	genTetradicPalette,
	genTriadicHues,
	genTriadicPalette
};
