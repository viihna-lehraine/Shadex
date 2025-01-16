// File: src/dom/base.js

import { DOMBaseFnInterface, HSL, UIElements } from '../index/index.js';
import { core, helpers, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { log } from '../classes/logger/index.js';

const mode = data.mode;
const logMode = mode.logging;

function applyFirstColorToUI(color: HSL): HSL {
	try {
		const colorBox1 = document.getElementById('color-box-1');

		if (!colorBox1) {
			if (logMode.errors) log.error('color-box-1 is null');

			return color;
		}

		const formatColorString = core.convert.toCSSColorString(color);

		if (!formatColorString) {
			if (logMode.errors)
				log.error('Unexpected or unsupported color format.');

			return color;
		}

		colorBox1.style.backgroundColor = formatColorString;

		utils.palette.populateOutputBox(color, 1);

		return color;
	} catch (error) {
		if (logMode.errors)
			log.error(`Failed to apply first color to UI: ${error}`);

		return utils.random.hsl(false) as HSL;
	}
}

function copyToClipboard(text: string, tooltipElement: HTMLElement): void {
	try {
		const colorValue = text.replace('Copied to clipboard!', '').trim();

		navigator.clipboard
			.writeText(colorValue)
			.then(() => {
				helpers.dom.showTooltip(tooltipElement);
				if (
					!mode.quiet &&
					mode.debug &&
					logMode.verbosity > 2 &&
					logMode.info
				)
					log.info(`Copied color value: ${colorValue}`);

				setTimeout(
					() => tooltipElement.classList.remove('show'),
					data.consts.timeouts.tooltip || 1000
				);
			})
			.catch(err => {
				if (logMode.errors)
					log.error(`Error copying to clipboard: ${err}`);
			});
	} catch (error) {
		if (logMode.errors) log.error(`Failed to copy to clipboard: ${error}`);
		else if (!mode.quiet) log.error('Failed to copy to clipboard');
	}
}

function defineUIElements(): UIElements {
	const elements = data.consts.dom.elements;
	const selectedColor = elements.selectedColorOption
		? parseInt(elements.selectedColorOption.value, 10)
		: 0;

	return {
		advancedMenu: elements.advancedMenu,
		advancedMenuButton: elements.advancedMenuButton,
		advancedMenuContent: elements.advancedMenuContent,
		applyCustomColorButton: elements.applyCustomColorButton,
		clearCustomColorButton: elements.clearCustomColorButton,
		customColorDisplay: elements.customColorDisplay,
		customColorInput: elements.customColorInput,
		customColorMenu: elements.customColorMenu,
		customColorMenuButton: elements.customColorMenuButton,
		deleteDatabaseButton: elements.deleteDatabaseButton,
		desaturateButton: elements.desaturateButton,
		developerMenuButton: elements.developerMenuButton,
		enableAlphaCheckbox: elements.enableAlphaCheckbox,
		generateButton: elements.generateButton,
		helpMenu: elements.helpMenu,
		helpMenuButton: elements.helpMenuButton,
		helpMenuContent: elements.helpMenuContent,
		historyMenu: elements.historyMenu,
		historyMenuButton: elements.historyMenuButton,
		historyMenuContent: elements.historyMenuContent,
		limitDarknessCheckbox: elements.limitDarknessCheckbox,
		limitGraynessCheckbox: elements.limitGraynessCheckbox,
		limitLightnessCheckbox: elements.limitLightnessCheckbox,
		paletteNumberOptions: elements.paletteNumberOptions,
		paletteTypeOptions: elements.paletteTypeOptions,
		resetDatabaseButton: elements.resetDatabaseButton,
		resetPaletteIDButton: elements.resetPaletteIDButton,
		saturateButton: elements.saturateButton,
		selectedColor,
		selectedColorOption: elements.selectedColorOption,
		showAsCMYKButton: elements.showAsCMYKButton,
		showAsHexButton: elements.showAsHexButton,
		showAsHSLButton: elements.showAsHSLButton,
		showAsHSVButton: elements.showAsHSVButton,
		showAsLABButton: elements.showAsLABButton,
		showAsRGBButton: elements.showAsRGBButton
	};
}

async function initializeUI(): Promise<void> {
	if (logMode.info) log.info('Initializing with dynamically loaded elements');

	const buttons = defineUIElements();

	if (!buttons) {
		if (logMode.errors) log.error('Failed to initialize UI buttons');

		return;
	}

	// *DEV-NOTE* this is being added twice
	buttons.applyCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();

		if (logMode.clicks) log.info('applyCustomColorButton clicked');

		// *DEV-NOTE* add logic here...
	});
}

export const base: DOMBaseFnInterface = {
	applyFirstColorToUI,
	copyToClipboard,
	defineUIElements,
	initializeUI
} as const;
