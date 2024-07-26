// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { populateColorTextOutputBox } from "../modules/dom.js";

import { copyToClipboard } from "./clipboardUtils.js";

import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, generateColor1, randomSL } from './randomUtils.js';

import { logObjectProperties, logObjectPropertiesInColorValues } from "./logUtils.js";

import { getWeightedRandomInterval } from "./paletteGenUtils.js";

import { convertColorsInitialLogging, generateAndStoreColorValuesInitialLogging, generateAndStoreColorValuesFinalLogs } from './logUtils.js';

import { adjustSatAndLightInitLogs } from "./logUtils.js";


export { populateColorTextOutputBox, copyToClipboard, randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, generateColor1, randomSL, logObjectProperties, logObjectPropertiesInColorValues, getWeightedRandomInterval };

export { convertColorsInitialLogging, generateAndStoreColorValuesInitialLogging, generateAndStoreColorValuesFinalLogs };

export { adjustSatAndLightInitLogs };