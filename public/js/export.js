// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { defineUIButtons, addConversionButtonEventListeners, pullParametersFromUI } from './helpers/appHelpers.js';
import { declareConversionMap, initialHslColorGeneration, formatHslForInitialColorValueGen, formatHslColorPropertiesAsNumbers, initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT, globalColorSpaceFormatting, hexToCMYKTryCaseHelper, hslToCMYKTryCaseHelper, hsvToCMYKTryCaseHelper, labToCMYKTryCaseHelper, hslToHexTryCaseHelper } from './helpers/conversionHelpers.js';
import { randomInitialColor, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck, parameterAssignForGenerateButtonEventHandler } from './helpers/paletteGenHelpers.js';

import { generatePaletteBox, makePaletteBox, populateColorTextOutputBox, getElementsForSelectedColor, saturateColor, desaturateColor, showTooltip, showCustomColorPopupDiv, applyCustomColor } from './modules/dom/dom.js';
import { attachDragAndDropEventListeners, handleDragStart, handleDragOver, handleDrop, handleDragEnd } from './modules/dom/dragAndDrop.js';
import { applyLimitGrayAndBlack, applyLimitLight } from './modules/dom/userIntefaceParameters.js';

import { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness } from './modules/color-conversion/colorConversion.js';
import { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK } from './modules/color-conversion/convertToCMYK.js';
import { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex } from './modules/color-conversion/convertToHex.js';
import { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL } from './modules/color-conversion/convertToHSL.js';
import { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV  } from './modules/color-conversion/convertToHSV.js';
import { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab } from './modules/color-conversion/convertToLab.js';
import { xyzToRGB, hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, labToRGB } from './modules/color-conversion/convertToRGB.js';
import { rgbToXYZ, labToXYZ } from './modules/color-conversion/convertToXYZ.js';

import { generateAnalogousHues, generateAnalogousPalette } from './modules/palette-generation/analogousPaletteGen.js';
import { generateComplementaryPalette } from './modules/palette-generation/complementaryPaletteGen.js';
import { generateDiadicHues, generateDiadicPalette } from './modules/palette-generation/diadicPaletteGen.js';
import { generateHexadicHues, generateHexadicPalette } from './modules/palette-generation/hexadicPaletteGen.js';
import { generateMonochromaticPalette } from './modules/palette-generation/monochromaticPaletteGen.js';
import { generatePalette, handleGenerateButtonClick } from './modules/palette-generation/paletteGen.js';
import { generateRandomColorPalette } from './modules/palette-generation/randomColorPaletteGen.js';
import { generateSplitComplementaryHues, generateSplitComplementaryPalette } from './modules/palette-generation/splitComplementaryPaletteGen.js';
import { generateTetradicHues, generateTetradicPalette } from './modules/palette-generation/tetradicPaletteGen.js';
import { generateTriadicHues, generateTriadicPalette } from './modules/palette-generation/triadicPaletteGen.js';

import { copyToClipboard } from './utils/clipboardUtils.js';
///////////////////////////////////////////////////////////
import { logObjectProperties, logObjectPropertiesInColorValues, convertColorsInitialLogging, generateAndStoreColorValuesInitialLogging, generateAndStoreColorValuesPreExitLogs, generateAndStoreColorValuesExitLogs, adjustSatAndLightInitLogs, adjustSatAndLightExitLogs, generateButtonExitLogs, generatePaletteExitLogs, handleGenerateButtonClickExitLogs, randomSLExitLogs, randomSVExitLogs, randomRGBLogs, randomHSLExitLogs, randomCMYKLogs, randomLabLogs, generateRandomFirstColorInitLogs } from './utils/logUtils.js';
import { hexToCMYKInitLogs, hexToCMYKTryExitLogs, hexToCMYKCatchExitLogs, rgbToCMYKInitLogs, rgbToCMYKTryExitLogs, rgbToCMYKCatchExitLogs, hslToCMYKInitLogs, hsvToCMYKInitLogs, labToCMYKInitLogs } from './utils/logUtils.js';
///////////////////////////////////////////////////////////
import { getWeightedRandomInterval } from './utils/paletteGenUtils.js';
import { randomSL, randomSV, generateRandomHexDigit, randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, generateRandomFirstColor } from './utils/randomUtils.js';


export { defineUIButtons, addConversionButtonEventListeners, pullParametersFromUI };
export { declareConversionMap, initialHslColorGeneration, formatHslForInitialColorValueGen, formatHslColorPropertiesAsNumbers, initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT, globalColorSpaceFormatting, hexToCMYKTryCaseHelper, hslToCMYKTryCaseHelper, hsvToCMYKTryCaseHelper, labToCMYKTryCaseHelper, hslToHexTryCaseHelper };
export { randomInitialColor, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck, parameterAssignForGenerateButtonEventHandler };

export { generatePaletteBox, makePaletteBox, populateColorTextOutputBox, getElementsForSelectedColor, saturateColor, desaturateColor, showTooltip, showCustomColorPopupDiv, applyCustomColor };
export { attachDragAndDropEventListeners, handleDragStart, handleDragOver, handleDrop, handleDragEnd };
export { applyLimitGrayAndBlack, applyLimitLight };

export { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness };

export { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK };
export { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex };
export { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL };
export { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV };
export { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab };
export { xyzToRGB, hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, labToRGB };
export { rgbToXYZ, labToXYZ };

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
export { logObjectProperties, logObjectPropertiesInColorValues, convertColorsInitialLogging, generateAndStoreColorValuesInitialLogging, generateAndStoreColorValuesPreExitLogs, generateAndStoreColorValuesExitLogs, adjustSatAndLightInitLogs, adjustSatAndLightExitLogs, generateButtonExitLogs, generatePaletteExitLogs, handleGenerateButtonClickExitLogs, randomSLExitLogs, randomSVExitLogs, randomRGBLogs, randomHSLExitLogs, randomCMYKLogs, randomLabLogs, generateRandomFirstColorInitLogs };
export { hexToCMYKInitLogs, hexToCMYKTryExitLogs, hexToCMYKCatchExitLogs, rgbToCMYKInitLogs, rgbToCMYKTryExitLogs, rgbToCMYKCatchExitLogs, hslToCMYKInitLogs, hsvToCMYKInitLogs, labToCMYKInitLogs };
///////////////////////////////////////////////////////////
export { getWeightedRandomInterval };
export { randomSL, randomSV, generateRandomHexDigit, randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, generateRandomFirstColor };