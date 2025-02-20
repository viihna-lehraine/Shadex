// File: common/utils/partials/dom/main.ts

import {
	ColorInputElement,
	ColorSpace,
	DOMUtilsPartial,
	Helpers,
	HSL,
	Palette,
	Services,
	State,
	Utilities
} from '../../../../types/index.js';
import { config, domConfig, domIndex } from '../../../../config/index.js';

const classes = domIndex.classes;
const ids = domIndex.ids;
const mode = config.mode;

export function partialDOMUtilsFactory(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): DOMUtilsPartial {
	const { clone } = helpers.data;
	const { getElement, getAllElements } = helpers.dom;
	const { log } = services;

	function positionTooltip(element: HTMLElement, tooltip: HTMLElement): void {
		const rect = element.getBoundingClientRect();

		tooltip.style.position = 'absolute';
		tooltip.style.left = `${rect.left + window.scrollX}px`;
		tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
		tooltip.style.zIndex = '1000';
		tooltip.style.pointerEvents = 'none';
		tooltip.style.opacity = '0';
		tooltip.style.transition = 'opacity 0.2s ease-in-out';
	}

	function removeTooltip(element: HTMLElement): void {
		const tooltipId = element.dataset.tooltipId;

		if (!tooltipId) return;

		const tooltip = document.getElementById(tooltipId);
		if (tooltip) {
			tooltip.style.opacity = '0';
			setTimeout(() => {
				tooltip?.remove();
			}, 300);
		}

		delete element.dataset.tooltipId;
	}

	function switchColorSpaceInDOM(targetFormat: ColorSpace): void {
		try {
			const colorTextOutputBoxes =
				document.querySelectorAll<HTMLInputElement>(
					'.color-text-output-box'
				);

			for (const box of colorTextOutputBoxes) {
				const inputBox = box as ColorInputElement;
				const colorValues = inputBox.colorValues;

				if (!colorValues || !utils.validate.colorValue(colorValues)) {
					log('Invalid color values. Cannot display toast.', 'error');

					continue;
				}

				const currentFormat = inputBox.getAttribute(
					'data-format'
				) as ColorSpace;

				log(
					`Converting from ${currentFormat} to ${targetFormat}`,
					'debug'
				);

				const convertFn = helpers.color.getConversionFn(
					currentFormat,
					targetFormat
				);

				if (!convertFn) {
					log(
						`Conversion from ${currentFormat} to ${targetFormat} is not supported.`,
						'warn'
					);

					continue;
				}

				if (colorValues.format === 'xyz') {
					log(
						'Cannot convert from XYZ to another color space.',
						'warn'
					);

					continue;
				}

				const clonedColor = utils.color.narrowToColor(colorValues);

				if (
					!clonedColor ||
					utils.typeGuards.isSLColor(clonedColor) ||
					utils.typeGuards.isSVColor(clonedColor) ||
					utils.typeGuards.isXYZ(clonedColor)
				) {
					log(
						'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.',
						'error'
					);

					continue;
				}

				if (!clonedColor) {
					log(`Conversion to ${targetFormat} failed.`, 'error');

					continue;
				}
				const newColor = clone(convertFn(clonedColor));
				if (!newColor) {
					log(`Conversion to ${targetFormat} failed.`, 'error');
					continue;
				}

				inputBox.value = String(newColor);

				inputBox.setAttribute('data-format', targetFormat);
			}
		} catch (error) {
			log('Color conversion failure.', 'warn');

			throw new Error(`Failed to convert colors: ${error as Error}`);
		}
	}

	return {
		removeTooltip,
		switchColorSpaceInDOM,
		createTooltip(element: HTMLElement, text: string): HTMLElement {
			// remove existing tooltip if present
			removeTooltip(element);

			const tooltip = document.createElement('div');
			tooltip.classList.add('tooltip');
			tooltip.textContent = text;

			// add to body
			document.body.appendChild(tooltip);

			// position it
			positionTooltip(element, tooltip);

			// store reference in dataset for later removal
			element.dataset.tooltipId = tooltip.id;

			// show tooltip with fade-in effect
			setTimeout(() => {
				tooltip.style.opacity = '1';
			}, domConfig.tooltipFadeOut);

			return tooltip;
		},
		downloadFile(data: string, filename: string, type: string): void {
			const blob = new Blob([data], { type });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');

			a.href = url;
			a.download = filename;
			a.click();

			URL.revokeObjectURL(url);
		},
		enforceSwatchRules(minSwatches: number, maxSwatches: number): void {
			const paletteColumnSelector = document.getElementById(
				domIndex.ids.inputs.paletteColumn
			) as HTMLSelectElement;

			if (!paletteColumnSelector) {
				log('paletteColumnSelector not found', 'error');

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
			} else if (
				maxSwatches !== undefined &&
				currentValue > maxSwatches
			) {
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
						`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`,
						'error'
					);

					throw new Error(
						`Failed to dispatch change event: ${error}`
					);
				}
			}
		},
		hideTooltip(): void {
			const tooltip = getElement<HTMLDivElement>('.tooltip');
			if (!tooltip) return;

			tooltip.style.opacity = '0';

			setTimeout(() => {
				tooltip.style.visibility = 'hidden';
				tooltip.remove();
			}, domConfig.tooltipFadeOut || 500);
		},
		scanPaletteColumns(): State['paletteContainer']['columns'] {
			const paletteColumns = getAllElements<HTMLDivElement>(
				classes.paletteColumn
			);

			return Array.from(paletteColumns).map((column, index) => {
				const id = parseInt(
					column.id.split('-').pop() || `${index + 1}`,
					10
				);
				const size = column.clientWidth / paletteColumns.length;
				const isLocked = column.classList.contains(classes.locked);

				return { id, position: index + 1, size, isLocked };
			});
		},
		readFile(file: File): Promise<string> {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();

				reader.onload = () => resolve(reader.result as string);
				reader.onerror = () => reject(reader.error);

				reader.readAsText(file);
			});
		},
		updateColorBox(color: HSL, boxId: string): void {
			const colorBox = document.getElementById(boxId);

			if (colorBox) {
				colorBox.style.backgroundColor =
					utils.color.formatColorAsCSS(color);
			}
		},
		updateHistory(history: Palette[]): void {
			const historyList = getElement<HTMLDivElement>(
				ids.divs.paletteHistory
			);

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
						// TODO: save to history somehow
					});
				historyList.appendChild(entry);
			});
		}
	};
}
