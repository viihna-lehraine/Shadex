// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateRandomColorPalette } from './randomColorPaletteGen.js';
import { generateComplementaryPalette } from './complementaryPaletteGen.js'
import { generateTriadicPalette } from './triadicPaletteGen.js';
import { generateTetradicPalette } from './tetradicPaletteGen.js';
import { generateHexadicPalette } from './hexadicPaletteGen.js';
import { generateSplitComplementaryPalette } from './splitComplementaryPaletteGen.js';
import { generateAnalogousPalette } from './analogousPaletteGen.js';
import { generateDiadicPalette } from './diadicPaletteGen.js';
import { generateMonochromaticPalette } from './monochromaticPaletteGen.js';
import { randomHSL, randomSL, generateColor1 } from '../../utils/randomUtils.js';
import { generatePaletteBox, populateColorTextOutputBox } from '../dom.js';
import { generatePalette } from './paletteGen.js';
import { hexToHSL } from '../color-conversion/convertToHSL.js';
import { applyLimitGrayAndBlack, applyLimitLight } from '../userIntefaceParameters.js';
import { randomInitialColor, generateSelectedPaletteType } from './paletteGenHelpers.js'; 
import { randomInitialColorWithLogs,generateSelectedPaletteTypeWithLogs, paletteGenColorSpaceConditionCheckWithLogs } from './paletteGenHelpers.js';


export { generateRandomColorPalette, generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette, generateMonochromaticPalette };
export { randomHSL, randomSL, generateColor1 };
export { generatePaletteBox, populateColorTextOutputBox };
export { generatePalette };
export { hexToHSL };
export { applyLimitGrayAndBlack, applyLimitLight };
export { randomInitialColor, generateSelectedPaletteType };
export { randomInitialColorWithLogs, generateSelectedPaletteTypeWithLogs, paletteGenColorSpaceConditionCheckWithLogs };