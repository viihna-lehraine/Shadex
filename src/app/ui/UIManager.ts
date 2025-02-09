// File: app/ui/UIManager.ts

import {
	AppUtilsInterface,
	Color,
	ColorSpace,
	ColorInputElement,
	CommonFn_MasterInterface,
	ConstsDataInterface,
	DOMDataInterface,
	DOMSubServiceInterface,
	DOMUtilsInterface,
	EventServiceInterface,
	HSL,
	IOServiceInterface,
	ModeDataInterface,
	Palette,
	PaletteBoxObject,
	SL,
	StoredPalette,
	SV,
	UIManagerInterface
} from '../../types/index.js';
import { DOMSubService } from './services/subServices/DOM.js';
import { EventService } from './services/event/Event.js';
import { IOService } from './services/io/IO.js';
import { appUtils } from '../appUtils.js';
import { commonFn } from '../../common/index.js';
import { constsData as consts } from '../../data/consts.js';
import { domData } from '../../data/dom.js';
import { domUtils } from './domUtils.js';
import { ioFn } from './io/index.js';
import { modeData as mode } from '../../data/mode.js';

const thisModule = 'app/ui/UIManager.ts';

export class UIManager implements UIManagerInterface {
	private static instanceCounter = 0; // static instance ID counter
	private static instances = new Map<number, UIManager>(); // instance registry
	private id: number; // unique instance ID

	private currentPalette: Palette | null = null;
	private paletteHistory: Palette[] = [];

	private idbManager!: IDBManager;

	private consts: ConstsDataInterface;
	private domData: DOMDataInterface;
	private logMode: ModeDataInterface['logging'];
	private mode: ModeDataInterface;

	private appUtils: AppUtilsInterface;
	private domUtils: DOMUtilsInterface;
	private conversionUtils: CommonFn_MasterInterface['convert'];
	private coreUtils: CommonFn_MasterInterface['core'];
	private utils: CommonFn_MasterInterface['utils'];

	private domSubService!: DOMSubServiceInterface;
	private eventService!: EventServiceInterface;
	private ioService!: IOServiceInterface;

	private getCurrentPaletteFn?: () => Promise<Palette | null>;
	private getStoredPalette?: (id: string) => Promise<StoredPalette | null>;

	constructor() {
		this.init();

		this.id = UIManager.instanceCounter++;

		UIManager.instances.set(this.id, this);

		this.paletteHistory = [];

		this.consts = consts;
		this.domData = domData;
		this.logMode = mode.logging;
		this.mode = mode;

		this.appUtils = appUtils;
		this.coreUtils = commonFn.core;
		this.domUtils = domUtils;
		this.utils = commonFn.utils;
		this.conversionUtils = commonFn.convert;

		this.initializeServices();
	}

	/// * * * * * * PUBLIC METHODS * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * *

	public async addPaletteToHistory(palette: Palette): Promise<void> {
		await this.idbManager.addPaletteToHistory(palette);

		this.updateHistory();
	}

	public applyCustomColor(swatch: number): HSL {
		try {
			const colorPicker = this.domSubService.getElement<HTMLInputElement>(
				`custom-color-${swatch}`
			);

			if (!colorPicker) {
				throw new Error(`Color picker for swatch ${swatch} not found`);
			}

			const rawValue = colorPicker.value.trim();

			const formatElement =
				this.domSubService.getElement<HTMLSelectElement>(
					'custom-color-format'
				);

			const selectedFormat = formatElement?.value as ColorSpace;

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
			this.appUtils.log(
				'error',
				`Failed to apply custom color: ${error}. Returning randomly generated hex color`,
				`UIManager.applyCustomColor()`,
				1
			);

			return this.utils.random.hsl() as HSL;
		}
	}

	public async applyFirstColorToUI(color: HSL): Promise<HSL> {
		try {
			const colorBox1 = this.domData.elements.dynamic.divs.colorBox1;

			if (!colorBox1) {
				this.appUtils.log(
					'error',
					'color-box-1 is null',
					`UIManager.applyFirstColorToUI()`
				);

				return color;
			}

			const formatColorString =
				await this.coreUtils.convert.colorToCSS(color);

			if (!formatColorString) {
				this.appUtils.log(
					'error',
					'Unexpected or unsupported color format.',
					`UIManager.applyFirstColorToUI()`
				);

				return color;
			}

			colorBox1.style.backgroundColor = formatColorString;

			this.utils.palette.populateOutputBox(color, 1);

			return color;
		} catch (error) {
			if (this.logMode.error)
				this.appUtils.log(
					'error',
					`Failed to apply first color to UI: ${error}`,
					`UIManager.applyFirstColorToUI()`
				);
			return this.utils.random.hsl() as HSL;
		}
	}

	public copyToClipboard(text: string, tooltipElement: HTMLElement): void {
		try {
			const colorValue = text.replace('Copied to clipboard!', '').trim();

			navigator.clipboard
				.writeText(colorValue)
				.then(() => {
					this.eventService.showTooltip(tooltipElement);

					this.appUtils.log(
						'debug',
						`Copied color value: ${colorValue}`,
						`UIManager.copyToClipboard()`,
						4
					);

					setTimeout(
						() => tooltipElement.classList.remove('show'),
						this.consts.timeouts.tooltip || 1000
					);
				})
				.catch(err => {
					this.appUtils.log(
						'error',
						`Error copying to clipboard: ${err}`,
						`UIManager.copyToClipboard()`
					);
				});
		} catch (error) {
			if (this.logMode.error)
				this.appUtils.log(
					'error',
					`Failed to copy to clipboard: ${error}`,
					`UIManager.copyToClipboard()`
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

	public desaturateColor(swatch: number): void {
		try {
			this.getElementsForSelectedColorSwatch(swatch);
		} catch (error) {
			this.appUtils.log(
				'error',
				`Failed to desaturate color: ${error}`,
				`UIManager.desaturateColor()`,
				2
			);
		}
	}

	public getElementsForSelectedColorSwatch(swatch: number): {
		selectedColorTextOutputBox: HTMLElement | null;
		selectedColorBox: HTMLElement | null;
		selectedColorStripe: HTMLElement | null;
	} {
		const thisMethod = 'getElementsForSelectedColor()';
		const selectedColorBox = document.getElementById(`color-box-${swatch}`);

		if (!selectedColorBox) {
			this.appUtils.log(
				'warn',
				`Element not found for color ${swatch}`,
				`${thisModule} > ${thisMethod}`,
				2
			);

			this.eventService.showToast('Please select a valid color.');

			return {
				selectedColorTextOutputBox: null,
				selectedColorBox: null,
				selectedColorStripe: null
			};
		}

		return {
			selectedColorTextOutputBox: document.getElementById(
				`color-text-output-box-${swatch}`
			),
			selectedColorBox,
			selectedColorStripe: document.getElementById(
				`color-stripe-${swatch}`
			)
		};
	}

	public getInstanceID(): number {
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
		try {
			const palette = await this.getCurrentPalette();

			if (!palette) {
				this.appUtils.log(
					'error',
					'No palette available for export',
					`UIManager.handleExport()`
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
				this.appUtils.log(
					'error',
					`Failed to export palette: ${error}`,
					`UIManager.handleExport()`,
					1
				);
		}
	}

	public async handleImport(
		file: File,
		format: 'JSON' | 'XML' | 'CSS'
	): Promise<void> {
		try {
			const data = await this.domUtils.readFile(file);

			let palette: Palette | null = null;

			switch (format) {
				case 'JSON':
					palette = await ioFn.deserialize.fromJSON(data);
					if (!palette) {
						this.appUtils.log(
							'error',
							'Failed to deserialize JSON data',
							`UIManager.handleImport()`,
							1
						);

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
				this.appUtils.log(
					'error',
					`Failed to deserialize ${format} data`,
					`UIManager.handleImport()`,
					1
				);

				return;
			}

			this.addPaletteToHistory(palette);

			this.appUtils.log(
				'debug',
				`Successfully imported palette in ${format} format.`,
				`UIManager.handleImport()`,
				2
			);
		} catch (error) {
			this.appUtils.log(
				'error',
				`Failed to import file: ${error}`,
				`UIManager.handleImport()`
			);
		}
	}

	public async loadPaletteHistory(): Promise<void> {
		const history = await this.idbManager.getPaletteHistory();

		this.updateHistory(history);
	}

	public async makePaletteBox(
		color: Color,
		swatchCount: number
	): Promise<PaletteBoxObject> {
		try {
			if (!this.coreUtils.validate.colorValues(color)) {
				this.appUtils.log(
					'error',
					`Invalid ${color.format} color value ${JSON.stringify(color)}`,
					`UIManager.makePaletteBox()`
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
				await this.coreUtils.convert.colorToCSS(clonedColor);

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

					this.eventService.showTooltip(colorTextOutputBox);

					clearTimeout(consts.timeouts.tooltip || 1000);

					copyButton.textContent = 'Copied!';
					setTimeout(
						() => (copyButton.textContent = 'Copy'),
						consts.timeouts.copyButtonText || 1000
					);
				} catch (error) {
					this.appUtils.log(
						'error',
						`Failed to copy: ${error}`,
						`UIManager.makePaletteBox()`
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

			this.getEventListenerFn().dragAndDrop.attach(colorStripe);

			colorStripe.appendChild(paletteBox);

			return {
				colorStripe,
				swatchCount: swatchCount + 1
			};
		} catch (error) {
			this.appUtils.log(
				'error',
				`Failed to execute makePaletteBox: ${error}`,
				`UIManager.makePaletteBox()`
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

			if (!paletteTypeElement) {
				this.appUtils.log(
					'warn',
					'paletteTypeOptions DOM element not found',
					`UIManager.pullParamsFromUI()`,
					2
				);
			}
			if (!numSwatchesElement) {
				this.appUtils.log(
					'warn',
					`numBoxes DOM element not found`,
					`UIManager.pullParamsFromUI()`,
					2
				);
			}
			if (
				(!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) &&
				this.logMode.verbosity >= 2
			) {
				this.appUtils.log(
					'warn',
					`One or more checkboxes not found`,
					`UIManager.pullParamsFromUI()`
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
			this.appUtils.log(
				'error',
				`Failed to pull parameters from UI: ${error}`,
				`UIManager.pullParamsFromUI()`
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
		const history = await this.idbManager.getPaletteHistory();
		const updatedHistory = history.filter(p => p.id !== paletteID);

		await this.idbManager.savePaletteHistory(updatedHistory);

		this.updateHistory();
	}

	public async renderPalette(tableId: string): Promise<void | null> {
		if (!this.getStoredPalette) {
			throw new Error('Palette fetching function has not been set.');
		}

		return this.appUtils.handleAsync(
			async () => {
				const storedPalette = await this.getStoredPalette!(tableId);
				const paletteRow = document.getElementById('palette-row');

				if (!storedPalette)
					throw new Error(`Palette ${tableId} not found.`);
				if (!paletteRow)
					throw new Error('Palette row element not found.');

				paletteRow.innerHTML = '';

				const tableElement = this.createPaletteTable(storedPalette);
				paletteRow.appendChild(tableElement);

				this.appUtils.log(
					'debug',
					`Rendered palette ${tableId}.`,
					`UIManager.renderPalette()`,
					2
				);
			},
			'Error rendering palette',
			'UIManager.renderPalette()'
		);
	}

	public saturateColor(swatch: number): void {
		try {
			this.getElementsForSelectedColorSwatch(swatch);

			this.eventService.saturateColor();
		} catch (error) {
			this.appUtils.log(
				'error',
				`Failed to saturate color: ${error}`,
				`UIManager.saturateColor()`
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

	public setIDBManager(idbManager: IDBManager) {
		this.idbManager = idbManager;
	}

	public showToast(message: string): void {
		this.eventService.showToast(message);
	}

	public updateHistory(history?: Palette[]): void {
		this.domSubService.updateHistory(history || this.paletteHistory);
	}

	/// * * * * * * PRIVATE METHODS * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * *

	private async init(): Promise<void> {
		this.idbManager = await IDBManager.getInstance();

		await this.initializeServices();
		await this.loadPaletteHistory();
	}

	private async initializeServices(): Promise<void> {
		this.domSubService = await DOMSubService.getInstance();
		this.eventService = await EventService.getInstance();
		this.ioService = await IOService.getInstance();
	}
}
