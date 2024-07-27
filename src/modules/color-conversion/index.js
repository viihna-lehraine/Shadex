// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateAndStoreColorValues, adjustSaturationAndLightness } from './colorConversion.js';

import { rgbToXYZ } from './convertToXYZ.js';

import { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex } from './convertToHex.js';

import { hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, labToRGB } from './convertToRGB.js';

import { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL } from './convertToHSL.js';

import { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV } from './convertToHSV.js';

import { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK } from './convertToCMYK.js';

import { hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab } from './convertToLab.js';

import { declareConversionMap } from './colorConversionHelperFunctions.js';

import { initialHSLColorGeneration, formatHSLForInitialColorValueGen, formatHslColorPropertiesAsNumbers, globalColorSpaceFormatting } from './colorConversionHelperFunctions.js';

import { initialHSLColorGenerationWithLogs, formatHSLForInitialColorValueGenWithLogs, formatHslColorPropertiesAsNumbersWithLogs, globalColorSpaceFormattingWithLogs } from './colorConversionHelperFunctions.js';

import { initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT } from './colorConversionHelperFunctions.js';

import { initialColorValuesGenerationCaseHexWithLogging, initialColorValuesGenerationCaseRGBWithLogging, initialColorValuesGenerationCaseHSLWithLogging, initialColorValuesGenerationCaseDEFAULTWithLogging } from './colorConversionHelperFunctions.js';


export { generateAndStoreColorValues, adjustSaturationAndLightness };

export { rgbToXYZ };

export { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex };

export { hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, labToRGB };

export { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL };

export { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV };

export { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK };

export { hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab };

export { declareConversionMap };

export { initialHSLColorGeneration, formatHSLForInitialColorValueGen, formatHslColorPropertiesAsNumbers, globalColorSpaceFormatting };

export { initialHSLColorGenerationWithLogs, formatHSLForInitialColorValueGenWithLogs, formatHslColorPropertiesAsNumbersWithLogs, globalColorSpaceFormattingWithLogs };

export { initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT };

export { initialColorValuesGenerationCaseHexWithLogging, initialColorValuesGenerationCaseRGBWithLogging, initialColorValuesGenerationCaseHSLWithLogging, initialColorValuesGenerationCaseDEFAULTWithLogging };