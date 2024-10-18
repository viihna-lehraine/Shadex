import { defineUIButtons, addConversionButtonEventListeners, pullParametersFromUI } from './helpers/appHelpers';
import { declareConversionMap, initialHslColorGeneration, formatHslForInitialColorValueGen, formatHslColorPropertiesAsNumbers, initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT, globalColorSpaceFormatting, hexToCMYKTryCaseHelper, hslToCMYKTryCaseHelper, hsvToCMYKTryCaseHelper, labToCMYKTryCaseHelper, hslToHexTryCaseHelper } from './helpers/conversionHelpers';
import { randomInitialColor, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck, parameterAssignForGenerateButtonEventHandler } from './helpers/paletteGenHelpers';

import { generatePaletteBox, makePaletteBox, populateColorTextOutputBox, getElementsForSelectedColor, saturateColor, desaturateColor, showTooltip, showCustomColorPopupDiv, applyCustomColor } from './modules/dom/dom';
import { attachDragAndDropEventListeners, handleDragStart, handleDragOver, handleDrop, handleDragEnd } from './modules/dom/dragAndDrop';
import { applyLimitGrayAndBlack, applyLimitLight } from './modules/dom/userInterfaceParameters';

import { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness } from './modules/color-conversion/colorConversion';
import { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK } from './modules/color-conversion/convertToCMYK';
import { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex } from './modules/color-conversion/convertToHex';
import { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL } from './modules/color-conversion/convertToHSL';
import { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV  } from './modules/color-conversion/convertToHSV';
import { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab } from './modules/color-conversion/convertToLab';
import { xyzToRGB, hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, labToRGB } from './modules/color-conversion/convertToRGB';
import { rgbToXYZ, labToXYZ } from './modules/color-conversion/convertToXYZ';

import { generateAnalogousHues, generateAnalogousPalette } from './modules/palette-generation/analogousPaletteGen';
import { generateComplementaryPalette } from './modules/palette-generation/complementaryPaletteGen';
import { generateDiadicHues, generateDiadicPalette } from './modules/palette-generation/diadicPaletteGen';
import { generateHexadicHues, generateHexadicPalette } from './modules/palette-generation/hexadicPaletteGen';
import { generateMonochromaticPalette } from './modules/palette-generation/monochromaticPaletteGen';
import { generatePalette, handleGenerateButtonClick } from './modules/palette-generation/paletteGen';
import { generateRandomColorPalette } from './modules/palette-generation/randomColorPaletteGen';
import { generateSplitComplementaryHues, generateSplitComplementaryPalette } from './modules/palette-generation/splitComplementaryPaletteGen';
import { generateTetradicHues, generateTetradicPalette } from './modules/palette-generation/tetradicPaletteGen';
import { generateTriadicHues, generateTriadicPalette } from './modules/palette-generation/triadicPaletteGen.js';
import { copyToClipboard } from './utils/clipboardUtils';
import { getWeightedRandomInterval } from './utils/paletteGenUtils';
import { randomSL, randomSV, generateRandomHexDigit, randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, generateRandomFirstColor } from './utils/randomUtils';


export { defineUIButtons, addConversionButtonEventListeners, pullParametersFromUI };
export { declareConversionMap, initialHslColorGeneration, formatHslForInitialColorValueGen, formatHslColorPropertiesAsNumbers, initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT, globalColorSpaceFormatting, hexToCMYKTryCaseHelper, hslToCMYKTryCaseHelper, hsvToCMYKTryCaseHelper, labToCMYKTryCaseHelper, hslToHexTryCaseHelper };
export { randomInitialColor, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck, parameterAssignForGenerateButtonEventHandler };
///////////////////////////////////////////////////////////
export { generatePaletteBox, makePaletteBox, populateColorTextOutputBox, getElementsForSelectedColor, saturateColor, desaturateColor, showTooltip, showCustomColorPopupDiv, applyCustomColor };
export { attachDragAndDropEventListeners, handleDragStart, handleDragOver, handleDrop, handleDragEnd };
export { applyLimitGrayAndBlack, applyLimitLight };
///////////////////////////////////////////////////////////
export { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness };
///////////////////////////////////////////////////////////
export { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK };
export { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex };
export { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL };
export { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV };
export { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab };
export { xyzToRGB, hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, labToRGB };
export { rgbToXYZ, labToXYZ };
///////////////////////////////////////////////////////////
export { generateAnalogousHues, generateAnalogousPalette };
export { generateComplementaryPalette };
export { generateDiadicHues, generateDiadicPalette };
export { generateHexadicHues, generateHexadicPalette };
export { generateMonochromaticPalette };
export { generatePalette, handleGenerateButtonClick };
export { generateRandomColorPalette};
export { generateSplitComplementaryHues, generateSplitComplementaryPalette };
export { generateTetradicHues, generateTetradicPalette };
export { generateTriadicHues, generateTriadicPalette };

export { copyToClipboard };
///////////////////////////////////////////////////////////
export { getWeightedRandomInterval };
export { randomSL, randomSV, generateRandomHexDigit, randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, generateRandomFirstColor };