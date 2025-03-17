import {
	ColorInputElement,
	ColorSpace,
	ColorUtilities,
	DOMUtilitiesPartial,
	Helpers,
	HSL,
	Palette,
	Services,
	ValidationUtilities
} from '../../../../types/index.js';
import { config, domConfig, domIndex } from '../../../../config/index.js';

const ids = domIndex.ids;
const mode = config.mode;

export function partialDOMUtilitiesFactory(
	colorUtils: ColorUtilities,
	helpers: Helpers,
	services: Services,
	validate: ValidationUtilities
): DOMUtilitiesPartial {
	const {
		data: { deepClone },
		dom: { getElement, getAllElements }
	} = helpers;
	const { errors, log } = services;

	function createTooltip(
		element: HTMLElement,
		text: string
	): HTMLElement | void {
		return errors.handleSync(() => {
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
		}, '[utils.dom.createTooltip]: Error occurred while creating tooltip.');
	}

	function downloadFile(data: string, filename: string, type: string): void {
		return errors.handleSync(() => {
			const blob = new Blob([data], { type });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
		}, '[utils.dom.downloadFile]: Error occurred while downloading file.');
	}

	function enforceSwatchRules(
		minSwatches: number,
		maxSwatches: number
	): void {
		return errors.handleSync(() => {
			const paletteColumnSelector = document.getElementById(
				domIndex.ids.inputs.paletteColumn
			) as HTMLSelectElement;
			if (!paletteColumnSelector) {
				log.error(
					'paletteColumnSelector not found',
					`utils.dom.enforceMinimumSwatches`
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
					log.error(
						`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`,
						`utils.dom.enforceMinimumSwatches`
					);
					throw new Error(
						`Failed to dispatch change event: ${error}`
					);
				}
			}
		}, 'Error occurred while enforcing swatch rules.');
	}

	function hideTooltip(): void {
		return errors.handleSync(() => {
			const tooltip = getElement<HTMLDivElement>('.tooltip');

			if (!tooltip) return;

			tooltip.style.opacity = '0';

			setTimeout(() => {
				tooltip.style.visibility = 'hidden';
				tooltip.remove();
			}, domConfig.tooltipFadeOut || 500);
		}, '[utils.dom.hideTooltip]: Error occurred while hiding tooltip.');
	}

	function positionTooltip(element: HTMLElement, tooltip: HTMLElement): void {
		return errors.handleSync(() => {
			const rect = element.getBoundingClientRect();
			tooltip.style.position = 'absolute';
			tooltip.style.left = `${rect.left + window.scrollX}px`;
			tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
			tooltip.style.zIndex = '1000';
			tooltip.style.pointerEvents = 'none';
			tooltip.style.opacity = '0';
			tooltip.style.transition = 'opacity 0.2s ease-in-out';
		}, '[utils.dom.positionTooltip]: Error occurred while positioning tooltip.');
	}

	function removeTooltip(element: HTMLElement): void {
		return errors.handleSync(() => {
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
		}, '[utils.dom.removeTooltip]: Error occurred while removing tooltip.');
	}

	function readFile(file: File): Promise<string> {
		return errors.handleAsync(async () => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = () => reject(reader.error);
				reader.readAsText(file);
			});
		}, 'Error occurred while reading file.');
	}

	function switchColorSpaceInDOM(targetFormat: ColorSpace): void {
		return errors.handleSync(() => {
			const colorTextOutputBoxes = Array.from(
				getAllElements<HTMLInputElement>('.color-text-output-box')
			);
			for (const box of colorTextOutputBoxes) {
				const inputBox = box as ColorInputElement;
				const colorValues = inputBox.colorValues;
				if (!colorValues || !validate.colorValue(colorValues)) {
					log.error(
						'Invalid color values. Cannot display toast.',
						`utils.dom.switchColorSpaceInDOM`
					);
					continue;
				}
				const currentFormat = inputBox.getAttribute(
					'data-format'
				) as ColorSpace;
				log.info(
					`Converting from ${currentFormat} to ${targetFormat}`,
					`utils.dom.switchColorSpaceInDOM`
				);
				const convertFn = helpers.color.getConversionFn(
					currentFormat,
					targetFormat
				);
				if (!convertFn) {
					log.error(
						`Conversion from ${currentFormat} to ${targetFormat} is not supported.`,
						`utils.dom.switchColorSpaceInDOM`
					);
					continue;
				}

				const clonedColor = deepClone(colorValues);

				if (!helpers.typeGuards.isConvertibleColor(clonedColor)) {
					log.error(
						'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.',
						`utils.dom.switchColorSpaceInDOM`
					);
					continue;
				}
				const newColor = convertFn(clonedColor);
				if (!newColor) {
					log.error(
						`Conversion to ${targetFormat} failed.`,
						`utils.dom.switchColorSpaceInDOM`
					);
					continue;
				}
				inputBox.value = String(newColor);
				inputBox.setAttribute('data-format', targetFormat);
			}
		}, '[utils.dom.switchColorSpaceInDOM]: Error occurred while converting colors.');
	}

	function updateColorBox(color: HSL, boxId: string): void {
		return errors.handleSync(() => {
			const colorBox = helpers.dom.getElement(boxId);

			if (colorBox) {
				colorBox.style.backgroundColor =
					colorUtils.formatColorAsCSS(color);
			}
		}, '[utils.dom.updateColorBox]: Error occurred while updating color box.');
	}

	function updateHistory(history: Palette[]): void {
		return errors.handleSync(() => {
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
		}, '[domUtils > updateHistory]: Error occurred while updating history.');
	}

	const domUtilitiesPartial: DOMUtilitiesPartial = {
		createTooltip,
		downloadFile,
		enforceSwatchRules,
		hideTooltip,
		positionTooltip,
		removeTooltip,
		readFile,
		switchColorSpaceInDOM,
		updateColorBox,
		updateHistory
	} as const;

	return errors.handleSync(
		() => domUtilitiesPartial,
		'Error occurred while creating partial DOM utilities group.',
		{ context: { domUtilitiesPartial } }
	);
}
