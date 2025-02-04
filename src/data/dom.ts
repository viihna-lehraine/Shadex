// File: data/dom/dom.js

import { DOMDataInterface } from '../types/index.js';

const domClasses: DOMDataInterface['classes'] = {
	colorDisplay: 'color-display',
	colorInput: 'color-input',
	colorStripe: 'color-stripe',
	colorSwatch: 'color-swatch',
	dragBtn: 'drag-btn',
	lockBtn: 'lock-btn'
};

const dynamicIds: DOMDataInterface['ids']['dynamic'] = {
	btns: {
		colorBoxLockBtn1: 'color-box-lock-btn-1',
		colorBoxLockBtn2: 'color-box-lock-btn-2',
		colorBoxLockBtn3: 'color-box-lock-btn-3',
		colorBoxLockBtn4: 'color-box-lock-btn-4',
		colorBoxLockBtn5: 'color-box-lock-btn-5',
		colorBoxLockBtn6: 'color-box-lock-btn-6'
	},
	divs: {
		colorBox1: 'color-box-1',
		colorBox2: 'color-box-1',
		colorBox3: 'color-box-1',
		colorBox4: 'color-box-1',
		colorBox5: 'color-box-1',
		colorBox6: 'color-box-1',
		colorBoxDragBar1: 'color-box-drag-bar-1',
		colorBoxDragBar2: 'color-box-drag-bar-2',
		colorBoxDragBar3: 'color-box-drag-bar-3',
		colorBoxDragBar4: 'color-box-drag-bar-4',
		colorBoxDragBar5: 'color-box-drag-bar-5',
		colorBoxDragBar6: 'color-box-drag-bar-6',
		colorDisplay1: 'color-display-1',
		colorDisplay2: 'color-display-2',
		colorDisplay3: 'color-display-3',
		colorDisplay4: 'color-display-4',
		colorDisplay5: 'color-display-5',
		colorDisplay6: 'color-display-6'
	},
	inputs: {
		colorPicker1: 'color-picker-input-1',
		colorPicker2: 'color-picker-input-2',
		colorPicker3: 'color-picker-input-3',
		colorPicker4: 'color-picker-input-4',
		colorPicker5: 'color-picker-input-5',
		colorPicker6: 'color-picker-input-6',
		export: 'export-input'
	},
	selects: {},
	spans: {}
} as const;

const staticIds: DOMDataInterface['ids']['static'] = {
	btns: {
		desaturate: 'desaturate-btn',
		export: 'export-btn',
		generate: 'generate-btn',
		helpMenu: 'help-menu-btn',
		historyMenu: 'history-menu-btn',
		import: 'import-btn',
		saturate: 'saturate-btn',
		showAsCMYK: 'show-as-cmyk-btn',
		showAsHex: 'show-as-hex-btn',
		showAsHSL: 'show-as-hsl-btn',
		showAsHSV: 'show-as-hsv-btn',
		showAsLAB: 'show-as-lab-btn',
		showAsRGB: 'show-as-rgb-btn'
	},
	divs: {
		helpMenu: 'help-menu',
		historyMenu: 'history-menu',
		paletteContainer: 'palette-container',
		paletteHistory: 'palette-history'
	},
	inputs: {
		historyLimit: 'history-limit-input',
		limitDarkChkbx: 'limit-dark-chkbx',
		limitGrayChkbx: 'limit-gray-chkbx',
		limitLightChkbx: 'limit-light-chkbx'
	},
	selects: {
		exportFormatOption: 'export-format-option-selector',
		paletteType: 'palette-type-selector',
		swatch: 'swatch-selector',
		swatchGen: 'swatch-gen-selector'
	}
} as const;

// ******** Helpers ********

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

const dynamicDivIds = dynamicIds.divs;
const dynamicInputIds = dynamicIds.inputs;

const staticBtnIds = staticIds.btns;
const staticDivIds = staticIds.divs;
const staticInputIds = staticIds.inputs;
const staticSelectIds = staticIds.selects;

// ******** Dynamic DOM Data ********

const dynamicDomElements: DOMDataInterface['elements']['dynamic'] = {
	get btns() {
		return {
			colorBoxLockBtn1: getElement<HTMLButtonElement>(
				dynamicIds.btns.colorBoxLockBtn1
			),
			colorBoxLockBtn2: getElement<HTMLButtonElement>(
				dynamicIds.btns.colorBoxLockBtn2
			),
			colorBoxLockBtn3: getElement<HTMLButtonElement>(
				dynamicIds.btns.colorBoxLockBtn3
			),
			colorBoxLockBtn4: getElement<HTMLButtonElement>(
				dynamicIds.btns.colorBoxLockBtn4
			),
			colorBoxLockBtn5: getElement<HTMLButtonElement>(
				dynamicIds.btns.colorBoxLockBtn5
			),
			colorBoxLockBtn6: getElement<HTMLButtonElement>(
				dynamicIds.btns.colorBoxLockBtn6
			)
		};
	},
	get divs() {
		return {
			colorBox1: getElement<HTMLDivElement>(dynamicDivIds.colorBox1),
			colorBox2: getElement<HTMLDivElement>(dynamicDivIds.colorBox2),
			colorBox3: getElement<HTMLDivElement>(dynamicDivIds.colorBox3),
			colorBox4: getElement<HTMLDivElement>(dynamicDivIds.colorBox4),
			colorBox5: getElement<HTMLDivElement>(dynamicDivIds.colorBox5),
			colorBox6: getElement<HTMLDivElement>(dynamicDivIds.colorBox6),
			colorBoxDragBar1: getElement<HTMLDivElement>(
				dynamicDivIds.colorBoxDragBar1
			),
			colorBoxDragBar2: getElement<HTMLDivElement>(
				dynamicDivIds.colorBoxDragBar2
			),
			colorBoxDragBar3: getElement<HTMLDivElement>(
				dynamicDivIds.colorBoxDragBar3
			),
			colorBoxDragBar4: getElement<HTMLDivElement>(
				dynamicDivIds.colorBoxDragBar4
			),
			colorBoxDragBar5: getElement<HTMLDivElement>(
				dynamicDivIds.colorBoxDragBar5
			),
			colorBoxDragBar6: getElement<HTMLDivElement>(
				dynamicDivIds.colorBoxDragBar6
			),
			colorDisplay1: getElement<HTMLDivElement>(
				dynamicDivIds.colorDisplay1
			),
			colorDisplay2: getElement<HTMLDivElement>(
				dynamicDivIds.colorDisplay2
			),
			colorDisplay3: getElement<HTMLDivElement>(
				dynamicDivIds.colorDisplay3
			),
			colorDisplay4: getElement<HTMLDivElement>(
				dynamicDivIds.colorDisplay4
			),
			colorDisplay5: getElement<HTMLDivElement>(
				dynamicDivIds.colorDisplay5
			),
			colorDisplay6: getElement<HTMLDivElement>(
				dynamicDivIds.colorDisplay6
			)
		};
	},
	get inputs() {
		return {
			colorPicker1: getElement<HTMLInputElement>(
				dynamicInputIds.colorPicker1
			),
			colorPicker2: getElement<HTMLInputElement>(
				dynamicInputIds.colorPicker2
			),
			colorPicker3: getElement<HTMLInputElement>(
				dynamicInputIds.colorPicker3
			),
			colorPicker4: getElement<HTMLInputElement>(
				dynamicInputIds.colorPicker4
			),
			colorPicker5: getElement<HTMLInputElement>(
				dynamicInputIds.colorPicker5
			),
			colorPicker6: getElement<HTMLInputElement>(
				dynamicInputIds.colorPicker6
			),
			export: getElement<HTMLInputElement>(dynamicInputIds.export)
		};
	},
	get selects() {
		return {};
	},
	get spans() {
		return {};
	}
};

const dynamicDomIds: DOMDataInterface['ids']['dynamic'] = {
	btns: {
		colorBoxLockBtn1: dynamicIds.btns.colorBoxLockBtn1,
		colorBoxLockBtn2: dynamicIds.btns.colorBoxLockBtn2,
		colorBoxLockBtn3: dynamicIds.btns.colorBoxLockBtn3,
		colorBoxLockBtn4: dynamicIds.btns.colorBoxLockBtn4,
		colorBoxLockBtn5: dynamicIds.btns.colorBoxLockBtn5,
		colorBoxLockBtn6: dynamicIds.btns.colorBoxLockBtn6
	},
	divs: {
		colorBox1: dynamicDivIds.colorBox1,
		colorBox2: dynamicDivIds.colorBox2,
		colorBox3: dynamicDivIds.colorBox3,
		colorBox4: dynamicDivIds.colorBox4,
		colorBox5: dynamicDivIds.colorBox5,
		colorBox6: dynamicDivIds.colorBox6,
		colorDisplay1: dynamicDivIds.colorDisplay1,
		colorDisplay2: dynamicDivIds.colorDisplay2,
		colorDisplay3: dynamicDivIds.colorDisplay3,
		colorDisplay4: dynamicDivIds.colorDisplay4,
		colorDisplay5: dynamicDivIds.colorDisplay5,
		colorDisplay6: dynamicDivIds.colorDisplay6,
		colorBoxDragBar1: dynamicDivIds.colorBoxDragBar1,
		colorBoxDragBar2: dynamicDivIds.colorBoxDragBar2,
		colorBoxDragBar3: dynamicDivIds.colorBoxDragBar3,
		colorBoxDragBar4: dynamicDivIds.colorBoxDragBar4,
		colorBoxDragBar5: dynamicDivIds.colorBoxDragBar5,
		colorBoxDragBar6: dynamicDivIds.colorBoxDragBar6
	},
	inputs: {
		colorPicker1: dynamicInputIds.colorPicker1,
		colorPicker2: dynamicInputIds.colorPicker2,
		colorPicker3: dynamicInputIds.colorPicker3,
		colorPicker4: dynamicInputIds.colorPicker4,
		colorPicker5: dynamicInputIds.colorPicker5,
		colorPicker6: dynamicInputIds.colorPicker6,
		export: dynamicInputIds.export
	},
	selects: {},
	spans: {}
};

// ******** Static DOM Data ********

const staticDomElements: DOMDataInterface['elements']['static'] = {
	get btns() {
		return {
			desaturate: getElement<HTMLButtonElement>(staticBtnIds.desaturate),
			export: getElement<HTMLButtonElement>(staticBtnIds.export),
			generate: getElement<HTMLButtonElement>(staticBtnIds.generate),
			helpMenu: getElement<HTMLButtonElement>(staticBtnIds.helpMenu),
			historyMenu: getElement<HTMLButtonElement>(
				staticBtnIds.historyMenu
			),
			import: getElement<HTMLButtonElement>(staticBtnIds.import),
			saturate: getElement<HTMLButtonElement>(staticBtnIds.saturate),
			showAsCMYK: getElement<HTMLButtonElement>(staticBtnIds.showAsCMYK),
			showAsHex: getElement<HTMLButtonElement>(staticBtnIds.showAsHex),
			showAsHSL: getElement<HTMLButtonElement>(staticBtnIds.showAsHSL),
			showAsHSV: getElement<HTMLButtonElement>(staticBtnIds.showAsHSV),
			showAsLAB: getElement<HTMLButtonElement>(staticBtnIds.showAsLAB),
			showAsRGB: getElement<HTMLButtonElement>(staticBtnIds.showAsRGB)
		};
	},
	get divs() {
		return {
			helpMenu: getElement<HTMLDivElement>(staticDivIds.helpMenu),
			historyMenu: getElement<HTMLDivElement>(staticDivIds.historyMenu),
			paletteContainer: getElement<HTMLDivElement>(
				staticDivIds.paletteContainer
			),
			paletteHistory: getElement<HTMLDivElement>(
				staticDivIds.paletteHistory
			)
		};
	},
	get inputs() {
		return {
			historyLimit: getElement<HTMLInputElement>(
				staticInputIds.historyLimit
			),
			limitDarkChkbx: getElement<HTMLInputElement>(
				staticInputIds.limitDarkChkbx
			),
			limitGrayChkbx: getElement<HTMLInputElement>(
				staticInputIds.limitGrayChkbx
			),
			limitLightChkbx: getElement<HTMLInputElement>(
				staticInputIds.limitLightChkbx
			)
		};
	},
	get selects() {
		return {
			exportFormatOption: getElement<HTMLSelectElement>(
				staticSelectIds.exportFormatOption
			),
			paletteType: getElement<HTMLSelectElement>(
				staticSelectIds.paletteType
			),
			swatch: getElement<HTMLSelectElement>(staticSelectIds.swatch),
			swatchGen: getElement<HTMLSelectElement>(staticSelectIds.swatchGen)
		};
	}
};

const staticDomIds: DOMDataInterface['ids']['static'] = {
	btns: {
		desaturate: staticBtnIds.desaturate,
		export: staticBtnIds.export,
		generate: staticBtnIds.generate,
		helpMenu: staticBtnIds.helpMenu,
		historyMenu: staticBtnIds.historyMenu,
		import: staticBtnIds.import,
		saturate: staticBtnIds.saturate,
		showAsCMYK: staticBtnIds.showAsCMYK,
		showAsHex: staticBtnIds.showAsHex,
		showAsHSL: staticBtnIds.showAsHSL,
		showAsHSV: staticBtnIds.showAsHSV,
		showAsLAB: staticBtnIds.showAsLAB,
		showAsRGB: staticBtnIds.showAsRGB
	},
	divs: {
		helpMenu: staticDivIds.helpMenu,
		historyMenu: staticDivIds.historyMenu,
		paletteHistory: staticDivIds.paletteHistory,
		paletteContainer: staticDivIds.paletteContainer
	},
	inputs: {
		historyLimit: staticInputIds.historyLimit,
		limitDarkChkbx: staticInputIds.limitDarkChkbx,
		limitGrayChkbx: staticInputIds.limitGrayChkbx,
		limitLightChkbx: staticInputIds.limitLightChkbx
	},
	selects: {
		exportFormatOption: staticSelectIds.exportFormatOption,
		paletteType: staticSelectIds.paletteType,
		swatch: staticSelectIds.swatch,
		swatchGen: staticSelectIds.swatchGen
	}
};

// ******** Final DOM Data Object ********

export const domData: DOMDataInterface = {
	classes: domClasses,
	ids: {
		dynamic: dynamicDomIds,
		static: staticDomIds
	},
	elements: {
		dynamic: dynamicDomElements,
		static: staticDomElements
	}
} as const;
