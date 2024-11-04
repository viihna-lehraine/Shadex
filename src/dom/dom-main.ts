import { getConversionFn } from '../utils/conversion-utils';
import { config } from '../config/constants';
import { domHelpers } from '../helpers/dom';
import { notification } from '../helpers/notification';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import * as domTypes from '../index/dom-types';
import { toHSL } from '../palette-gen/conversion-index';
import { generate } from '../palette-gen/generate';
import { randomHSL } from '../utils/random-color-utils';
import { core } from '../utils/core-utils';
import { colorUtils } from '../utils/color-utils';
import { commonUtils } from '../utils/common-utils';
import { paletteUtils } from '../utils/palette-utils';

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

		if (!colorUtils.isColorSpace(selectedFormat)) {
			throw new Error(`Unsupported color format: ${selectedFormat}`);
		}

		const parsedColor = colorUtils.parseColor(
			selectedFormat,
			rawValue
		) as Exclude<colors.Color, colors.SL | colors.SV>;

		if (!parsedColor) {
			throw new Error(`Invalid color value: ${rawValue}`);
		}

		const hslColor = colorUtils.isHSLColor(parsedColor)
			? parsedColor
			: toHSL(parsedColor);

		return hslColor;
	} catch (error) {
		console.error(
			`Failed to apply custom color: ${error}. Returning randomly generated hex color`
		);

		return randomHSL(false) as colors.HSL;
	}
}

function applyFirstColorToUI(color: colors.HSL): colors.HSL {
	try {
		const colorBox1 = document.getElementById('color-box-1');

		if (!colorBox1) {
			console.error('color-box-1 is null');

			return color;
		}

		const formatColorString = colorUtils.getCSSColorString(color);

		if (!formatColorString) {
			console.error('Unexpected or unsupported color format.');

			return color;
		}

		colorBox1.style.backgroundColor = formatColorString;

		paletteUtils.populateColorTextOutputBox(color, 1);

		return color;
	} catch (error) {
		console.error(`Failed to apply first color to UI: ${error}`);

		return randomHSL(false) as colors.HSL;
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
		const applyCustomColorButton = config.applyCustomColorButton;
		const clearCustomColorButton = config.clearCustomColorButton;
		const customColorToggleButton = config.customColorMenuButton;
		const closeHelpMenuButton = config.closeHelpMenuButton;
		const closeHistoryMenuButton = config.closeHistoryMenuButton;
		const closeSubMenuAButton = config.closeSubMenuAButton;
		const closeSubMenuBButton = config.closeSubMenuBButton;
		const desaturateButton = config.desaturateButton;
		const enableAlphaCheckbox = config.enableAlphaCheckbox;
		const generateButton = config.generateButton;
		const helpMenuToggleButton = config.helpMenuToggleButton;
		const historyMenuToggleButton = config.historyMenuToggleButton;
		const limitBrightCheckbox = config.limitBrightCheckbox;
		const limitDarkCheckbox = config.limitDarkCheckbox;
		const limitGrayCheckbox = config.limitGrayCheckbox;
		const saturateButton = config.saturateButton;
		const selectedColorOptions = config.selectedColorOptions;
		const showAsCMYKButton = config.showAsCMYKButton;
		const showAsHexButton = config.showAsHexButton;
		const showAsHSLButton = config.showAsHSLButton;
		const showAsHSVButton = config.showAsHSVButton;
		const showAsLABButton = config.showAsLABButton;
		const showAsRGBButton = config.showAsRGBButton;

		const selectedColor = selectedColorOptions
			? parseInt(selectedColorOptions.value, 10)
			: 0;

		return {
			advancedMenuToggleButton,
			applyCustomColorButton,
			clearCustomColorButton,
			closeHelpMenuButton,
			closeHistoryMenuButton,
			closeSubMenuAButton,
			closeSubMenuBButton,
			customColorToggleButton,
			desaturateButton,
			enableAlphaCheckbox,
			generateButton,
			helpMenuToggleButton,
			historyMenuToggleButton,
			limitBrightCheckbox,
			limitDarkCheckbox,
			limitGrayCheckbox,
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
			advancedMenuToggleButton: null,
			applyCustomColorButton: null,
			clearCustomColorButton: null,
			closeHelpMenuButton: null,
			closeHistoryMenuButton: null,
			closeSubMenuAButton: null,
			closeSubMenuBButton: null,
			customColorToggleButton: null,
			desaturateButton: null,
			enableAlphaCheckbox: null,
			generateButton: null,
			helpMenuToggleButton: null,
			historyMenuToggleButton: null,
			limitBrightCheckbox: null,
			limitDarkCheckbox: null,
			limitGrayCheckbox: null,
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

		notification.showToast('Please select a valid color.');

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

		console.log(
			`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`
		);

		return {
			numBoxes: parseInt(paletteNumberOptions.value, 10),
			paletteType: parseInt(paletteTypeOptions.value, 10),
			customColor: customColorRaw
				? (colorUtils.parseCustomColor(
						customColorRaw
					) as colors.HSL | null)
				: null,
			enableAlpha: enableAlphaCheckbox.checked,
			limitBright: limitBrightCheckbox.checked,
			limitDark: limitDarkCheckbox.checked,
			limitGray: limitGrayCheckbox.checked
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

function pullParamsFromUI(): domTypes.PullParamsFromUI {
	try {
		const paletteTypeOptionsElement = config.paletteTypeOptions;
		const numBoxesElement = config.paletteNumberOptions;
		const enableAlphaCheckbox = config.enableAlphaCheckbox;
		const limitBrightCheckbox = config.limitBrightCheckbox;
		const limitDarkCheckbox = config.limitDarkCheckbox;
		const limitGrayCheckbox = config.limitGrayCheckbox;

		return {
			paletteType: paletteTypeOptionsElement
				? parseInt(paletteTypeOptionsElement.value, 10)
				: 0,
			numBoxes: numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0,
			enableAlpha: enableAlphaCheckbox?.checked || false,
			limitBright: limitBrightCheckbox?.checked || false,
			limitDark: limitDarkCheckbox?.checked || false,
			limitGray: limitGrayCheckbox?.checked || false
		};
	} catch (error) {
		console.error(`Failed to pull parameters from UI: ${error}`);
		return {
			paletteType: 0,
			numBoxes: 0,
			enableAlpha: false,
			limitBright: false,
			limitDark: false,
			limitGray: false
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

			if (!colorValues || !commonUtils.validateColorValues(colorValues)) {
				console.error('Invalid color values.');

				notification.showToast('Invalid color values.');

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

				notification.showToast('Conversion not supported.');

				return;
			}

			if (colorValues.format === 'xyz') {
				console.error(
					'Cannot convert from XYZ to another color space.'
				);

				notification.showToast('Conversion not supported.');

				return;
			}

			const clonedColor = colorUtils.narrowToColor(colorValues);

			if (
				!clonedColor ||
				colorUtils.isSLColor(clonedColor) ||
				colorUtils.isSVColor(clonedColor) ||
				colorUtils.isXYZ(clonedColor)
			) {
				console.error(
					'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.'
				);

				notification.showToast('Conversion not supported.');

				return;
			}

			if (!clonedColor) {
				console.error(`Conversion to ${targetFormat} failed.`);

				notification.showToast('Conversion failed.');

				return;
			}

			const newColor = core.clone(convertFn(clonedColor));

			if (!newColor) {
				console.error(`Conversion to ${targetFormat} failed.`);

				notification.showToast('Conversion failed.');

				return;
			}

			inputBox.value = String(newColor);

			inputBox.setAttribute('data-format', targetFormat);
		});
	} catch (error) {
		throw new Error(`Failed to convert colors: ${error as Error}`);
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
	pullParamsFromUI,
	saturateColor,
	showCustomColorPopupDiv,
	switchColorSpace
};
