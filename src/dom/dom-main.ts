import { getConversionFn } from '../color-conversion/conversion';
import { config } from '../config/constants';
import { domHelpers } from '../helpers/dom';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import * as domTypes from '../index/dom-types';
import { generate } from '../palette-gen/generate';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';
import { transforms } from '../utils/transforms';
import { guards } from '../utils/type-guards';

function addConversionButtonEventListeners(): void {
	try {
		const addListener = (id: string, colorSpace: colors.ColorSpace) => {
			const button = document.getElementById(
				id
			) as HTMLButtonElement | null;

			if (button) {
				button.addEventListener('click', () =>
					convertColors(colorSpace)
				);
			} else {
				console.warn(`Element with id "${id}" not found.`);
			}
		};

		addListener('hex-conversion-button', 'hex');
		addListener('rgb-conversion-button', 'rgb');
		addListener('hsv-conversion-button', 'hsv');
		addListener('hsl-conversion-button', 'hsl');
		addListener('cmyk-conversion-button', 'cmyk');
		addListener('lab-conversion-button', 'lab');
	} catch (error) {
		console.error(
			`Failed to add event listeners to conversion buttons: ${error}`
		);
		return;
	}
}

function applyCustomColor(): colors.Color {
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

		const parsedColor = transforms.parseColor(selectedFormat, rawValue);

		if (!parsedColor) {
			throw new Error(`Invalid color value: ${rawValue}`);
		}

		return parsedColor;
	} catch (error) {
		console.error(
			`Failed to apply custom color: ${error}. Returning randomly generated hex color`
		);
		return random.randomColor('hex');
	}
}

function applyFirstColorToUI(colorSpace: colors.ColorSpace): colors.Color {
	try {
		const color = random.randomColor(colorSpace);
		const colorBox1 = document.getElementById('color-box-1');

		if (!colorBox1) {
			console.error('color-box-1 is null');
			return color;
		}

		const formatColorString = transforms.getColorString(color);

		if (!formatColorString) {
			console.error('Unexpected or unsupported color format.');
			return color;
		}

		colorBox1.style.backgroundColor = formatColorString;

		populateColorTextOutputBox(color, 1);

		return color;
	} catch (error) {
		console.error(`Failed to apply first color to UI: ${error}`);
		return random.randomColor('hex');
	}
}

function applySelectedColorSpace(): colors.ColorSpace {
	try {
		const element = document.getElementById(
			'initial-colorspace-options'
		) as HTMLSelectElement;

		const value = element.value;

		if (guards.isColorSpace(value)) {
			return value as colors.ColorSpace;
		} else {
			return 'hex';
		}
	} catch (error) {
		console.error('Failed to apply initial color space:', error);
		return 'hex';
	}
}

function convertColors(targetFormat: colors.ColorSpace): void {
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

function defineUIButtons(): domTypes.UIButtons {
	try {
		const generateButton = document.getElementById('generate-button');
		const saturateButton = document.getElementById('saturate-button');
		const desaturateButton = document.getElementById('desaturate-button');
		const popupDivButton = document.getElementById('custom-color-button');
		const applyCustomColorButton = document.getElementById(
			'apply-custom-color-button'
		);
		const clearCustomColorButton = document.getElementById(
			'clear-custom-color-button'
		);
		const advancedMenuToggleButton = document.getElementById(
			'advanced-menu-toggle-button'
		);
		const applyColorSpaceButton = document.getElementById(
			'apply-initial-color-space-button'
		);
		const selectedColorOptions = document.getElementById(
			'selected-color-options'
		) as HTMLSelectElement | null;
		const selectedColor = selectedColorOptions
			? parseInt(selectedColorOptions.value, 10)
			: 0;

		return {
			generateButton,
			saturateButton,
			desaturateButton,
			popupDivButton,
			applyCustomColorButton,
			clearCustomColorButton,
			advancedMenuToggleButton,
			applyColorSpaceButton,
			selectedColor
		};
	} catch (error) {
		console.error('Failed to define UI buttons:', error);
		return {
			generateButton: null,
			saturateButton: null,
			desaturateButton: null,
			popupDivButton: null,
			applyCustomColorButton: null,
			clearCustomColorButton: null,
			advancedMenuToggleButton: null,
			applyColorSpaceButton: null,
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
		const paletteTypeOptions = document.getElementById(
			'palette-type-options'
		) as HTMLSelectElement;
		const paletteNumberOptions = document.getElementById(
			'palette-number-options'
		) as HTMLInputElement;
		const colorSpaceValue = (
			document.getElementById(
				'initial-colorspace-options'
			) as HTMLSelectElement
		)?.value;
		const colorSpace = guards.isColorSpace(colorSpaceValue)
			? (colorSpaceValue as colors.ColorSpace)
			: 'hex';
		const customColorRaw = (
			document.getElementById('custom-color') as HTMLInputElement
		)?.value;
		const customColor = transforms.parseCustomColor(
			colorSpace,
			customColorRaw
		);

		console.log(
			`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}\ncolorSpace: ${colorSpace}\ncustomColor: ${JSON.stringify(customColor)}`
		);

		return {
			numBoxes: parseInt(paletteNumberOptions.value, 10),
			paletteType: parseInt(paletteTypeOptions.value, 10),
			colorSpace,
			customColor
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

		const { paletteType, numBoxes, colorSpace, customColor } = params;

		if (!paletteType || !numBoxes) {
			console.error('paletteType and/or numBoxes are undefined');
			return;
		}

		const space: colors.ColorSpace = colorSpace ?? 'hex';
		const options: colors.PaletteOptions = {
			paletteType,
			numBoxes,
			colorSpace,
			customColor
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
			: transforms.colorStringToColor(color);

		if (!paletteHelpers.validateColorValues(clonedColor)) {
			console.error('Invalid color values.');

			domHelpers.showToast('Invalid color values.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = transforms.getCSSColorString(clonedColor);

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
		const colorSpaceElement = document.getElementById(
			'initial-color-space-options'
		) as HTMLSelectElement | null;

		const paletteType = paletteTypeElement
			? parseInt(paletteTypeElement.value, 10)
			: 0;
		const numBoxes = numBoxesElement
			? parseInt(numBoxesElement.value, 10)
			: 0;
		const colorSpace =
			colorSpaceElement && guards.isColorSpace(colorSpaceElement.value)
				? (colorSpaceElement.value as colors.ColorSpace)
				: 'hex';

		return {
			paletteType,
			numBoxes,
			colorSpace
		};
	} catch (error) {
		console.error(`Failed to pull parameters from UI: ${error}`);
		return {
			paletteType: 0,
			numBoxes: 0,
			colorSpace: 'hex'
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

export const dom: fnObjects.DOM = {
	addConversionButtonEventListeners,
	applyCustomColor,
	applyFirstColorToUI,
	applySelectedColorSpace,
	convertColors,
	copyToClipboard,
	defineUIButtons,
	desaturateColor,
	getElementsForSelectedColor,
	getGenerateButtonParams,
	handleGenButtonClick,
	populateColorTextOutputBox,
	pullParamsFromUI,
	saturateColor,
	showCustomColorPopupDiv
};
