// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateComplementaryPalette } from './complementaryPaletteGen.js'
import { generateTriadicPalette } from './triadicPaletteGen.js';
import { generateTetradicPalette } from './tetradicPaletteGen.js';
import { generateHexadicPalette } from './hexadicPaletteGen.js';
import { generateSplitComplementaryPalette } from './splitComplementaryPaletteGen.js';
import { generateAnalogousPalette } from './analogousPaletteGen.js';
import { generateDiadicPalette } from './diadicPaletteGen.js';
import { randomSL, generateColor1 } from '../../utils/randomUtils.js';
import { generatePaletteBox, populateColorTextOutputBox } from '../dom.js';


export { generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette };
export { randomSL, generateColor1 };
export { generatePaletteBox, populateColorTextOutputBox };