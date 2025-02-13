// File: data/core/dom.js

interface DOM_ClassesInterface {
	colorDisplay: string;
	colorInput: string;
	colorInputBtn: string;
	colorStripe: string;
	colorSwatch: string;
	dragHandle: string;
	lockBtn: string;
	paletteColumn: string;
	resizeHandle: string;
}

interface DOMDataElementInterface {
	btns: {
		desaturate: HTMLButtonElement | null;
		export: HTMLButtonElement | null;
		generate: HTMLButtonElement | null;
		helpMenu: HTMLButtonElement | null;
		historyMenu: HTMLButtonElement | null;
		import: HTMLButtonElement | null;
		saturate: HTMLButtonElement | null;
		showAsCMYK: HTMLButtonElement | null;
		showAsHex: HTMLButtonElement | null;
		showAsHSL: HTMLButtonElement | null;
		showAsHSV: HTMLButtonElement | null;
		showAsLAB: HTMLButtonElement | null;
		showAsRGB: HTMLButtonElement | null;
	};
	divs: {
		helpMenu: HTMLDivElement | null;
		historyMenu: HTMLDivElement | null;
		paletteContainer: HTMLDivElement | null;
		paletteHistory: HTMLDivElement | null;
	};
	inputs: {
		limitDarkChkbx: HTMLInputElement | null;
		limitGrayChkbx: HTMLInputElement | null;
		limitLightChkbx: HTMLInputElement | null;
	};
	selectors: {
		paletteColumn: HTMLSelectElement | null;
		paletteColumnCount: HTMLSelectElement | null;
		paletteType: HTMLSelectElement | null;
	};
}

interface DOMDataIDInterface {
	btns: {
		desaturate: string;
		export: string;
		generate: string;
		helpMenu: string;
		historyMenu: string;
		import: string;
		saturate: string;
		showAsCMYK: string;
		showAsHex: string;
		showAsHSL: string;
		showAsHSV: string;
		showAsLAB: string;
		showAsRGB: string;
	};
	divs: {
		helpMenu: string;
		historyMenu: string;
		paletteContainer: string;
		paletteHistory: string;
	};
	inputs: {
		limitDarkChkbx: string;
		limitGrayChkbx: string;
		limitLightChkbx: string;
	};
	selectors: {
		paletteColumn: string;
		paletteColumnCount: string;
		paletteType: string;
	};
}

export interface DOMDataInterface {
	classes: DOM_ClassesInterface;
	elements: DOMDataElementInterface;
	ids: DOMDataIDInterface;
}
