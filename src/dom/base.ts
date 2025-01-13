// File: src/dom/base.js

import { DOMBaseFnInterface, HSL, UIElements } from '../index/index.js';
import { core, helpers, utils } from '../common/index.js';
import { data } from '../data/index.js';

const mode = data.mode;

function applyFirstColorToUI(color: HSL): HSL {
	try {
		const colorBox1 = document.getElementById('color-box-1');

		if (!colorBox1) {
			if (mode.errorLogs) console.error('color-box-1 is null');

			return color;
		}

		const formatColorString = core.convert.toCSSColorString(color);

		if (!formatColorString) {
			if (mode.errorLogs)
				console.error('Unexpected or unsupported color format.');

			return color;
		}

		colorBox1.style.backgroundColor = formatColorString;

		utils.palette.populateOutputBox(color, 1);

		return color;
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Failed to apply first color to UI: ${error}`);

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
				if (!mode.quiet)
					console.log(`Copied color value: ${colorValue}`);

				setTimeout(
					() => tooltipElement.classList.remove('show'),
					data.consts.timeouts.tooltip || 1000
				);
			})
			.catch(err => {
				if (mode.errorLogs)
					console.error('Error copying to clipboard:', err);
			});
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Failed to copy to clipboard: ${error}`);
		else if (!mode.quiet) console.error('Failed to copy to clipboard');
	}
}

function defineUIElements(): UIElements {
	try {
		const advancedMenuButton = data.consts.dom.elements.advancedMenuButton;
		const applyCustomColorButton =
			data.consts.dom.elements.applyCustomColorButton;
		const clearCustomColorButton =
			data.consts.dom.elements.clearCustomColorButton;
		const closeCustomColorMenuButton =
			data.consts.dom.elements.closeCustomColorMenuButton;
		const closeHelpMenuButton =
			data.consts.dom.elements.closeHelpMenuButton;
		const closeHistoryMenuButton =
			data.consts.dom.elements.closeHistoryMenuButton;
		const desaturateButton = data.consts.dom.elements.desaturateButton;
		const enableAlphaCheckbox =
			data.consts.dom.elements.enableAlphaCheckbox;
		const generateButton = data.consts.dom.elements.generateButton;
		const helpMenuButton = data.consts.dom.elements.helpMenuButton;
		const historyMenuButton = data.consts.dom.elements.historyMenuButton;
		const limitDarknessCheckbox =
			data.consts.dom.elements.limitDarknessCheckbox;
		const limitGraynessCheckbox =
			data.consts.dom.elements.limitGraynessCheckbox;
		const limitLightnessCheckbox =
			data.consts.dom.elements.limitLightnessCheckbox;
		const saturateButton = data.consts.dom.elements.saturateButton;
		const selectedColorOption =
			data.consts.dom.elements.selectedColorOption;
		const showAsCMYKButton = data.consts.dom.elements.showAsCMYKButton;
		const showAsHexButton = data.consts.dom.elements.showAsHexButton;
		const showAsHSLButton = data.consts.dom.elements.showAsHSLButton;
		const showAsHSVButton = data.consts.dom.elements.showAsHSVButton;
		const showAsLABButton = data.consts.dom.elements.showAsLABButton;
		const showAsRGBButton = data.consts.dom.elements.showAsRGBButton;

		const selectedColor = selectedColorOption
			? parseInt(selectedColorOption.value, 10)
			: 0;

		return {
			advancedMenuButton,
			applyCustomColorButton,
			clearCustomColorButton,
			closeCustomColorMenuButton,
			closeHelpMenuButton,
			closeHistoryMenuButton,
			desaturateButton,
			enableAlphaCheckbox,
			generateButton,
			helpMenuButton,
			historyMenuButton,
			limitDarknessCheckbox,
			limitGraynessCheckbox,
			limitLightnessCheckbox,
			saturateButton,
			selectedColor,
			showAsCMYKButton,
			showAsHexButton,
			showAsHSLButton,
			showAsHSVButton,
			showAsLABButton,
			showAsRGBButton
		};
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Failed to define UI buttons: ${error}.`);
		if (!mode.quiet) console.error('Failed to define UI buttons.');

		return {
			advancedMenuButton: null,
			applyCustomColorButton: null,
			clearCustomColorButton: null,
			closeCustomColorMenuButton: null,
			closeHelpMenuButton: null,
			closeHistoryMenuButton: null,
			desaturateButton: null,
			enableAlphaCheckbox: null,
			generateButton: null,
			helpMenuButton: null,
			historyMenuButton: null,
			limitDarknessCheckbox: null,
			limitLightnessCheckbox: null,
			limitGraynessCheckbox: null,
			saturateButton: null,
			selectedColor: 0,
			showAsCMYKButton: null,
			showAsHexButton: null,
			showAsHSLButton: null,
			showAsHSVButton: null,
			showAsLABButton: null,
			showAsRGBButton: null
		};
	}
}

async function initializeUI(): Promise<void> {
	console.log('Initializing UI with dynamically loaded elements');
	const buttons = defineUIElements();

	if (!buttons) {
		console.error('Failed to initialize UI buttons');
		return;
	}

	buttons.applyCustomColorButton?.addEventListener('click', async e => {
		e.preventDefault();
		console.log('applyCustomColorButton clicked');
		// *DEV-NOTE* add logic here...
	});
}

export const base: DOMBaseFnInterface = {
	applyFirstColorToUI,
	copyToClipboard,
	defineUIElements,
	initializeUI
} as const;
