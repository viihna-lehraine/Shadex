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

const cmykBrightnessThreshold = 10;
const cmykDarknessThreshold = 90;
const cmykGrayThreshold = 5;
const hslBrightnessThreshold = 75;
const hslDarknessThreshold = 25;
const hslGrayThreshold = 20;
const hsvBrightnessValueThreshold = 90;
const hsvBrightnessSaturationThreshold = 10;
const hsvDarknessThreshold = 10;
const hsvGrayThreshold = 10;
const labBrightnessThreshold = 90;
const labDarknessThreshold = 10;
const labGrayThreshold = 10;
const rgbMaxBrightness = 200;
const rgbMinBrightness = 50;
const rgbGrayThreshold = 10;

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
	cmykBrightnessThreshold,
	cmykDarknessThreshold,
	cmykGrayThreshold,
	hslBrightnessThreshold,
	hslDarknessThreshold,
	hslGrayThreshold,
	hsvBrightnessValueThreshold,
	hsvBrightnessSaturationThreshold,
	hsvDarknessThreshold,
	hsvGrayThreshold,
	labBrightnessThreshold,
	labDarknessThreshold,
	labGrayThreshold,
	rgbMaxBrightness,
	rgbMinBrightness,
	rgbGrayThreshold
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
	...paletteShiftRanges,
	...probabilityConstants,
	...thresholds,
	...timeouts
};
