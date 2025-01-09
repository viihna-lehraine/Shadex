// File: src/dom/elements.js

import { DOMElementsInterface, HSL, PaletteOptions } from '../index/index.js';
import { core, superUtils, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { dom } from '../dom/index.js'; // *DEV-NOTE* this might cause a circular dependency
import { IDBManager } from '../idb/index.js';
import { mode } from '../data/mode/index.js';
import { start } from '../palette/index.js';

const buttonDebounce = data.consts.debounce.button || 300;
const domElements = data.consts.dom.elements;
const domIDs = data.consts.dom.ids;

const idb = IDBManager.getInstance();

function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else if (mode.warnLogs) {
		if ((mode.debug || mode.verbose) && mode.warnLogs)
			console.warn(`Element with id "${id}" not found.`);
	}
}

const handlePaletteGen = core.base.debounce(() => {
	try {
		const params = superUtils.dom.getGenButtonArgs();

		if (!params) {
			console.error('Failed to retrieve generateButton parameters');

			return;
		}

		const {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = params;

		if (!paletteType || !numBoxes) {
			console.error('paletteType and/or numBoxes are undefined');

			return;
		}

		const options: PaletteOptions = {
			numBoxes,
			customColor,
			paletteType,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		};

		start.genPalette(options);
	} catch (error) {
		console.error(`Failed to handle generate button click: ${error}`);
	}
}, buttonDebounce);

function initializeEventListeners(): void {
	const addConversionListener = (id: string, colorSpace: string) => {
		const button = document.getElementById(id) as HTMLButtonElement | null;

		if (button) {
			if (core.guards.isColorSpace(colorSpace)) {
				button.addEventListener('click', () =>
					superUtils.dom.switchColorSpace(colorSpace)
				);
			}
		} else {
			if (mode.warnLogs)
				console.warn(`Element with id "${id}" not found.`);
		}
	};

	addConversionListener('show-as-cmyk-button', 'cmyk');
	addConversionListener('show-as-hex-button', 'hex');
	addConversionListener('show-as-hsl-button', 'hsl');
	addConversionListener('show-as-hsv-button', 'hsv');
	addConversionListener('show-as-lab-button', 'lab');
	addConversionListener('show-as-rgb-button', 'rgb');

	addEventListener(
		domIDs.advancedMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const advancedMenuContent = document.querySelector(
				'.advanced-menu-content'
			) as HTMLElement | null;

			if (advancedMenuContent) {
				const isHidden =
					getComputedStyle(advancedMenuContent).display === 'none';

				advancedMenuContent.style.display = isHidden ? 'flex' : 'none';
			}

			if (!mode.quiet) console.log('advancedMenuButton clicked');
		}
	);

	addEventListener(
		domIDs.applyCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const customHSLColor = dom.applyCustomColor();
			const customHSLColorClone = core.base.clone(customHSLColor);

			await idb.saveData(
				'customColor',
				'appSettings',
				customHSLColorClone
			);

			if (!mode.quiet) console.log('Custom color saved to IndexedDB');

			// *DEV-NOTE* unfinished
		}
	);

	addEventListener(
		domIDs.clearCustomColorButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			domElements.customColorInput!.value = '#ff0000';

			if (!mode.quiet) console.log('Custom color cleared');
		}
	);

	addEventListener(
		domIDs.closeCustomColorMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeCustomColorMenuButton clicked');

			domElements.customColorMenu?.classList.add('hidden');
		}
	);

	addEventListener(
		domIDs.closeHelpMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeHelpMenuButton clicked');

			domElements.advancedMenu?.classList.add('hidden');
		}
	);

	addEventListener(
		domIDs.closeHistoryMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('closeHistoryMenuButton clicked');

			domElements.historyMenu?.classList.add('hidden');
		}
	);

	addEventListener(
		domIDs.customColorMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('customColorMenuButton clicked');

			domElements.customColorMenu?.classList.remove('hidden');
		}
	);

	if (!domElements.customColorInput)
		throw new Error('Custom color input element not found');

	domElements.customColorInput.addEventListener('input', () => {
		if (!domElements.customColorDisplay)
			throw new Error('Custom color display element not found');

		domElements.customColorDisplay.textContent =
			domElements.customColorInput!.value;
	});

	addEventListener(
		domIDs.desaturateButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const selectedColor = domElements.selectedColorOption
				? parseInt(domElements.selectedColorOption.value, 10)
				: 0;

			if (!mode.quiet) console.log('desaturateButton clicked');

			dom.desaturateColor(selectedColor); // *DEV-NOTE* possible circular dependency
		}
	);

	// MAIN - generate palette
	dom.elements.addEventListener(
		domIDs.generateButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			if (!mode.quiet) console.log('generateButton clicked');

			const {
				paletteType,
				numBoxes,
				enableAlpha,
				limitDarkness,
				limitGrayness,
				limitLightness
			} = dom.pullParamsFromUI();

			let customColor = (await idb.getCustomColor()) as HSL | null;

			if (!customColor) {
				if (!mode.quiet)
					console.info('No custom color found. Using a random color');

				customColor = utils.random.hsl(true);
			}

			const paletteOptions: PaletteOptions = {
				paletteType,
				numBoxes,
				customColor: core.base.clone(customColor),
				enableAlpha,
				limitDarkness,
				limitGrayness,
				limitLightness
			};

			await start.genPalette(paletteOptions);
		}
	);

	dom.elements.addEventListener(
		domIDs.helpMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const helpMenuContent = document.querySelector(
				'.help-menu-content'
			) as HTMLElement | null;

			if (helpMenuContent) {
				const isHidden =
					getComputedStyle(helpMenuContent).display === 'none';

				helpMenuContent.style.display = isHidden ? 'flex' : 'none';

				if (!mode.quiet) console.log('helpMenuButton clicked');
			}
		}
	);

	addEventListener(
		domIDs.historyMenuButton,
		'click',
		async (e: MouseEvent) => {
			e.preventDefault();

			const historyMenuContent = document.querySelector(
				'.history-menu-content'
			) as HTMLElement | null;

			if (historyMenuContent) {
				const isHidden =
					getComputedStyle(historyMenuContent).display === 'none';

				historyMenuContent.style.display = isHidden ? 'flex' : 'none';
			}

			if (!mode.quiet) console.log('historyMenuToggleButton clicked');
		}
	);

	addEventListener(domIDs.saturateButton, 'click', async (e: MouseEvent) => {
		e.preventDefault();

		if (!mode.quiet) console.log('saturateButton clicked');

		const selectedColor = domElements.selectedColorOption
			? parseInt(domElements.selectedColorOption.value, 10)
			: 0;

		dom.saturateColor(selectedColor);
	});

	window.addEventListener('click', async (e: MouseEvent) => {
		if (domElements.customColorMenu)
			if (e.target === domElements.customColorMenu)
				domElements.customColorMenu.classList.add('hidden');
	});
}

export const elements: DOMElementsInterface = {
	addEventListener,
	handlePaletteGen,
	initializeEventListeners
};
