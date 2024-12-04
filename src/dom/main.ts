// File: src/dom/main.ts

import {
	Color,
	ColorInputElement,
	ColorSpace,
	GetElementsForSelectedColor,
	HSL,
	PullParamsFromUI,
	SL,
	SV,
	UIElements
} from '../index';
import { config } from '../config';
import { core, helpers, utils } from '../common';
import { paletteUtils } from '../palette/utils';

export function addConversionButtonEventListeners(): void {
	try {
		const addListener = (id: string, colorSpace: ColorSpace) => {
			const button = document.getElementById(
				id
			) as HTMLButtonElement | null;

			if (button) {
				button.addEventListener('click', () =>
					switchColorSpace(colorSpace)
				);
			} else {
				console.warn(`Element with id "${id}" not found.`);
			}
		};

		addListener('show-as-cmyk-button', 'cmyk');
		addListener('show-as-hex-button', 'hex');
		addListener('show-as-hsl-button', 'hsl');
		addListener('show-as-hsv-button', 'hsv');
		addListener('show-as-lab-button', 'lab');
		addListener('show-as-rgb-button', 'rgb');
	} catch (error) {
		console.error(
			`Failed to add event listeners to conversion buttons: ${error}`
		);

		return;
	}
}

export function applyCustomColor(): HSL {
	try {
		const colorPicker = document.getElementById(
			'custom-color-picker'
		) as HTMLInputElement | null;

		if (!colorPicker) {
			throw new Error('Color picker element not found');
		}

		const rawValue = colorPicker.value.trim();
		const selectedFormat = (
			document.getElementById(
				'custom-color-format'
			) as HTMLSelectElement | null
		)?.value as ColorSpace;

		if (!utils.color.isColorSpace(selectedFormat)) {
			throw new Error(`Unsupported color format: ${selectedFormat}`);
		}

		const parsedColor = utils.color.parseColor(
			selectedFormat,
			rawValue
		) as Exclude<Color, SL | SV>;

		if (!parsedColor) {
			throw new Error(`Invalid color value: ${rawValue}`);
		}

		const hslColor = utils.color.isHSLColor(parsedColor)
			? parsedColor
			: paletteUtils.toHSL(parsedColor);

		return hslColor;
	} catch (error) {
		console.error(
			`Failed to apply custom color: ${error}. Returning randomly generated hex color`
		);

		return utils.random.hsl(false) as HSL;
	}
}

export function applyFirstColorToUI(color: HSL): HSL {
	try {
		const colorBox1 = document.getElementById('color-box-1');

		if (!colorBox1) {
			console.error('color-box-1 is null');

			return color;
		}

		const formatColorString = core.getCSSColorString(color);

		if (!formatColorString) {
			console.error('Unexpected or unsupported color format.');

			return color;
		}

		colorBox1.style.backgroundColor = formatColorString;

		utils.palette.populateOutputBox(color, 1);

		return color;
	} catch (error) {
		console.error(`Failed to apply first color to UI: ${error}`);

		return utils.random.hsl(false) as HSL;
	}
}

export function copyToClipboard(
	text: string,
	tooltipElement: HTMLElement
): void {
	try {
		const colorValue = text.replace('Copied to clipboard!', '').trim();

		navigator.clipboard
			.writeText(colorValue)
			.then(() => {
				helpers.dom.showTooltip(tooltipElement);
				console.log(`Copied color value: ${colorValue}`);

				setTimeout(
					() => tooltipElement.classList.remove('show'),
					config.consts.timeouts.tooltip || 1000
				);
			})
			.catch(err => {
				console.error('Error copying to clipboard:', err);
			});
	} catch (error) {
		console.error(`Failed to copy to clipboard: ${error}`);
	}
}

export function defineUIElements(): UIElements {
	try {
		const advancedMenuButton = config.consts.dom.advancedMenuButton;

		const applyCustomColorButton = config.consts.dom.applyCustomColorButton;

		const clearCustomColorButton = config.consts.dom.clearCustomColorButton;

		const closeCustomColorMenuButton =
			config.consts.dom.closeCustomColorMenuButton;

		const closeHelpMenuButton = config.consts.dom.closeHelpMenuButton;

		const closeHistoryMenuButton = config.consts.dom.closeHistoryMenuButton;

		const desaturateButton = config.consts.dom.desaturateButton;

		const enableAlphaCheckbox = config.consts.dom.enableAlphaCheckbox;

		const generateButton = config.consts.dom.generateButton;

		const helpMenuButton = config.consts.dom.helpMenuButton;

		const historyMenuButton = config.consts.dom.historyMenuButton;

		const limitDarknessCheckbox = config.consts.dom.limitDarknessCheckbox;

		const limitGraynessCheckbox = config.consts.dom.limitGraynessCheckbox;

		const limitLightnessCheckbox = config.consts.dom.limitLightnessCheckbox;

		const saturateButton = config.consts.dom.saturateButton;

		const selectedColorOption = config.consts.dom.selectedColorOption;

		const showAsCMYKButton = config.consts.dom.showAsCMYKButton;

		const showAsHexButton = config.consts.dom.showAsHexButton;

		const showAsHSLButton = config.consts.dom.showAsHSLButton;

		const showAsHSVButton = config.consts.dom.showAsHSVButton;

		const showAsLABButton = config.consts.dom.showAsLABButton;

		const showAsRGBButton = config.consts.dom.showAsRGBButton;

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
		console.error('Failed to define UI buttons:', error);

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

export function desaturateColor(selectedColor: number): void {
	try {
		getElementsForSelectedColor(selectedColor);
	} catch (error) {
		console.error(`Failed to desaturate color: ${error}`);
	}
}

export function getElementsForSelectedColor(
	selectedColor: number
): GetElementsForSelectedColor {
	const selectedColorBox = document.getElementById(
		`color-box-${selectedColor}`
	);

	if (!selectedColorBox) {
		console.warn(`Element not found for color ${selectedColor}`);

		helpers.dom.showToast('Please select a valid color.');

		return {
			selectedColorTextOutputBox: null,
			selectedColorBox: null,
			selectedColorStripe: null
		};
	}

	return {
		selectedColorTextOutputBox: document.getElementById(
			`color-text-output-box-${selectedColor}`
		),
		selectedColorBox,
		selectedColorStripe: document.getElementById(
			`color-stripe-${selectedColor}`
		)
	};
}

export function pullParamsFromUI(): PullParamsFromUI {
	try {
		const paletteTypeOptionsElement = config.consts.dom.paletteTypeOptions;
		const numBoxesElement = config.consts.dom.paletteNumberOptions;
		const enableAlphaCheckbox = config.consts.dom.enableAlphaCheckbox;
		const limitDarknessCheckbox = config.consts.dom.limitDarknessCheckbox;
		const limitGraynessCheckbox = config.consts.dom.limitGraynessCheckbox;
		const limitLightnessCheckbox = config.consts.dom.limitLightnessCheckbox;

		return {
			paletteType: paletteTypeOptionsElement
				? parseInt(paletteTypeOptionsElement.value, 10)
				: 0,
			numBoxes: numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0,
			enableAlpha: enableAlphaCheckbox?.checked || false,
			limitDarkness: limitDarknessCheckbox?.checked || false,
			limitGrayness: limitGraynessCheckbox?.checked || false,
			limitLightness: limitLightnessCheckbox?.checked || false
		};
	} catch (error) {
		console.error(`Failed to pull parameters from UI: ${error}`);
		return {
			paletteType: 0,
			numBoxes: 0,
			enableAlpha: false,
			limitDarkness: false,
			limitGrayness: false,
			limitLightness: false
		};
	}
}

export function saturateColor(selectedColor: number): void {
	try {
		getElementsForSelectedColor(selectedColor);
	} catch (error) {
		console.error(`Failed to saturate color: ${error}`);
	}
}

export function showCustomColorPopupDiv(): void {
	try {
		const popup = document.getElementById('popup-div');

		if (popup) {
			popup.classList.toggle('show');
		} else {
			console.error("document.getElementById('popup-div') is undefined");

			return;
		}
	} catch (error) {
		console.error(`Failed to show custom color popup div: ${error}`);
	}
}

export function switchColorSpace(targetFormat: ColorSpace): void {
	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		colorTextOutputBoxes.forEach(box => {
			const inputBox = box as ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (!colorValues || !core.validateColorValues(colorValues)) {
				console.error('Invalid color values.');

				helpers.dom.showToast('Invalid color values.');

				return;
			}

			const currentFormat = inputBox.getAttribute(
				'data-format'
			) as ColorSpace;

			console.log(`Converting from ${currentFormat} to ${targetFormat}`);

			const convertFn = utils.conversion.getConversionFn(
				currentFormat,
				targetFormat
			);

			if (!convertFn) {
				console.error(
					`Conversion from ${currentFormat} to ${targetFormat} is not supported.`
				);

				helpers.dom.showToast('Conversion not supported.');

				return;
			}

			if (colorValues.format === 'xyz') {
				console.error(
					'Cannot convert from XYZ to another color space.'
				);

				helpers.dom.showToast('Conversion not supported.');

				return;
			}

			const clonedColor = utils.color.narrowToColor(colorValues);

			if (
				!clonedColor ||
				utils.color.isSLColor(clonedColor) ||
				utils.color.isSVColor(clonedColor) ||
				utils.color.isXYZ(clonedColor)
			) {
				console.error(
					'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.'
				);

				helpers.dom.showToast('Conversion not supported.');

				return;
			}

			if (!clonedColor) {
				console.error(`Conversion to ${targetFormat} failed.`);

				helpers.dom.showToast('Conversion failed.');

				return;
			}

			const newColor = core.clone(convertFn(clonedColor));

			if (!newColor) {
				console.error(`Conversion to ${targetFormat} failed.`);

				helpers.dom.showToast('Conversion failed.');

				return;
			}

			inputBox.value = String(newColor);

			inputBox.setAttribute('data-format', targetFormat);
		});
	} catch (error) {
		throw new Error(`Failed to convert colors: ${error as Error}`);
	}
}
