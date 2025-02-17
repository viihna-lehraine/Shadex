// File: data/dom/dom.js

import { DOMDataInterface } from '../types/index.js';

const classes: DOMDataInterface['classes'] = {
	colorDisplay: 'color-display',
	colorInput: 'color-input',
	colorInputBtn: 'color-input-btn',
	colorInputModal: 'color-input-modal',
	colorStripe: 'color-stripe',
	colorSwatch: 'color-swatch',
	dragHandle: 'drag-handle',
	hidden: 'hidden',
	lockBtn: 'lock-btn',
	locked: 'locked',
	modal: 'modal',
	modalTrigger: 'modal-trigger',
	paletteColumn: 'palette-column',
	resizeHandle: 'resize-handle',
	tooltipContainer: 'tooltip-container',
	tooltipTrigger: 'tooltip-trigger'
};

const ids: DOMDataInterface['ids'] = {
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
		limitDarkChkbx: 'limit-dark-chkbx',
		limitGrayChkbx: 'limit-gray-chkbx',
		limitLightChkbx: 'limit-light-chkbx'
	},
	selectors: {
		paletteColumn: 'palette-column-selector',
		paletteColumnCount: 'palette-column-count-selector',
		paletteType: 'palette-type-selector'
	}
} as const;

const dynamicIDs: DOMDataInterface['dynamicIDs'] = {
	divs: {
		globalTooltip: 'global-tooltip'
	}
};

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

const btnIds = ids.btns;
const divIds = ids.divs;
const inputIds = ids.inputs;
const selectorIds = ids.selectors;

const dynamicElements: DOMDataInterface['dynamicElements'] = {
	divs: {
		globalTooltip: getElement<HTMLDivElement>(dynamicIDs.divs.globalTooltip)
	}
};

const elements: DOMDataInterface['elements'] = {
	get btns() {
		return {
			desaturate: getElement<HTMLButtonElement>(btnIds.desaturate),
			export: getElement<HTMLButtonElement>(btnIds.export),
			generate: getElement<HTMLButtonElement>(btnIds.generate),
			helpMenu: getElement<HTMLButtonElement>(btnIds.helpMenu),
			historyMenu: getElement<HTMLButtonElement>(btnIds.historyMenu),
			import: getElement<HTMLButtonElement>(btnIds.import),
			saturate: getElement<HTMLButtonElement>(btnIds.saturate),
			showAsCMYK: getElement<HTMLButtonElement>(btnIds.showAsCMYK),
			showAsHex: getElement<HTMLButtonElement>(btnIds.showAsHex),
			showAsHSL: getElement<HTMLButtonElement>(btnIds.showAsHSL),
			showAsHSV: getElement<HTMLButtonElement>(btnIds.showAsHSV),
			showAsLAB: getElement<HTMLButtonElement>(btnIds.showAsLAB),
			showAsRGB: getElement<HTMLButtonElement>(btnIds.showAsRGB)
		};
	},
	get divs() {
		return {
			helpMenu: getElement<HTMLDivElement>(divIds.helpMenu),
			historyMenu: getElement<HTMLDivElement>(divIds.historyMenu),
			paletteContainer: getElement<HTMLDivElement>(
				divIds.paletteContainer
			),
			paletteHistory: getElement<HTMLDivElement>(divIds.paletteHistory)
		};
	},
	get inputs() {
		return {
			limitDarkChkbx: getElement<HTMLInputElement>(
				inputIds.limitDarkChkbx
			),
			limitGrayChkbx: getElement<HTMLInputElement>(
				inputIds.limitGrayChkbx
			),
			limitLightChkbx: getElement<HTMLInputElement>(
				inputIds.limitLightChkbx
			)
		};
	},
	get selectors() {
		return {
			paletteColumn: getElement<HTMLSelectElement>(
				selectorIds.paletteColumn
			),
			paletteColumnCount: getElement<HTMLSelectElement>(
				selectorIds.paletteColumnCount
			),
			paletteType: getElement<HTMLSelectElement>(selectorIds.paletteType)
		};
	}
};

export const domData: DOMDataInterface = {
	classes,
	dynamicElements,
	dynamicIDs,
	ids,
	elements
} as const;
