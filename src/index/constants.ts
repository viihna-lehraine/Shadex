export interface Adjustments {
	adjustSLAmount: number;
}

export interface Boundaries {
	xyzMaxX: number;
	xyzMaxY: number;
	xyzMaxZ: number;
	xyzMinX: number;
	xyzMinY: number;
	xyzMinZ: number;
}

export interface Debounce {
	buttonDebounce: number;
	inputDebounce: number;
}

export interface Flags {
	enableAlpha: boolean;
}

export interface ProbabilityConstants {
	probabilities: number[];
	weights: number[];
}

export interface Thresholds {
	cmykBrightnessThreshold: number;
	cmykDarknessThreshold: number;
	cmykGrayThreshold: number;
	hslBrightnessThreshold: number;
	hslDarknessThreshold: number;
	hslGrayThreshold: number;
	hsvBrightnessValueThreshold: number;
	hsvBrightnessSaturationThreshold: number;
	hsvDarknessThreshold: number;
	hsvGrayThreshold: number;
	labBrightnessThreshold: number;
	labDarknessThreshold: number;
	labGrayThreshold: number;
	rgbMaxBrightness: number;
	rgbMinBrightness: number;
	rgbGrayThreshold: number;
}

export interface Timeouts {
	copyButtonTextTimeout: number;
	toastTimeout: number;
	tooltipTimeout: number;
}

// ***** Composite Object *****

export type Config = Adjustments &
	Boundaries &
	Debounce &
	ProbabilityConstants &
	Thresholds &
	Timeouts;
