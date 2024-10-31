import * as constants from '../index/config';

const adjustSLAmount = 10;

const xyzMaxX = 95.047;
const xyzMaxY = 100;
const xyzMaxZ = 108.883;
const xyzMinX = 0;
const xyzMinY = 0;
const xyzMinZ = 0;

const buttonDebounce = 300;
const inputDebounce = 200;

const advancedMenuToggleButton = document.getElementById(
	'advanced-menu-toggle-button'
) as HTMLButtonElement | null;
const applyCustomColorButton = document.getElementById(
	'apply-custom-color-button'
) as HTMLButtonElement | null;
const clearCustomColorButton = document.getElementById(
	'clear-custom-color-button'
) as HTMLButtonElement | null;
const customColorElement = document.getElementById(
	'custom-color'
) as HTMLInputElement;
const customColorToggleButton = document.getElementById(
	'custom-color-toggle-button'
) as HTMLButtonElement | null;
const desaturateButton = document.getElementById(
	'desaturate-button'
) as HTMLButtonElement | null;
const enableAlphaCheckbox = document.getElementById(
	'enable-alpha-checkbox'
) as HTMLInputElement | null;
const generateButton = document.getElementById(
	'generate-button'
) as HTMLButtonElement | null;
const limitBrightCheckbox = document.getElementById(
	'limit-light-checkbox'
) as HTMLInputElement | null;
const limitDarkCheckbox = document.getElementById(
	'limit-dark-checkbox'
) as HTMLInputElement | null;
const limitGrayCheckbox = document.getElementById(
	'limit-gray-checkbox'
) as HTMLInputElement | null;
const paletteNumberOptions = document.getElementById(
	'palette-number-options'
) as HTMLInputElement;
const paletteTypeOptions = document.getElementById(
	'palette-type-options'
) as HTMLSelectElement;
const popupDivButton = document.getElementById(
	'custom-color-button'
) as HTMLButtonElement | null;
const saturateButton = document.getElementById(
	'saturate-button'
) as HTMLButtonElement | null;
const selectedColorOptions = document.getElementById(
	'selected-color-options'
) as HTMLSelectElement | null;

const complementaryHueShiftRange = 10;
const diadicLightnessShiftRange = 30;
const diadicSaturationShiftRange = 30;
const hexadicLightnessShiftRange = 30;
const hexadicSaturationShiftRange = 30;
const splitComplementaryLightnessShiftRange = 30;
const splitComplementarySaturationShiftRange = 30;
const tetradicLightnessShiftRange = 30;
const tetradicSaturationShiftRange = 30;
const triadicLightnessShiftRange = 30;
const triadicSaturationShiftRange = 30;

const probabilities = [40, 45, 50, 55, 60, 65, 70];
const weights = [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05];

const brightnessThreshold = 75;
const darknessThreshold = 25;
const grayThreshold = 20;

const copyButtonTextTimeout = 1000;
const toastTimeout = 3000;
const tooltipTimeout = 1000;

// ***** Constructed Constants *****

const adjustments: constants.Adjustments = {
	adjustSLAmount
};

const boundaries: constants.Boundaries = {
	xyzMaxX,
	xyzMaxY,
	xyzMaxZ,
	xyzMinX,
	xyzMinY,
	xyzMinZ
};

const debounce: constants.Debounce = {
	buttonDebounce,
	inputDebounce
};

const domElements: constants.DOMElements = {
	advancedMenuToggleButton,
	applyCustomColorButton,
	clearCustomColorButton,
	customColorElement,
	customColorToggleButton,
	desaturateButton,
	enableAlphaCheckbox,
	generateButton,
	limitBrightCheckbox,
	limitDarkCheckbox,
	limitGrayCheckbox,
	paletteNumberOptions,
	paletteTypeOptions,
	popupDivButton,
	saturateButton,
	selectedColorOptions
};

const paletteShiftRanges: constants.PaletteShiftRanges = {
	complementaryHueShiftRange,
	diadicLightnessShiftRange,
	diadicSaturationShiftRange,
	hexadicLightnessShiftRange,
	hexadicSaturationShiftRange,
	splitComplementaryLightnessShiftRange,
	splitComplementarySaturationShiftRange,
	tetradicLightnessShiftRange,
	tetradicSaturationShiftRange,
	triadicLightnessShiftRange,
	triadicSaturationShiftRange
};

const probabilityConstants: constants.ProbabilityConstants = {
	probabilities,
	weights
};

const thresholds: constants.Thresholds = {
	brightnessThreshold,
	darknessThreshold,
	grayThreshold
};

const timeouts: constants.Timeouts = {
	copyButtonTextTimeout,
	toastTimeout,
	tooltipTimeout
};

// **** Master Config Object ****

export const config: constants.Config = {
	...adjustments,
	...boundaries,
	...debounce,
	...domElements,
	...paletteShiftRanges,
	...probabilityConstants,
	...thresholds,
	...timeouts
};
