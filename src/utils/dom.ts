// File: utils/dom.js

import {
	ColorInputElement,
	ColorSpace,
	DOMUtilsInterface,
	HelpersInterface,
	HSL,
	Palette,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { domData } from '../data/dom.js';
import { modeData } from '../data/mode.js';

const domIDs = domData.ids;
const mode = modeData;

const addConversionListener = (
	id: string,
	colorSpace: string,
	helpers: HelpersInterface,
	services: ServicesInterface,
	utils: UtilitiesInterface
) => {
	const log = services.app.log;
	const btn = document.getElementById(id) as HTMLButtonElement | null;

	if (btn) {
		if (utils.typeGuards.isColorSpace(colorSpace)) {
			btn.addEventListener('click', () =>
				switchColorSpaceInDOM(
					colorSpace as ColorSpace,
					helpers,
					services,
					utils
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
	services: ServicesInterface
): void {
	const log = services.app.log;
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
	services: ServicesInterface
): void {
	const log = services.app.log;
	const paletteColumnSelector = document.getElementById(
		domIDs.selectors.paletteColumn
	) as HTMLSelectElement;

	if (!paletteColumnSelector) {
		log(
			'error',
			'paletteColumnSelector not found',
			'domUtils.enforceSwatchRules()'
		);

		if (mode.stackTrace) {
			console.trace('enforceMinimumSwatches stack trace');
		}

		return;
	}

	const currentValue = parseInt(paletteColumnSelector.value, 10);

	let newValue = currentValue;

	// ensure the value is within the allowed range
	if (currentValue < minSwatches) {
		newValue = minSwatches;
	} else if (maxSwatches !== undefined && currentValue > maxSwatches) {
		newValue = maxSwatches;
	}

	if (newValue !== currentValue) {
		// update value in the dropdown menu
		paletteColumnSelector.value = newValue.toString();

		// trigger a change event to notify the application
		const event = new Event('change', { bubbles: true });
		try {
			paletteColumnSelector.dispatchEvent(event);
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

function getCheckboxState(id: string): boolean | void {
	const checkbox = document.getElementById(id) as HTMLInputElement | null;

	return checkbox ? checkbox.checked : undefined;
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
	helpers: HelpersInterface,
	services: ServicesInterface,
	utils: UtilitiesInterface
): void {
	const log = services.app.log;

	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		for (const box of colorTextOutputBoxes) {
			const inputBox = box as ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (
				!colorValues ||
				!utils.validate.colorValue(colorValues, utils)
			) {
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

			const convertFn = utils.color.getConversionFn(
				currentFormat,
				targetFormat,
				helpers,
				services
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

			const clonedColor = utils.color.narrowToColor(colorValues, utils);

			if (
				!clonedColor ||
				utils.typeGuards.isSLColor(clonedColor) ||
				utils.typeGuards.isSVColor(clonedColor) ||
				utils.typeGuards.isXYZ(clonedColor)
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

			const newColor = utils.core.clone(convertFn(clonedColor));

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
	utils: UtilitiesInterface
): void {
	const colorBox = document.getElementById(boxId);

	if (colorBox) {
		colorBox.style.backgroundColor = utils.color.convertColorToCSS(color);
	}
}

function updateHistory(history: Palette[]): void {
	const historyList = domData.elements.divs.paletteHistory;

	if (!historyList) return;

	historyList.innerHTML = '';

	history.forEach(palette => {
		const entry = document.createElement('div');

		entry.classList.add('history-item');
		entry.id = `palette_${palette.id}`;
		entry.innerHTML = `
			<p>Palette #${palette.metadata.name || palette.id}</p>
			<div class="color-preview">
				${palette.items.map(item => `<span class="color-box" style="background: ${item.css.hex};"></span>`).join(' ')}
			</div>
			<button class="remove-history-item" data-id="${palette.id}-history-remove-btn">Remove</button>
		`;
		entry
			.querySelector('.remove-history-item')
			?.addEventListener('click', async () => {
				// *DEV-NOTE* save to history somehow
			});
		historyList.appendChild(entry);
	});
}

function validateStaticElements(services: ServicesInterface): void {
	const log = services.app.log;
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
	getCheckboxState,
	readFile,
	switchColorSpaceInDOM,
	updateColorBox,
	updateHistory,
	validateStaticElements
};
