// File: data/core/dom.js

interface DOM_ClassesInterface {
	colorDisplay: string;
	colorInput: string;
	colorStripe: string;
	colorSwatch: string;
	dragBtn: string;
	lockBtn: string;
}

interface DOM_DynamicElement_DataInterface {
	btns: {
		colorBoxLockBtn1: HTMLButtonElement | null;
		colorBoxLockBtn2: HTMLButtonElement | null;
		colorBoxLockBtn3: HTMLButtonElement | null;
		colorBoxLockBtn4: HTMLButtonElement | null;
		colorBoxLockBtn5: HTMLButtonElement | null;
		colorBoxLockBtn6: HTMLButtonElement | null;
	};
	divs: {
		colorBox1: HTMLDivElement | null;
		colorBox2: HTMLDivElement | null;
		colorBox3: HTMLDivElement | null;
		colorBox4: HTMLDivElement | null;
		colorBox5: HTMLDivElement | null;
		colorBox6: HTMLDivElement | null;
		colorBoxDragBar1: HTMLDivElement | null;
		colorBoxDragBar2: HTMLDivElement | null;
		colorBoxDragBar3: HTMLDivElement | null;
		colorBoxDragBar4: HTMLDivElement | null;
		colorBoxDragBar5: HTMLDivElement | null;
		colorBoxDragBar6: HTMLDivElement | null;
		colorDisplay1: HTMLDivElement | null;
		colorDisplay2: HTMLDivElement | null;
		colorDisplay3: HTMLDivElement | null;
		colorDisplay4: HTMLDivElement | null;
		colorDisplay5: HTMLDivElement | null;
		colorDisplay6: HTMLDivElement | null;
	};
	inputs: {
		colorPicker1: HTMLInputElement | null;
		colorPicker2: HTMLInputElement | null;
		colorPicker3: HTMLInputElement | null;
		colorPicker4: HTMLInputElement | null;
		colorPicker5: HTMLInputElement | null;
		colorPicker6: HTMLInputElement | null;
	};
	selects: {};
	spans: {};
}

interface DOM_DynamicID_DataInterface {
	btns: {
		colorBoxLockBtn1: string;
		colorBoxLockBtn2: string;
		colorBoxLockBtn3: string;
		colorBoxLockBtn4: string;
		colorBoxLockBtn5: string;
		colorBoxLockBtn6: string;
	};
	divs: {
		colorBox1: string;
		colorBox2: string;
		colorBox3: string;
		colorBox4: string;
		colorBox5: string;
		colorBox6: string;
		colorBoxDragBar1: string;
		colorBoxDragBar2: string;
		colorBoxDragBar3: string;
		colorBoxDragBar4: string;
		colorBoxDragBar5: string;
		colorBoxDragBar6: string;
		colorDisplay1: string;
		colorDisplay2: string;
		colorDisplay3: string;
		colorDisplay4: string;
		colorDisplay5: string;
		colorDisplay6: string;
	};
	inputs: {
		colorPicker1: string;
		colorPicker2: string;
		colorPicker3: string;
		colorPicker4: string;
		colorPicker5: string;
		colorPicker6: string;
		export: string;
	};
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
		paletteHistory: HTMLDivElement | null;
	};
	inputs: {
		historyLimit: HTMLInputElement | null;
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
		historyLimit: string;
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
	classes: DOM_ClassesInterface;
	ids: {
		dynamic: DOM_DynamicID_DataInterface;
		static: DOM_StaticID_DataInterface;
	};
	elements: {
		dynamic: DOM_DynamicElement_DataInterface;
		static: DOM_StaticElement_DataInterface;
	};
}
