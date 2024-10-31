import { getConversionFn } from '../color-spaces/conversion';
import { config } from '../config/constants';
import { domHelpers } from '../helpers/dom';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import * as domTypes from '../index/dom-types';
import { toHSL } from '../color-spaces/conversion-index';
import { generate } from '../palette-gen/generate';
import { genRandomColor } from '../utils/random-color';
import { core } from '../utils/core';
import { transform } from '../utils/transform';
import { guards } from '../utils/type-guards';

function addConversionButtonEventListeners(): void {
	try {
		const addListener = (id: string, colorSpace: colors.ColorSpace) => {
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

		addListener('show-hex-button', 'hex');
		addListener('show-rgb-button', 'rgb');
		addListener('show-hsv-button', 'hsv');
		addListener('show-hsl-button', 'hsl');
		addListener('show-cmyk-button', 'cmyk');
		addListener('show-lab-button', 'lab');
	} catch (error) {
		console.error(
			`Failed to add event listeners to conversion buttons: ${error}`
		);

		return;
	}
}

function applyCustomColor(): colors.HSL {
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
		)?.value as colors.ColorSpace;

		if (!guards.isColorSpace(selectedFormat)) {
			throw new Error(`Unsupported color format: ${selectedFormat}`);
		}

		const parsedColor = transform.parseColor(selectedFormat, rawValue);

		if (!parsedColor) {
			throw new Error(`Invalid color value: ${rawValue}`);
		}

		const hslColor = guards.isHSLColor(parsedColor)
			? parsedColor
			: toHSL(parsedColor);

		return hslColor;
	} catch (error) {
		console.error(
			`Failed to apply custom color: ${error}. Returning randomly generated hex color`
		);

		return genRandomColor('hsl') as colors.HSL;
	}
}

function applyFirstColorToUI(color: colors.HSL): colors.HSL {
	try {
		const colorBox1 = document.getElementById('color-box-1');

		if (!colorBox1) {
			console.error('color-box-1 is null');

			return color;
		}

		const formatColorString = transform.getCSSColorString(color);

		if (!formatColorString) {
			console.error('Unexpected or unsupported color format.');

			return color;
		}

		colorBox1.style.backgroundColor = formatColorString;

		populateColorTextOutputBox(color, 1);

		return color;
	} catch (error) {
		console.error(`Failed to apply first color to UI: ${error}`);

		return genRandomColor('hsl') as colors.HSL;
	}
}

function copyToClipboard(text: string, tooltipElement: HTMLElement): void {
	try {
		const colorValue = text.replace('Copied to clipboard!', '').trim();

		navigator.clipboard
			.writeText(colorValue)
			.then(() => {
				domHelpers.showTooltip(tooltipElement);
				console.log(`Copied color value: ${colorValue}`);

				setTimeout(
					() => tooltipElement.classList.remove('show'),
					config.tooltipTimeout || 1000
				);
			})
			.catch(err => {
				console.error('Error copying to clipboard:', err);
			});
	} catch (error) {
		console.error(`Failed to copy to clipboard: ${error}`);
	}
}

function defineUIElements(): domTypes.UIElements {
	try {
		const advancedMenuToggleButton = config.advancedMenuToggleButton;
		const applyCustomColorButton = config.advancedMenuToggleButton;
		const clearCustomColorButton = config.clearCustomColorButton;
		const customColorToggleButton = config.customColorToggleButton;
		const desaturateButton = config.desaturateButton;
		const enableAlphaCheckbox = config.enableAlphaCheckbox;
		const generateButton = config.generateButton;
		const limitBrightCheckbox = config.limitBrightCheckbox;
		const limitDarkCheckbox = config.limitDarkCheckbox;
		const limitGrayCheckbox = config.limitGrayCheckbox;
		const popupDivButton = config.popupDivButton;
		const saturateButton = config.saturateButton;
		const selectedColorOptions = config.selectedColorOptions;

		const selectedColor = selectedColorOptions
			? parseInt(selectedColorOptions.value, 10)
			: 0;

		return {
			advancedMenuToggleButton,
			applyCustomColorButton,
			clearCustomColorButton,
			customColorToggleButton,
			desaturateButton,
			enableAlphaCheckbox,
			generateButton,
			limitBrightCheckbox,
			limitDarkCheckbox,
			limitGrayCheckbox,
			popupDivButton,
			saturateButton,
			selectedColor
		};
	} catch (error) {
		console.error('Failed to define UI buttons:', error);
		return {
			advancedMenuToggleButton: null,
			applyCustomColorButton: null,
			clearCustomColorButton: null,
			customColorToggleButton: null,
			desaturateButton: null,
			enableAlphaCheckbox: null,
			generateButton: null,
			limitBrightCheckbox: null,
			limitDarkCheckbox: null,
			limitGrayCheckbox: null,
			popupDivButton: null,
			saturateButton: null,
			selectedColor: 0
		};
	}
}

function desaturateColor(selectedColor: number): void {
	try {
		getElementsForSelectedColor(selectedColor);
	} catch (error) {
		console.error(`Failed to desaturate color: ${error}`);
	}
}

function getElementsForSelectedColor(
	selectedColor: number
): domTypes.GetElementsForSelectedColor {
	const selectedColorBox = document.getElementById(
		`color-box-${selectedColor}`
	);

	if (!selectedColorBox) {
		console.warn(`Element not found for color ${selectedColor}`);
		domHelpers.showToast('Please select a valid color.');
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

function getGenerateButtonParams(): domTypes.GenButtonParams | null {
	try {
		const paletteNumberOptions = config.paletteNumberOptions;
		const paletteTypeOptions = config.paletteTypeOptions;
		const customColorRaw = config.customColorElement?.value;
		const enableAlphaCheckbox = config.enableAlphaCheckbox;
		const limitBrightCheckbox = config.limitBrightCheckbox;
		const limitDarkCheckbox = config.limitDarkCheckbox;
		const limitGrayCheckbox = config.limitGrayCheckbox;

		if (
			paletteNumberOptions === null ||
			paletteTypeOptions === null ||
			enableAlphaCheckbox === null ||
			limitBrightCheckbox === null ||
			limitDarkCheckbox === null ||
			limitGrayCheckbox === null
		) {
			console.error('One or more elements are null');

			return null;
		}

		const customColor = customColorRaw
			? (transform.parseCustomColor(customColorRaw) as colors.HSL | null)
			: null;
		const enableAlpha = enableAlphaCheckbox.checked;
		const limitBright = limitBrightCheckbox.checked;
		const limitDark = limitDarkCheckbox.checked;
		const limitGray = limitGrayCheckbox.checked;

		console.log(
			`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`
		);

		return {
			numBoxes: parseInt(paletteNumberOptions.value, 10),
			paletteType: parseInt(paletteTypeOptions.value, 10),
			customColor,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		};
	} catch (error) {
		console.error('Failed to retrieve generateButton parameters:', error);

		return null;
	}
}

const handleGenButtonClick = core.debounce(() => {
	try {
		const params = getGenerateButtonParams();

		if (!params) {
			console.error('Failed to retrieve generateButton parameters');
			return;
		}

		const {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		} = params;

		if (!paletteType || !numBoxes) {
			console.error('paletteType and/or numBoxes are undefined');
			return;
		}

		const options: colors.PaletteOptions = {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		};

		generate.startPaletteGen(options);
	} catch (error) {
		console.error(`Failed to handle generate button click: ${error}`);
	}
}, config.buttonDebounce || 300);

function populateColorTextOutputBox(
	color: colors.Color | colors.ColorString,
	boxNumber: number
): void {
	try {
		const clonedColor: colors.Color = guards.isColor(color)
			? core.clone(color)
			: transform.colorStringToColor(color);

		if (!paletteHelpers.validateColorValues(clonedColor)) {
			console.error('Invalid color values.');

			domHelpers.showToast('Invalid color values.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = transform.getCSSColorString(clonedColor);

		console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		console.error('Failed to populate color text output box:', error);

		return;
	}
}

function pullParamsFromUI(): domTypes.PullParamsFromUI {
	try {
		const paletteTypeElement = document.getElementById(
			'palette-type-options'
		) as HTMLSelectElement | null;
		const numBoxesElement = document.getElementById(
			'palette-number-options'
		) as HTMLSelectElement | null;

		const paletteType = paletteTypeElement
			? parseInt(paletteTypeElement.value, 10)
			: 0;
		const numBoxes = numBoxesElement
			? parseInt(numBoxesElement.value, 10)
			: 0;

		return {
			paletteType,
			numBoxes
		};
	} catch (error) {
		console.error(`Failed to pull parameters from UI: ${error}`);
		return {
			paletteType: 0,
			numBoxes: 0
		};
	}
}

function saturateColor(selectedColor: number): void {
	try {
		getElementsForSelectedColor(selectedColor);
	} catch (error) {
		console.error(`Failed to saturate color: ${error}`);
	}
}

function showCustomColorPopupDiv(): void {
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

function switchColorSpace(targetFormat: colors.ColorSpace): void {
	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		colorTextOutputBoxes.forEach(box => {
			const inputBox = box as domTypes.ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (
				!colorValues ||
				!paletteHelpers.validateColorValues(colorValues)
			) {
				console.error('Invalid color values.');
				domHelpers.showToast('Invalid color values.');
				return;
			}

			const currentFormat = inputBox.getAttribute(
				'data-format'
			) as colors.ColorSpace;

			console.log(`Converting from ${currentFormat} to ${targetFormat}`);

			const convertFn = getConversionFn(currentFormat, targetFormat);

			if (!convertFn) {
				console.error(
					`Conversion from ${currentFormat} to ${targetFormat} is not supported.`
				);
				domHelpers.showToast('Conversion not supported.');
				return;
			}

			if (colorValues.format === 'xyz') {
				console.error(
					'Cannot convert from XYZ to another color space.'
				);
				domHelpers.showToast('Conversion not supported.');
				return;
			}

			const clonedColor = guards.narrowToColor(colorValues);

			if (
				!clonedColor ||
				guards.isSLColor(clonedColor) ||
				guards.isSVColor(clonedColor) ||
				guards.isXYZ(clonedColor)
			) {
				console.error(
					'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.'
				);

				domHelpers.showToast('Conversion not supported.');

				return;
			}

			if (!clonedColor) {
				console.error(`Conversion to ${targetFormat} failed.`);

				domHelpers.showToast('Conversion failed.');

				return;
			}

			const newColor = core.clone(convertFn(clonedColor));

			if (!newColor) {
				console.error(`Conversion to ${targetFormat} failed.`);

				domHelpers.showToast('Conversion failed.');

				return;
			}

			inputBox.value = String(newColor);
			inputBox.setAttribute('data-format', targetFormat);
		});
	} catch (error) {
		console.error('Failed to convert colors:', error);
	}
}

export const domFn: fnObjects.DOMFn = {
	addConversionButtonEventListeners,
	applyCustomColor,
	applyFirstColorToUI,
	copyToClipboard,
	defineUIElements,
	desaturateColor,
	getElementsForSelectedColor,
	getGenerateButtonParams,
	handleGenButtonClick,
	populateColorTextOutputBox,
	pullParamsFromUI,
	saturateColor,
	showCustomColorPopupDiv,
	switchColorSpace
};
