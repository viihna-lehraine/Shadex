// File: src/ui/UIManager.ts

import {
	Color,
	ColorSpace,
	ColorInputElement,
	CommonFn_MasterInterface,
	ConstsDataInterface,
	DOMDataInterface,
	DOMFn_EventListenerFnInterface,
	HSL,
	ModeDataInterface,
	Palette,
	PaletteBoxObject,
	SL,
	StoredPalette,
	SV,
	UIManager_ClassInterface
} from '../types/index.js';
import { IDBManager } from '../db/IDBManager.js';
import { SettingsService } from '../db/services/SettingsService.js';
import { commonFn } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { constsData as consts } from '../data/consts.js';
import { domData } from '../data/dom.js';
import { download, readFile } from '../dom/utils.js';
import { ioFn } from '../io/index.js';
import { modeData as mode } from '../data/mode.js';
import { getIDBInstance } from 'src/db/instance.js';

const thisModule = 'ui/UIManager.ts';

const fileUtils = {
	download,
	readFile
};

const logger = await createLogger();

export class UIManager implements UIManager_ClassInterface {
	private static instanceCounter = 0; // static instance ID counter
	private static instances = new Map<number, UIManager>(); // instance registry
	private id: number; // unique instance ID
	private currentPalette: Palette | null = null;
	private paletteHistory: Palette[] = [];

	private idbManager: IDBManager | null;

	private consts: ConstsDataInterface;
	private domData: DOMDataInterface;
	private logMode: ModeDataInterface['logging'];
	private mode: ModeDataInterface;

	private conversionUtils: CommonFn_MasterInterface['convert'];
	private coreUtils: CommonFn_MasterInterface['core'];
	private utils: CommonFn_MasterInterface['utils'];

	private getCurrentPaletteFn?: () => Promise<Palette | null>;
	private getStoredPalette?: (id: string) => Promise<StoredPalette | null>;

	private eventListenerFn: DOMFn_EventListenerFnInterface;

	constructor(
		eventListenerFn: DOMFn_EventListenerFnInterface,
		idbManager?: IDBManager
	) {
		this.init();

		this.id = UIManager.instanceCounter++;

		UIManager.instances.set(this.id, this);

		this.idbManager = idbManager || null;

		this.paletteHistory = [];

		this.consts = consts;
		this.domData = domData;
		this.logMode = mode.logging;
		this.mode = mode;

		this.coreUtils = commonFn.core;
		this.utils = commonFn.utils;
		this.conversionUtils = commonFn.convert;

		this.eventListenerFn = eventListenerFn;
	}

	/* PUBLIC METHODS */

	public async addPaletteToHistory(palette: Palette): Promise<void> {
		const thisMethod = 'addPaletteToHistory()';

		const idbManager = await getIDBInstance();
		const settingsManager = await SettingsService.getInstance();
		const maxHistory = settingsManager.maxHistory;

		try {
			const history = await idbManager.getPaletteHistory();
			const newID = (await idbManager.getCurrentPaletteID()) + 1;
			const idString = `${palette.metadata.type}_${newID}`;

			await idbManager.savePaletteHistory(history);

			if (this.logMode.verbosity > 2)
				logger.info(
					`Added palette with ID ${idString} to history`,
					`${thisModule} > ${thisMethod}`
				);
		} catch (error) {
			logger.error(
				`Error adding palette to history: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
		}

		this.paletteHistory.unshift(palette);

		if (this.paletteHistory.length > maxHistory) this.paletteHistory.pop();

		if (this.idbManager) {
			await this.idbManager.savePaletteHistory(this.paletteHistory);
		} else {
			const idbManager = await IDBManager.getInstance();
			await idbManager.savePaletteHistory(this.paletteHistory);
		}

		this.updateHistoryUI();
	}

	public applyCustomColor(): HSL {
		const thisMethod = 'applyCustomColor()';

		try {
			const colorPicker = document.getElementById(
				'custom-color-picker'
			) as HTMLInputElement | null;

			if (!colorPicker) {
				throw new Error('Color picker element not found');
			}

			const rawValue = colorPicker.value.trim();

			// *DEV-NOTE* Add this to the Data object
			const selectedFormat = (
				document.getElementById(
					'custom-color-format'
				) as HTMLSelectElement | null
			)?.value as ColorSpace;

			if (!this.utils.color.isColorSpace(selectedFormat)) {
				if (!this.mode.gracefulErrors)
					throw new Error(
						`Unsupported color format: ${selectedFormat}`
					);
			}

			const parsedColor = this.utils.color.parseColor(
				selectedFormat,
				rawValue
			) as Exclude<Color, SL | SV>;

			if (!parsedColor) {
				if (!this.mode.gracefulErrors)
					throw new Error(`Invalid color value: ${rawValue}`);
			}

			const hslColor = this.utils.color.isHSLColor(parsedColor)
				? parsedColor
				: this.conversionUtils.toHSL(parsedColor);

			return hslColor;
		} catch (error) {
			if (this.logMode.error)
				logger.error(
					`Failed to apply custom color: ${error}. Returning randomly generated hex color`,
					`${thisModule} > ${thisMethod}`
				);

			return this.utils.random.hsl() as HSL;
		}
	}

	public async applyFirstColorToUI(color: HSL): Promise<HSL> {
		const thisMethod = 'applyFirstColorToUI()';
		try {
			const colorBox1 = this.domData.elements.dynamic.divs.colorBox1;

			if (!colorBox1) {
				if (this.logMode.error)
					logger.error(
						'color-box-1 is null',
						`${thisModule} > ${thisMethod}`
					);

				return color;
			}

			const formatColorString =
				await this.coreUtils.convert.colorToCSSColorString(color);

			if (!formatColorString) {
				if (this.logMode.error)
					logger.error(
						'Unexpected or unsupported color format.',
						`${thisModule} > ${thisMethod}`
					);

				return color;
			}

			colorBox1.style.backgroundColor = formatColorString;

			this.utils.palette.populateOutputBox(color, 1);

			return color;
		} catch (error) {
			if (this.logMode.error)
				logger.error(
					`Failed to apply first color to UI: ${error}`,
					`${thisModule} > ${thisMethod}`
				);
			return this.utils.random.hsl() as HSL;
		}
	}

	public copyToClipboard(text: string, tooltipElement: HTMLElement): void {
		const thisMethod = 'copyToClipboard()';

		try {
			const colorValue = text.replace('Copied to clipboard!', '').trim();

			navigator.clipboard
				.writeText(colorValue)
				.then(() => {
					this.getEventListenerFn().temp.showTooltip(tooltipElement);

					if (this.logMode.verbosity > 2) {
						logger.info(
							`Copied color value: ${colorValue}`,
							`${thisModule} > ${thisMethod}`
						);
					}

					setTimeout(
						() => tooltipElement.classList.remove('show'),
						this.consts.timeouts.tooltip || 1000
					);
				})
				.catch(err => {
					if (this.logMode.error)
						logger.error(
							`Error copying to clipboard: ${err}`,
							`${thisModule} > ${thisMethod}`
						);
				});
		} catch (error) {
			if (this.logMode.error)
				logger.error(
					`Failed to copy to clipboard: ${error}`,
					`${thisModule} > ${thisMethod}`
				);
		}
	}

	public createPaletteTable(palette: StoredPalette): HTMLElement {
		const fragment = document.createDocumentFragment();
		const table = document.createElement('table');
		table.classList.add('palette-table');

		palette.palette.items.forEach((item, index) => {
			const row = document.createElement('tr');
			const cell = document.createElement('td');
			const colorBox = document.createElement('div');

			cell.textContent = `Color ${index + 1}`;
			colorBox.classList.add('color-box');
			colorBox.style.backgroundColor = item.colors.css.hex;

			row.appendChild(colorBox);
			row.appendChild(cell);
			table.appendChild(row);
		});

		fragment.appendChild(table);

		return fragment as unknown as HTMLElement;
	}

	public desaturateColor(selectedColor: number): void {
		const thisMethod = 'desaturateColor()';

		try {
			this.getElementsForSelectedColor(selectedColor);
		} catch (error) {
			if (this.logMode.error)
				logger.error(
					`Failed to desaturate color: ${error}`,
					`${thisModule} > ${thisMethod}`
				);
		}
	}

	public getElementsForSelectedColor(selectedColor: number): {
		selectedColorTextOutputBox: HTMLElement | null;
		selectedColorBox: HTMLElement | null;
		selectedColorStripe: HTMLElement | null;
	} {
		const thisMethod = 'getElementsForSelectedColor()';
		const selectedColorBox = document.getElementById(
			`color-box-${selectedColor}`
		);

		if (!selectedColorBox) {
			if (this.logMode.warn)
				logger.warn(
					`Element not found for color ${selectedColor}`,
					`${thisModule} > ${thisMethod}`
				);

			this.getEventListenerFn().temp.showToast(
				'Please select a valid color.'
			);

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

	public getID(): number {
		return this.id;
	}

	public static getAllInstances(): UIManager[] {
		return Array.from(UIManager.instances.values());
	}

	public async getCurrentPalette(): Promise<Palette | null> {
		if (this.getCurrentPaletteFn) {
			return await this.getCurrentPaletteFn();
		}
		return (
			this.currentPalette ||
			(this.paletteHistory.length > 0 ? this.paletteHistory[0] : null)
		);
	}

	public static getInstanceById(id: number): UIManager | undefined {
		return UIManager.instances.get(id);
	}

	public static deleteInstanceById(id: number): void {
		UIManager.instances.delete(id);
	}

	public async handleExport(format: string): Promise<void> {
		const thisMethod = 'handleExport()';

		try {
			const palette = await this.getCurrentPalette();

			if (!palette) {
				logger.error(
					'No palette available for export',
					`${thisModule} > ${thisMethod}`
				);

				return;
			}

			switch (format) {
				case 'css':
					ioFn.exportPalette(palette, format);
					break;
				case 'json':
					ioFn.exportPalette(palette, format);
					break;
				case 'xml':
					ioFn.exportPalette(palette, format);
					break;
				default:
					throw new Error(`Unsupported export format: ${format}`);
			}
		} catch (error) {
			if (this.logMode.error && this.logMode.verbosity > 1)
				logger.error(
					`Failed to export palette: ${error}`,
					`${thisModule} > ${thisMethod}`
				);
		}
	}

	public async handleImport(
		file: File,
		format: 'JSON' | 'XML' | 'CSS'
	): Promise<void> {
		try {
			const thisMethod = 'handleImport()';
			const data = await fileUtils.readFile(file);

			let palette: Palette | null = null;

			switch (format) {
				case 'JSON':
					palette = await ioFn.deserialize.fromJSON(data);
					if (!palette) {
						if (this.logMode.error && this.logMode.verbosity > 1) {
							logger.error(
								'Failed to deserialize JSON data',
								`${thisModule} > ${thisMethod}`
							);
						}

						return;
					}
					break;
				case 'XML':
					palette = (await ioFn.deserialize.fromXML(data)) || null;
					break;
				case 'CSS':
					palette = (await ioFn.deserialize.fromCSS(data)) || null;
					break;
				default:
					throw new Error(`Unsupported format: ${format}`);
			}

			if (!palette) {
				if (this.logMode.error && this.logMode.verbosity > 1) {
					logger.error(
						`Failed to deserialize ${format} data`,
						`${thisModule} > ${thisMethod}`
					);
				}
				return;
			}

			this.addPaletteToHistory(palette);

			if (this.logMode.verbosity > 1) {
				logger.info(
					`Successfully imported palette in ${format} format.`,
					`${thisModule} > ${thisMethod}`
				);
			}
		} catch (error) {
			logger.error(
				`Failed to import file: ${error}`,
				`${thisModule} > handleImport()`
			);
		}
	}

	public async makePaletteBox(
		color: Color,
		swatchCount: number
	): Promise<PaletteBoxObject> {
		const thisMethod = 'makePaletteBox()';

		try {
			if (!this.coreUtils.validate.colorValues(color)) {
				if (!this.logMode.error)
					logger.error(
						`Invalid ${color.format} color value ${JSON.stringify(color)}`,
						`${thisModule} > ${thisMethod}`
					);

				return {
					colorStripe: document.createElement('div'),
					swatchCount
				};
			}

			const clonedColor = this.coreUtils.base.clone(color);

			const paletteBox = document.createElement('div');
			paletteBox.className = 'palette-box';
			paletteBox.id = `palette-box-${swatchCount}`;

			const paletteBoxTopHalf = document.createElement('div');
			paletteBoxTopHalf.className =
				'palette-box-half palette-box-top-half';
			paletteBoxTopHalf.id = `palette-box-top-half-${swatchCount}`;

			const colorTextOutputBox = document.createElement(
				'input'
			) as ColorInputElement;
			colorTextOutputBox.type = 'text';
			colorTextOutputBox.className = 'color-text-output-box tooltip';
			colorTextOutputBox.id = `color-text-output-box-${swatchCount}`;
			colorTextOutputBox.setAttribute('data-format', 'hex');

			const colorString =
				await this.coreUtils.convert.colorToCSSColorString(clonedColor);

			colorTextOutputBox.value = colorString || '';
			colorTextOutputBox.colorValues = clonedColor;
			colorTextOutputBox.readOnly = false;
			colorTextOutputBox.style.cursor = 'text';
			colorTextOutputBox.style.pointerEvents = 'none';

			const copyButton = document.createElement('button');
			copyButton.className = 'copy-button';
			copyButton.textContent = 'Copy';

			const tooltipText = document.createElement('span');
			tooltipText.className = 'tooltiptext';
			tooltipText.textContent = 'Copied to clipboard!';

			copyButton.addEventListener('click', async () => {
				try {
					await navigator.clipboard.writeText(
						colorTextOutputBox.value
					);

					this.getEventListenerFn().temp.showTooltip(
						colorTextOutputBox
					);

					clearTimeout(consts.timeouts.tooltip || 1000);

					copyButton.textContent = 'Copied!';
					setTimeout(
						() => (copyButton.textContent = 'Copy'),
						consts.timeouts.copyButtonText || 1000
					);
				} catch (error) {
					if (!this.logMode.error)
						logger.error(
							`Failed to copy: ${error}`,
							`${thisModule} > ${thisMethod}`
						);
				}
			});

			colorTextOutputBox.addEventListener(
				'input',
				this.coreUtils.base.debounce((e: Event) => {
					const target = e.target as HTMLInputElement | null;
					if (target) {
						const cssColor = target.value.trim();
						const boxElement = document.getElementById(
							`color-box-${swatchCount}`
						);
						const stripeElement = document.getElementById(
							`color-stripe-${swatchCount}`
						);

						if (boxElement)
							boxElement.style.backgroundColor = cssColor;
						if (stripeElement)
							stripeElement.style.backgroundColor = cssColor;
					}
				}, consts.debounce.input || 200)
			);

			paletteBoxTopHalf.appendChild(colorTextOutputBox);
			paletteBoxTopHalf.appendChild(copyButton);

			const paletteBoxBottomHalf = document.createElement('div');
			paletteBoxBottomHalf.className =
				'palette-box-half palette-box-bottom-half';
			paletteBoxBottomHalf.id = `palette-box-bottom-half-${swatchCount}`;

			const colorBox = document.createElement('div');
			colorBox.className = 'color-box';
			colorBox.id = `color-box-${swatchCount}`;
			colorBox.style.backgroundColor = colorString || '#ffffff';

			paletteBoxBottomHalf.appendChild(colorBox);
			paletteBox.appendChild(paletteBoxTopHalf);
			paletteBox.appendChild(paletteBoxBottomHalf);

			const colorStripe = document.createElement('div');
			colorStripe.className = 'color-stripe';
			colorStripe.id = `color-stripe-${swatchCount}`;
			colorStripe.style.backgroundColor = colorString || '#ffffff';

			colorStripe.setAttribute('draggable', 'true');

			this.getEventListenerFn().dad.attach(colorStripe);

			colorStripe.appendChild(paletteBox);

			return {
				colorStripe,
				swatchCount: swatchCount + 1
			};
		} catch (error) {
			if (!this.logMode.error)
				logger.error(
					`Failed to execute makePaletteBox: ${error}`,
					`${thisModule} > ${thisMethod}`
				);

			return {
				colorStripe: document.createElement('div'),
				swatchCount
			};
		}
	}

	public pullParamsFromUI(): {
		type: number;
		swatches: number;
		limitDark: boolean;
		limitGray: boolean;
		limitLight: boolean;
	} {
		const thisMethod = 'pullParamsFromUI()';

		try {
			const paletteTypeElement =
				domData.elements.static.selects.paletteType;
			const numSwatchesElement =
				domData.elements.static.selects.swatchGen;
			const limitDarkChkbx =
				domData.elements.static.inputs.limitDarkChkbx;
			const limitGrayChkbx =
				domData.elements.static.inputs.limitGrayChkbx;
			const limitLightChkbx =
				domData.elements.static.inputs.limitLightChkbx;

			if (!paletteTypeElement && this.logMode.verbosity >= 2) {
				logger.warn(
					'paletteTypeOptions DOM element not found',
					`${thisModule} > ${thisMethod}`
				);
			}
			if (!numSwatchesElement && this.logMode.verbosity >= 2) {
				logger.warn(
					`numBoxes DOM element not found`,
					`${thisModule} > ${thisMethod}`
				);
			}
			if (
				(!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) &&
				this.logMode.verbosity >= 2
			) {
				logger.warn(
					`One or more checkboxes not found`,
					`${thisModule} > ${thisMethod}`
				);
			}

			return {
				type: paletteTypeElement
					? parseInt(paletteTypeElement.value, 10)
					: 0,
				swatches: numSwatchesElement
					? parseInt(numSwatchesElement.value, 10)
					: 0,
				limitDark: limitDarkChkbx?.checked || false,
				limitGray: limitGrayChkbx?.checked || false,
				limitLight: limitLightChkbx?.checked || false
			};
		} catch (error) {
			if (this.logMode.error)
				logger.error(
					`Failed to pull parameters from UI: ${error}`,
					`${thisModule} > ${thisMethod}`
				);

			return {
				type: 0,
				swatches: 0,
				limitDark: false,
				limitGray: false,
				limitLight: false
			};
		}
	}

	public async removePaletteFromHistory(paletteID: string): Promise<void> {
		const thisMethod = 'removePaletteFromHistory()';

		try {
			const entry = document.getElementById(`palette_${paletteID}`);

			if (!entry) return;

			entry.remove();

			const idbManager = await IDBManager.getInstance();

			this.paletteHistory = this.paletteHistory.filter(
				p => p.id !== paletteID
			);

			await idbManager.savePaletteHistory(this.paletteHistory);

			if (this.logMode.verbosity > 2)
				logger.info(
					`Removed palette ${paletteID} from history`,
					`${thisModule} > ${thisMethod}`
				);
		} catch (error) {
			logger.error(
				`Error removing palette ${paletteID}: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
		}
	}

	public async renderPalette(tableId: string): Promise<void | null> {
		const thisMethod = 'renderPalette()';

		if (!this.getStoredPalette) {
			throw new Error('Palette fetching function has not been set.');
		}

		return this.utils.errors.handleAsync(async () => {
			const storedPalette = await this.getStoredPalette!(tableId);
			const paletteRow = document.getElementById('palette-row');

			if (!storedPalette)
				throw new Error(`Palette ${tableId} not found.`);
			if (!paletteRow) throw new Error('Palette row element not found.');

			paletteRow.innerHTML = '';

			const tableElement = this.createPaletteTable(storedPalette);
			paletteRow.appendChild(tableElement);

			if (this.logMode.verbosity > 2)
				logger.info(
					`Rendered palette ${tableId}.`,
					`${thisModule} > ${thisMethod}`
				);
		}, 'UIManager.renderPalette(): Error rendering palette');
	}

	public saturateColor(selectedColor: number): void {
		const thisMethod = 'saturateColor()';

		try {
			this.getElementsForSelectedColor(selectedColor);
			// *DEV-NOTE* unfinished function
		} catch (error) {
			if (this.logMode.error)
				logger.error(
					`Failed to saturate color: ${error}`,
					`${thisModule} > ${thisMethod}`
				);
		}
	}

	public setCurrentPalette(palette: Palette): void {
		this.currentPalette = palette;
	}

	public setGetCurrentPaletteFn(fn: () => Promise<Palette | null>): void {
		this.getCurrentPaletteFn = fn;
	}

	public setGetStoredPalette(
		getter: (id: string) => Promise<StoredPalette | null>
	): void {
		this.getStoredPalette = getter;
	}

	/* PRIVATE METHODS */

	private async init(): Promise<void> {
		this.idbManager = await IDBManager.getInstance();

		await this.loadPaletteHistory();
	}

	private getEventListenerFn(): DOMFn_EventListenerFnInterface {
		if (!this.eventListenerFn) {
			throw new Error('Event listeners have not been initialized yet.');
		}

		return this.eventListenerFn;
	}

	private async loadPaletteHistory(): Promise<void> {
		if (!this.idbManager) return;

		const history = await this.idbManager.getPaletteHistory();
		const settings = await SettingsService.getInstance();

		const maxHistory = settings.maxHistory;

		if (history) {
			this.paletteHistory = history.slice(0, maxHistory);
			this.updateHistoryUI();
		}
	}

	private updateHistoryUI(): void {
		const historyList = this.domData.elements.static.divs.paletteHistory;

		if (!historyList) return;

		historyList.innerHTML = '';

		this.paletteHistory.forEach(palette => {
			const entryID = `palette_${palette.id}`;
			const entry = document.createElement('div');
			entry.classList.add('history-item');
			entry.id = entryID;

			const colors = palette.items
				.map(
					item =>
						/*html*/
						`<span class="color-box" style="background: ${item.colors.css.hex};">
						</span>`
				)
				.join(' ');

			const removeBtn = document.createElement('button');

			removeBtn.textContent = 'Remove';
			removeBtn.classList.add('remove-history-item');
			removeBtn.dataset.id = `${palette.id}-history-remove-btn`;

			removeBtn.addEventListener('click', async () => {
				await this.removePaletteFromHistory(palette.id);
			});

			entry.innerHTML =
				/*html*/
				`
				<p>Palette #${palette.metadata.name || palette.id}</p>
				<div class="color-preview">${colors}</div>
				`;

			historyList.appendChild(entry);
		});
	}
}
