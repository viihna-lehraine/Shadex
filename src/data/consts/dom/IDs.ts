// File: src/data/consts/dom/IDs.js

import { DOM_ID_Data } from '../../../index/index.js';

const advancedMenuButton = 'advanced-menu-button';
const applyCustomColorButton = 'apply-custom-color-button';
const clearCustomColorButton = 'clear-custom-color-button';
const closeAdvancedMenuButton = 'close-advanced-menu-button';
const closeCustomColorMenuButton = 'close-custom-color-menu-button';
const closeDeveloperMenuButton = 'close-developer-menu-button';
const closeHelpMenuButton = 'close-help-menu-button';
const closeHistoryMenuButton = 'close-history-menu-button';
const customColorElement = 'custom-color';
const customColorMenuButton = 'custom-color-menu-button';
const desaturateButton = 'desaturate-button';
const developerMenuButton = 'developer-menu-button';
const enableAlphaCheckbox = 'enable-alpha-checkbox';
const generateButton = 'generate-button';
const helpMenuButton = 'help-menu-button';
const historyMenuButton = 'history-menu-button';
const limitDarknessCheckbox = 'limit-darkness-checkbox';
const limitGraynessCheckbox = 'limit-grayness-checkbox';
const limitLightnessCheckbox = 'limit-lightness-checkbox';
const paletteNumberOptions = 'palette-number-options';
const paletteTypeOptions = 'palette-type-options';
const resetButton = 'reset-button';
const saturateButton = 'saturate-button';
const selectedColorOption = 'selected-color-option';
const showAsCMYKButton = 'show-as-cmyk-button';
const showAsHexButton = 'show-as-hex-button';
const showAsHSLButton = 'show-as-hsl-button';
const showAsHSVButton = 'show-as-hsv-button';
const showAsLABButton = 'show-as-lab-button';
const showAsRGBButton = 'show-as-rgb-button';

export const domIDs: DOM_ID_Data = {
	advancedMenuButton,
	applyCustomColorButton,
	clearCustomColorButton,
	closeAdvancedMenuButton,
	closeCustomColorMenuButton,
	closeDeveloperMenuButton,
	closeHelpMenuButton,
	closeHistoryMenuButton,
	customColorElement,
	customColorMenuButton,
	desaturateButton,
	developerMenuButton,
	enableAlphaCheckbox,
	generateButton,
	helpMenuButton,
	historyMenuButton,
	limitDarknessCheckbox,
	limitGraynessCheckbox,
	limitLightnessCheckbox,
	paletteNumberOptions,
	paletteTypeOptions,
	resetButton,
	saturateButton,
	selectedColorOption,
	showAsCMYKButton,
	showAsHexButton,
	showAsHSLButton,
	showAsHSVButton,
	showAsLABButton,
	showAsRGBButton
} as const;
