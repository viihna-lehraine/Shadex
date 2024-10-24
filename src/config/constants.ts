import * as interfaces from '../index/interfaces';

const adjustSLAmount: number = 10;

const cmykBrightnessThreshold: number = 10;
const cmykDarknessThreshold: number = 90;
const cmykGrayThreshold: number = 5;
const hslBrightnessThreshold: number = 75;
const hslDarknessThreshold: number = 25;
const hslGrayThreshold: number = 20;
const hsvBrightnessValueThreshold: number = 90;
const hsvBrightnessSaturationThreshold: number = 10;
const hsvDarknessThreshold: number = 10;
const hsvGrayThreshold: number = 10;
const labBrightnessThreshold: number = 90;
const labDarknessThreshold: number = 10;
const labGrayThreshold: number = 10;
const rgbMaxBrightness: number = 200;
const rgbMinBrightness: number = 50;
const rgbGrayThreshold: number = 10;

const probabilities: number[] = [40, 45, 50, 55, 60, 65, 70];
const weights: number[] = [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05];

// ***** Constructed Constants *****

const adjustments = {
	adjustSLAmount
};

const probabilityConstants = {
	probabilities,
	weights
};

const thresholds = {
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

export const config: interfaces.Config = {
	...adjustments,
	...probabilityConstants,
	...thresholds
};
