import { getConversionFn } from '../color-conversion/conversion';
import { conversionHelpers } from '../helpers/conversion';
import { domHelpers } from '../helpers/dom';
import * as fnObjects from '../index/fn-objects';
import * as interfaces from '../index/interfaces';
import * as types from '../index/types';
import { generate } from '../palette-gen/generate';
import { random } from '../utils/color-randomizer';
import { transforms } from '../utils/transforms';
import { guards } from '../utils/type-guards';

function addConversionButtonEventListeners(): void {
	try {
		const addListener = (id: string, colorSpace: types.ColorSpace) => {
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

function applyCustomColor(): types.Color {
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
		)?.value as types.ColorSpace;

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

function applyFirstColorToUI(initialColorSpace: types.ColorSpace): types.Color {
	try {
		const color = random.randomColor(initialColorSpace);
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

function applyInitialColorSpace(): types.ColorSpace {
	try {
		const element = document.getElementById(
			'initial-colorspace-options'
		) as HTMLSelectElement;

		const value = element.value;

		if (guards.isColorSpace(value)) {
			return value as types.ColorSpace;
		} else {
			return 'hex';
		}
	} catch (error) {
		console.error('Failed to apply initial color space:', error);
		return 'hex';
	}
}

function convertColors(targetFormat: types.ColorSpace): void {
	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		colorTextOutputBoxes.forEach(box => {
			if (!(box instanceof HTMLInputElement)) {
				console.error('Invalid input element.');
				return;
			}

			const inputBox = box as interfaces.ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (!colorValues) {
				console.error('Missing color values.');
				return;
			}

			const currentFormat = inputBox.getAttribute(
				'data-format'
			) as types.ColorSpace;

			if (
				!guards.isColorSpace(currentFormat) ||
				!guards.isColorSpace(targetFormat)
			) {
				console.error(
					`Invalid format: ${currentFormat} or ${targetFormat}`
				);
				return;
			}

			if (colorValues.format === 'xyz') {
				console.warn('Skipping XYZ color type');
				return;
			}

			const convertFn = getConversionFn(currentFormat, targetFormat);
			if (!convertFn) {
				console.error(
					`Conversion from ${currentFormat} to ${targetFormat} is not supported.`
				);
				return;
			}

			if (guards.isConvertibleColor(colorValues)) {
				const newColor = convertFn(colorValues);
				if (!newColor) {
					console.error(`Conversion to ${targetFormat} failed.`);
					return;
				}

				inputBox.value = String(newColor);
				inputBox.setAttribute('data-format', targetFormat);
			} else {
				console.error(`Invalid color type for conversion.`);
			}
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
			})
			.catch(err => {
				console.error('Error copying to clipboard:', err);
			});
	} catch (error) {
		console.error(`Failed to copy to clipboard: ${error}`);
	}
}

function defineUIButtons(): interfaces.UIButtons {
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
		const applyInitialColorSpaceButton = document.getElementById(
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
			applyInitialColorSpaceButton,
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
			applyInitialColorSpaceButton: null,
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
): interfaces.GetElementsForSelectedColor {
	try {
		return {
			selectedColorTextOutputBox: document.getElementById(
				`color-text-output-box-${selectedColor}`
			),
			selectedColorBox: document.getElementById(
				`color-box-${selectedColor}`
			),
			selectedColorStripe: document.getElementById(
				`color-stripe-${selectedColor}`
			)
		};
	} catch (error) {
		console.error('Failed to get elements for selected color:', error);
		return {
			selectedColorTextOutputBox: null,
			selectedColorBox: null,
			selectedColorStripe: null
		};
	}
}

function getGenerateButtonParams(): interfaces.GenButtonParams | null {
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
		const initialColorSpace = guards.isColorSpace(colorSpaceValue)
			? (colorSpaceValue as types.ColorSpace)
			: 'hex';
		const customColorRaw = (
			document.getElementById('custom-color') as HTMLInputElement
		)?.value;
		const customColor = transforms.parseCustomColor(
			initialColorSpace,
			customColorRaw
		);

		console.log(
			`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}\ninitialColorSpace: ${initialColorSpace}\ncustomColor: ${JSON.stringify(customColor)}`
		);

		return {
			numBoxes: parseInt(paletteNumberOptions.value, 10),
			paletteType: parseInt(paletteTypeOptions.value, 10),
			initialColorSpace,
			customColor
		};
	} catch (error) {
		console.error('Failed to retrieve generateButton parameters:', error);
		return null;
	}
}

function handleGenButtonClick(): void {
	try {
		const params = getGenerateButtonParams();

		if (!params) {
			console.error('Failed to retrieve generateButton parameters');
			return;
		}

		const { paletteType, numBoxes, initialColorSpace, customColor } =
			params;

		if (!paletteType || !numBoxes) {
			console.error('paletteType and/or numBoxes are undefined');
			return;
		}

		const space: types.ColorSpace = initialColorSpace ?? 'hex';

		generate.startPaletteGen(paletteType, numBoxes, space, customColor);
	} catch (error) {
		console.error(`Failed to handle generate button click: ${error}`);
	}
}

function populateColorTextOutputBox(
	color: types.Color,
	boxNumber: number
): void {
	try {
		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const hexColor = conversionHelpers.convertColorToHex(color);

		if (!hexColor) {
			console.error('Failed to convert color to hex');
			return;
		}

		console.log(`Hex color value: ${JSON.stringify(hexColor.value.hex)}`);

		colorTextOutputBox.value = hexColor.value.hex;
		colorTextOutputBox.setAttribute('data-format', 'hex');
	} catch (error) {
		console.error('Failed to populate color text output box:', error);
		return;
	}
}

function pullParamsFromUI(): interfaces.PullParamsFromUI {
	try {
		const paletteTypeElement = document.getElementById(
			'palette-type-options'
		) as HTMLSelectElement | null;
		const numBoxesElement = document.getElementById(
			'palette-number-options'
		) as HTMLSelectElement | null;
		const initialColorSpaceElement = document.getElementById(
			'initial-color-space-options'
		) as HTMLSelectElement | null;

		const paletteType = paletteTypeElement
			? parseInt(paletteTypeElement.value, 10)
			: 0;
		const numBoxes = numBoxesElement
			? parseInt(numBoxesElement.value, 10)
			: 0;
		const initialColorSpace =
			initialColorSpaceElement &&
			guards.isColorSpace(initialColorSpaceElement.value)
				? (initialColorSpaceElement.value as types.ColorSpace)
				: 'hex';

		return {
			paletteType,
			numBoxes,
			initialColorSpace
		};
	} catch (error) {
		console.error(`Failed to pull parameters from UI: ${error}`);
		return {
			paletteType: 0,
			numBoxes: 0,
			initialColorSpace: 'hex'
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
	applyInitialColorSpace,
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
