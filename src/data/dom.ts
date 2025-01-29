// File: data/dom/dom.js

import { DOMDataInterface } from '../types/index.js';

const ids: DOMDataInterface['ids'] = {
	advancedMenu: 'advanced-menu',
	advancedMenuButton: 'advanced-menu-button',
	advancedMenuContent: 'advanced-menu-content',
	applyCustomColorButton: 'apply-custom-color-button',
	clearCustomColorButton: 'clear-custom-color-button',
	colorBox1: 'color-box-1',
	customColorDisplay: 'custom-color-display',
	customColorInput: 'custom-color-input',
	customColorMenu: 'custom-color-menu',
	customColorMenuButton: 'custom-color-menu-button',
	deleteDatabaseButton: 'delete-database-button',
	desaturateButton: 'desaturate-button',
	developerMenu: 'developer-menu',
	developerMenuButton: 'developer-menu-button',
	enableAlphaCheckbox: 'enable-alpha-checkbox',
	exportPaletteButton: 'export-palette-button',
	exportPaletteFormatOptions: 'export-palette-format-options',
	exportPaletteInput: 'export-palette-input',
	generateButton: 'generate-button',
	helpMenu: 'help-menu',
	helpMenuButton: 'help-menu-button',
	helpMenuContent: 'help-menu-content',
	historyMenu: 'history-menu',
	historyMenuButton: 'history-menu-button',
	historyMenuContent: 'history-menu-content',
	importExportMenu: 'import-export-menu',
	importExportMenuButton: 'import-export-menu-button',
	importPaletteInput: 'import-palette-input',
	limitDarknessCheckbox: 'limit-darkness-checkbox',
	limitGraynessCheckbox: 'limit-grayness-checkbox',
	limitLightnessCheckbox: 'limit-lightness-checkbox',
	paletteNumberOptions: 'palette-number-options',
	paletteTypeOptions: 'palette-type-options',
	resetDatabaseButton: 'reset-database-button',
	resetPaletteIDButton: 'reset-palette-id-button',
	saturateButton: 'saturate-button',
	selectedColorOption: 'selected-color-option',
	showAsCMYKButton: 'show-as-cmyk-button',
	showAsHexButton: 'show-as-hex-button',
	showAsHSLButton: 'show-as-hsl-button',
	showAsHSVButton: 'show-as-hsv-button',
	showAsLABButton: 'show-as-lab-button',
	showAsRGBButton: 'show-as-rgb-button'
} as const;

export const domData: DOMDataInterface = {
	elements: {
		buttons: {
			advancedMenuButton: document.getElementById(
				ids.advancedMenuButton
			) as HTMLButtonElement,
			applyCustomColorButton: document.getElementById(
				ids.applyCustomColorButton
			) as HTMLButtonElement,
			clearCustomColorButton: document.getElementById(
				ids.clearCustomColorButton
			) as HTMLButtonElement,
			customColorMenuButton: document.getElementById(
				ids.customColorMenuButton
			) as HTMLButtonElement,
			deleteDatabaseButton: document.getElementById(
				ids.deleteDatabaseButton
			) as HTMLButtonElement,
			desaturateButton: document.getElementById(
				ids.desaturateButton
			) as HTMLButtonElement,
			developerMenuButton: document.getElementById(
				ids.developerMenuButton
			) as HTMLButtonElement,
			exportPaletteButton: document.getElementById(
				ids.exportPaletteButton
			) as HTMLButtonElement,
			generateButton: document.getElementById(
				ids.generateButton
			) as HTMLButtonElement,
			helpMenuButton: document.getElementById(
				ids.helpMenuButton
			) as HTMLButtonElement,
			historyMenuButton: document.getElementById(
				ids.historyMenuButton
			) as HTMLButtonElement,
			importExportMenuButton: document.getElementById(
				ids.importExportMenuButton
			) as HTMLButtonElement,
			resetDatabaseButton: document.getElementById(
				ids.resetDatabaseButton
			) as HTMLButtonElement,
			resetPaletteIDButton: document.getElementById(
				ids.resetPaletteIDButton
			) as HTMLButtonElement,
			saturateButton: document.getElementById(
				ids.saturateButton
			) as HTMLButtonElement,
			showAsCMYKButton: document.getElementById(
				ids.showAsCMYKButton
			) as HTMLButtonElement,
			showAsHexButton: document.getElementById(
				ids.showAsHexButton
			) as HTMLButtonElement,
			showAsHSLButton: document.getElementById(
				ids.showAsHSLButton
			) as HTMLButtonElement,
			showAsHSVButton: document.getElementById(
				ids.showAsHSVButton
			) as HTMLButtonElement,
			showAsLABButton: document.getElementById(
				ids.showAsLABButton
			) as HTMLButtonElement,
			showAsRGBButton: document.getElementById(
				ids.showAsRGBButton
			) as HTMLButtonElement
		},
		divs: {
			advancedMenu: document.getElementById(
				ids.advancedMenu
			) as HTMLDivElement,
			advancedMenuContent: document.getElementById(
				ids.advancedMenuContent
			) as HTMLDivElement,
			colorBox1: document.getElementById(ids.colorBox1) as HTMLDivElement,
			customColorMenu: document.getElementById(
				ids.customColorMenu
			) as HTMLDivElement,
			developerMenu: document.getElementById(
				ids.developerMenu
			) as HTMLDivElement,
			helpMenu: document.getElementById(ids.helpMenu) as HTMLDivElement,
			helpMenuContent: document.getElementById(
				ids.helpMenuContent
			) as HTMLDivElement,
			historyMenu: document.getElementById(
				ids.historyMenu
			) as HTMLDivElement,
			historyMenuContent: document.getElementById(
				ids.historyMenuContent
			) as HTMLDivElement,
			importExportMenu: document.getElementById(
				ids.importExportMenu
			) as HTMLDivElement
		},
		inputs: {
			customColorInput: document.getElementById(
				ids.customColorInputID
			) as HTMLInputElement,
			enableAlphaCheckbox: document.getElementById(
				ids.enableAlphaCheckbox
			) as HTMLInputElement,
			exportPaletteInput: document.getElementById(
				ids.exportPaletteInput
			) as HTMLInputElement,
			importPaletteInput: document.getElementById(
				ids.importPaletteInput
			) as HTMLInputElement,
			limitDarknessCheckbox: document.getElementById(
				ids.limitDarknessCheckbox
			) as HTMLInputElement,
			limitGraynessCheckbox: document.getElementById(
				ids.limitGraynessCheckbox
			) as HTMLInputElement,
			limitLightnessCheckbox: document.getElementById(
				ids.limitLightnessCheckbox
			) as HTMLInputElement,
			paletteNumberOptions: document.getElementById(
				ids.paletteNumberOptions
			) as HTMLInputElement
		},
		select: {
			exportPaletteFormatOptions: document.getElementById(
				ids.exportPaletteFormatOptions
			) as HTMLSelectElement,
			paletteTypeOptions: document.getElementById(
				ids.paletteTypeOptions
			) as HTMLSelectElement,
			selectedColorOption: document.getElementById(
				ids.selectedColorOption
			) as HTMLSelectElement
		},
		spans: {
			customColorDisplay: document.getElementById(
				ids.customColorDisplay
			) as HTMLSpanElement
		}
	},
	ids
} as const;
