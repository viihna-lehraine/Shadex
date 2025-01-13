// File: src/dom/utils/base.ts

import {
	Color,
	ColorSpace,
	GetElementsForSelectedColor,
	HSL,
	PullParamsFromUI,
	SL,
	SV
} from '../../index/index.js';
import { convert } from '../../common/convert/index.js';
import { data } from '../../data/index.js';
import { helpers, utils } from '../../common/index.js';

export interface DOMSharedUtilsBase {
	applyCustomColor: () => HSL;
	desaturateColor: (selectedColor: number) => void;
	getElementsForSelectedColor: (
		selectedColor: number
	) => GetElementsForSelectedColor;
	pullParamsFromUI: () => PullParamsFromUI;
	saturateColor: (selectedColor: number) => void;
}

const mode = data.mode;

function applyCustomColor(): HSL {
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
			if (!mode.gracefulErrors)
				throw new Error(`Unsupported color format: ${selectedFormat}`);
		}

		const parsedColor = utils.color.parseColor(
			selectedFormat,
			rawValue
		) as Exclude<Color, SL | SV>;

		if (!parsedColor) {
			if (!mode.gracefulErrors)
				throw new Error(`Invalid color value: ${rawValue}`);
		}

		const hslColor = utils.color.isHSLColor(parsedColor)
			? parsedColor
			: convert.toHSL(parsedColor);

		return hslColor;
	} catch (error) {
		if (mode.errorLogs)
			console.error(
				`Failed to apply custom color: ${error}. Returning randomly generated hex color`
			);

		return utils.random.hsl(false) as HSL;
	}
}

function desaturateColor(selectedColor: number): void {
	try {
		getElementsForSelectedColor(selectedColor);
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Failed to desaturate color: ${error}`);
	}
}

function getElementsForSelectedColor(
	selectedColor: number
): GetElementsForSelectedColor {
	const selectedColorBox = document.getElementById(
		`color-box-${selectedColor}`
	);

	if (!selectedColorBox) {
		if (mode.warnLogs)
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

function pullParamsFromUI(): PullParamsFromUI {
	try {
		const paletteTypeOptionsElement =
			data.consts.dom.elements.paletteTypeOptions;
		const numBoxesElement = data.consts.dom.elements.paletteNumberOptions;
		const enableAlphaCheckbox =
			data.consts.dom.elements.enableAlphaCheckbox;
		const limitDarknessCheckbox =
			data.consts.dom.elements.limitDarknessCheckbox;
		const limitGraynessCheckbox =
			data.consts.dom.elements.limitGraynessCheckbox;
		const limitLightnessCheckbox =
			data.consts.dom.elements.limitLightnessCheckbox;

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
		if (mode.errorLogs)
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

function saturateColor(selectedColor: number): void {
	try {
		getElementsForSelectedColor(selectedColor);
		// *DEV-NOTE* unfinished function
	} catch (error) {
		if (mode.errorLogs) console.error(`Failed to saturate color: ${error}`);
	}
}

export const base: DOMSharedUtilsBase = {
	applyCustomColor,
	desaturateColor,
	getElementsForSelectedColor,
	pullParamsFromUI,
	saturateColor
};
