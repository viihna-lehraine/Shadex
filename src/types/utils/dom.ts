// File: utils/dom.js

import {
	AppServicesInterface,
	BrandingUtilsInterface,
	ColorInputElement,
	Color,
	ColorSpace,
	Color_StringProps,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	HSL,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
} from '../types/index.js';
import { domData } from '../types/data/dom.js';
import { modeData } from '../data/mode.js';

const domIDs = domData.ids.static;
const mode = modeData;

const addConversionListener = (
	id: string,
	colorSpace: string,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	conversionUtils: ColorUtilHelpersInterface,
	coreUtils: CoreUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
) => {
	const log = appServices.log;
	const btn = document.getElementById(id) as HTMLButtonElement | null;

	if (btn) {
		if (typeGuards.isColorSpace(colorSpace)) {
			btn.addEventListener('click', () =>
				switchColorSpaceInDOM(
					colorSpace as ColorSpace,
					appServices,
					brand,
					colorUtils,
					conversionUtils,
					coreUtils,
					typeGuards,
					validate
				)
			);
		} else {
			log(
				'warn',
				`Invalid color space provided: ${colorSpace}`,
				'domUtils.addConversionListener'
			);
		}
	} else {
		log(
			'warn',
			`Element with id "${id}" not found.`,
			'domUtils.addConversionListener'
		);
	}
};

function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void,
	appServices: AppServicesInterface
): void {
	const log = appServices.log;
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else {
		log(
			'warn',
			`Element with id "${id}" not found.`,
			'domUtils.addEventListener()',
			2
		);
	}
}

function downloadFile(data: string, filename: string, type: string): void {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
}

function enforceSwatchRules(
	minSwatches: number,
	maxSwatches: number,
	appServices: AppServicesInterface
): void {
	const log = appServices.log;
	const swatchNumberSelector = document.getElementById(
		domIDs.selects.swatchGen
	) as HTMLSelectElement;

	if (!swatchNumberSelector) {
		log(
			'error',
			'paletteDropdown not found',
			'domUtils.enforceSwatchRules()'
		);

		if (mode.stackTrace) {
			console.trace('enforceMinimumSwatches stack trace');
		}

		return;
	}

	const currentValue = parseInt(swatchNumberSelector.value, 10);

	let newValue = currentValue;

	// ensure the value is within the allowed range
	if (currentValue < minSwatches) {
		newValue = minSwatches;
	} else if (maxSwatches !== undefined && currentValue > maxSwatches) {
		newValue = maxSwatches;
	}

	if (newValue !== currentValue) {
		// update value in the dropdown menu
		swatchNumberSelector.value = newValue.toString();

		// trigger a change event to notify the application
		const event = new Event('change', { bubbles: true });
		try {
			swatchNumberSelector.dispatchEvent(event);
		} catch (error) {
			log(
				'warn',
				`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`,
				'domUtils.enforceSwatchRules()'
			);

			throw new Error(`Failed to dispatch change event: ${error}`);
		}
	}
}

function populateOutputBox(
	color: Color | Color_StringProps,
	boxNumber: number,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
): void {
	const log = appServices.log;

	try {
		const clonedColor: Color = typeGuards.isColor(color)
			? coreUtils.clone(color)
			: colorUtils.convertColorStringToColor(
					color,
					brand,
					coreUtils,
					validate
				);

		if (!validate.colorValue(clonedColor, coreUtils)) {
			log(
				'error',
				'Invalid color values.',
				'domUtils.populateOutputBox()'
			);

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = colorUtils.convertColorToCSS(clonedColor);

		log(
			'debug',
			`Adding CSS-formatted color to DOM ${stringifiedColor}`,
			'domUtils.populateOutputBox()',
			2
		);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		log(
			'error',
			`Failed to populate color text output box: ${error}`,
			'domUtils.populateOutputBox()'
		);

		return;
	}
}

function readFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);

		reader.readAsText(file);
	});
}

function switchColorSpaceInDOM(
	targetFormat: ColorSpace,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	conversionUtils: ColorUtilHelpersInterface,
	coreUtils: CoreUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
): void {
	const log = appServices.log;

	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		for (const box of colorTextOutputBoxes) {
			const inputBox = box as ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (!colorValues || !validate.colorValue(colorValues, coreUtils)) {
				log(
					'error',
					'Invalid color values. Cannot display toast.',
					'domUtils.switchColorSpaceInDOM()'
				);

				continue;
			}

			const currentFormat = inputBox.getAttribute(
				'data-format'
			) as ColorSpace;

			log(
				'debug',
				`Converting from ${currentFormat} to ${targetFormat}`,
				'domUtils.switchColorSpaceInDOM()',
				2
			);

			const convertFn = colorUtils.getConversionFn(
				currentFormat,
				targetFormat,
				conversionUtils,
				log
			);

			if (!convertFn) {
				log(
					'warn',
					`Conversion from ${currentFormat} to ${targetFormat} is not supported.`,
					'domUtils.switchColorSpaceInDOM()'
				);

				continue;
			}

			if (colorValues.format === 'xyz') {
				log(
					'warn',
					'Cannot convert from XYZ to another color space.',
					'domUtils.switchColorSpaceInDOM()'
				);

				continue;
			}

			const clonedColor = colorUtils.narrowToColor(
				colorValues,
				brand,
				coreUtils,
				typeGuards,
				validate
			);

			if (
				!clonedColor ||
				typeGuards.isSLColor(clonedColor) ||
				typeGuards.isSVColor(clonedColor) ||
				typeGuards.isXYZ(clonedColor)
			) {
				log(
					'error',
					'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.',
					'domUtils.switchColorSpaceInDOM()',
					3
				);

				continue;
			}

			if (!clonedColor) {
				log(
					'error',
					`Conversion to ${targetFormat} failed.`,
					'domUtils.switchColorSpaceInDOM()'
				);

				continue;
			}

			const newColor = coreUtils.clone(convertFn(clonedColor));

			if (!newColor) {
				log(
					'error',
					`Conversion to ${targetFormat} failed.`,
					'domUtils.switchColorSpaceInDOM()'
				);

				continue;
			}

			inputBox.value = String(newColor);

			inputBox.setAttribute('data-format', targetFormat);
		}
	} catch (error) {
		log(
			'warn',
			'Color conversion failure.',
			'domUtils.switchColorSpaceInDOM()'
		);

		throw new Error(`Failed to convert colors: ${error as Error}`);
	}
}

function updateColorBox(
	color: HSL,
	boxId: string,
	colorUtils: ColorUtilsInterface
): void {
	const colorBox = document.getElementById(boxId);

	if (colorBox) {
		colorBox.style.backgroundColor = colorUtils.convertColorToCSS(color);
	}
}

function validateStaticElements(appServices: AppServicesInterface): void {
	const log = appServices.log;
	const missingElements: string[] = [];
	const allIDs: string[] = Object.values(domIDs).flatMap(category =>
		Object.values(category)
	);

	allIDs.forEach((id: string) => {
		const element = document.getElementById(id);
		if (!element) {
			log(
				'error',
				`Element with ID "${id}" not found`,
				'ValidationService.validateStaticElements()',
				2
			);
			missingElements.push(id);
		}
	});

	if (missingElements.length) {
		log(
			'warn',
			`Missing elements: ${missingElements.join(', ')}`,
			'ValidationService.validateStaticElements()',
			2
		);
	} else {
		log(
			'debug',
			'All required DOM elements are present.',
			'ValidationService.validateStaticElements()',
			3
		);
	}
}

export const domUtils: DOMUtilsInterface = {
	addConversionListener,
	addEventListener,
	downloadFile,
	enforceSwatchRules,
	populateOutputBox,
	readFile,
	switchColorSpaceInDOM,
	updateColorBox,
	validateStaticElements
};
