// File: data/dom/dom.js

import { DOMDataInterface } from '../types/index.js';

const dynamicIds: DOMDataInterface['ids']['dynamic'] = {
	btns: {
		lock: {
			colorBtn1: 'color-box-1-lock-btn',
			colorBtn2: 'color-box-2-lock-btn',
			colorBtn3: 'color-box-3-lock-btn',
			colorBtn4: 'color-box-4-lock-btn',
			colorBtn5: 'color-box-5-lock-btn',
			colorBtn6: 'color-box-6-lock-btn'
		}
	},
	divs: {
		colorBox1: 'color-box-1',
		dragBar: {
			colorBox1: 'color-box-1-drag-bar',
			colorBox2: 'color-box-2-drag-bar',
			colorBox3: 'color-box-3-drag-bar',
			colorBox4: 'color-box-4-drag-bar',
			colorBox5: 'color-box-5-drag-bar',
			colorBox6: 'color-box-6-drag-bar'
		}
	},
	inputs: {
		colorPicker1: 'color-picker-1',
		colorPicker2: 'color-picker-2',
		colorPicker3: 'color-picker-3',
		colorPicker4: 'color-picker-4',
		colorPicker5: 'color-picker-5',
		colorPicker6: 'color-picker-6',
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
		ioMenu: 'io-menu-btn',
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
		ioMenu: 'io-menu',
		paletteHistory: 'palette-history'
	},
	inputs: {
		historyLimit: 'history-limit-input',
		import: 'import-input',
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

const staticBtnIds = staticIds.btns;
const staticDivIds = staticIds.divs;
const staticInputIds = staticIds.inputs;
const staticSelectIds = staticIds.selects;

// ******** Dynamic DOM Data ********

const dynamicDomElements: DOMDataInterface['elements']['dynamic'] = {
	get btns() {
		return {};
	},
	get divs() {
		return {
			colorBox1: getElement<HTMLDivElement>(dynamicDivIds.colorBox1)
		};
	},
	get inputs() {
		return {};
	},
	get selects() {
		return {};
	},
	get spans() {
		return {};
	}
};

const dynamicDomIds: DOMDataInterface['ids']['dynamic'] = {
	btns: {},
	divs: {
		colorBox1: dynamicDivIds.colorBox1
	},
	inputs: {},
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
			ioMenu: getElement<HTMLButtonElement>(staticBtnIds.ioMenu),
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
			ioMenu: getElement<HTMLDivElement>(staticDivIds.ioMenu),
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
			import: getElement<HTMLInputElement>(staticInputIds.import),
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
		ioMenu: staticBtnIds.ioMenu,
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
		ioMenu: staticDivIds.ioMenu,
		paletteHistory: staticDivIds.paletteHistory
	},
	inputs: {
		historyLimit: staticInputIds.historyLimit,
		import: staticInputIds.import,
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
	ids: {
		dynamic: dynamicDomIds,
		static: staticDomIds
	},
	elements: {
		dynamic: dynamicDomElements,
		static: staticDomElements
	}
} as const;
