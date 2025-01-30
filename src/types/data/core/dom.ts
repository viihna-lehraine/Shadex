// File: data/core/dom.js

interface DOM_DynamicElement_DataInterface {
	btns: {};
	divs: {
		colorBox1: HTMLDivElement | null;
	};
	inputs: {};
	selects: {};
	spans: {};
}

interface DOM_DynamicID_DataInterface {
	btns: {};
	divs: {
		colorBox1: string;
	};
	inputs: {};
	selects: {};
	spans: {};
}

interface DOM_StaticElement_DataInterface {
	btns: {
		desaturate: HTMLButtonElement | null;
		export: HTMLButtonElement | null;
		generate: HTMLButtonElement | null;
		helpMenu: HTMLButtonElement | null;
		historyMenu: HTMLButtonElement | null;
		ioMenu: HTMLButtonElement | null;
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
		ioMenu: HTMLDivElement | null;
		paletteHistory: HTMLDivElement | null;
	};
	inputs: {
		historyLimit: HTMLInputElement | null;
		import: HTMLInputElement | null;
		limitDarkChkbx: HTMLInputElement | null;
		limitGrayChkbx: HTMLInputElement | null;
		limitLightChkbx: HTMLInputElement | null;
	};
	selects: {
		exportFormatOption: HTMLSelectElement | null;
		paletteType: HTMLSelectElement | null;
		swatch: HTMLSelectElement | null;
		swatchGen: HTMLSelectElement | null;
	};
}

interface DOM_StaticID_DataInterface {
	btns: {
		desaturate: string;
		export: string;
		generate: string;
		helpMenu: string;
		historyMenu: string;
		ioMenu: string;
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
		ioMenu: string;
		paletteHistory: string;
	};
	inputs: {
		historyLimit: string;
		import: string;
		limitDarkChkbx: string;
		limitGrayChkbx: string;
		limitLightChkbx: string;
	};
	selects: {
		exportFormatOption: string;
		paletteType: string;
		swatch: string;
		swatchGen: string;
	};
}

export interface DOMDataInterface {
	ids: {
		dynamic: DOM_DynamicID_DataInterface;
		static: DOM_StaticID_DataInterface;
	};
	elements: {
		dynamic: DOM_DynamicElement_DataInterface;
		static: DOM_StaticElement_DataInterface;
	};
}
