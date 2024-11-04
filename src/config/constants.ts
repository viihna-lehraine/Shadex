import * as constants from '../index/config';

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

const adjustSLAmount = 10;

const xyzMaxX = 95.047;
const xyzMaxY = 100;
const xyzMaxZ = 108.883;
const xyzMinX = 0;
const xyzMinY = 0;
const xyzMinZ = 0;

const buttonDebounce = 300;
const inputDebounce = 200;

const advancedMenuToggleButton = getElement<HTMLButtonElement>(
	'advanced-menu-toggle-button'
);
const applyCustomColorButton = getElement<HTMLButtonElement>(
	'apply-custom-color-button'
);
const clearCustomColorButton = getElement<HTMLButtonElement>(
	'clear-custom-color-button'
);
const closeHelpMenuButton = getElement<HTMLButtonElement>(
	'close-help-menu-button'
);
const closeHistoryMenuButton = getElement<HTMLButtonElement>(
	'close-history-menu-button'
);
const closeSubMenuAButton = getElement<HTMLButtonElement>(
	'close-sub-menu-A-button'
);
const closeSubMenuBButton = getElement<HTMLButtonElement>(
	'close-sub-menu-B-button'
);
const customColorElement = getElement<HTMLInputElement>('custom-color');
const customColorMenuButton = getElement<HTMLButtonElement>(
	'custom-color-menu-button'
);
const desaturateButton = getElement<HTMLButtonElement>('desaturate-button');
const enableAlphaCheckbox = getElement<HTMLInputElement>(
	'enable-alpha-checkbox'
);
const generateButton = getElement<HTMLButtonElement>('generate-button');
const helpMenuToggleButton = getElement<HTMLButtonElement>(
	'help-menu-toggle-button'
);
const historyMenuToggleButton = getElement<HTMLButtonElement>(
	'history-menu-toggle-button'
);
const limitBrightCheckbox = getElement<HTMLInputElement>(
	'limit-bright-checkbox'
);
const limitDarkCheckbox = getElement<HTMLInputElement>('limit-dark-checkbox');
const limitGrayCheckbox = getElement<HTMLInputElement>('limit-gray-checkbox');
const paletteNumberOptions = getElement<HTMLInputElement>(
	'palette-number-options'
);
const paletteTypeOptions = getElement<HTMLSelectElement>(
	'palette-type-options'
);
const popupDivButton = getElement<HTMLButtonElement>('custom-color-button');
const saturateButton = getElement<HTMLButtonElement>('saturate-button');
const selectedColorOptions = getElement<HTMLSelectElement>(
	'selected-color-options'
) as HTMLSelectElement | null;
const showAsCMYKButton = getElement<HTMLButtonElement>('show-as-cmyk-button');
const showAsHexButton = getElement<HTMLButtonElement>('show-as-hex-button');
const showAsHSLButton = getElement<HTMLButtonElement>('show-as-hsl-button');
const showAsHSVButton = getElement<HTMLButtonElement>('show-as-hsv-button');
const showAsLABButton = getElement<HTMLButtonElement>('show-as-lab-button');
const showAsRGBButton = getElement<HTMLButtonElement>('show-as-rgb-button');

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
	closeHelpMenuButton,
	closeHistoryMenuButton,
	closeSubMenuAButton,
	closeSubMenuBButton,
	customColorElement,
	customColorMenuButton,
	desaturateButton,
	enableAlphaCheckbox,
	generateButton,
	helpMenuToggleButton,
	historyMenuToggleButton,
	limitBrightCheckbox,
	limitDarkCheckbox,
	limitGrayCheckbox,
	paletteNumberOptions,
	paletteTypeOptions,
	popupDivButton,
	saturateButton,
	selectedColorOptions,
	showAsCMYKButton,
	showAsHexButton,
	showAsHSLButton,
	showAsHSVButton,
	showAsLABButton,
	showAsRGBButton
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
