// File: src/ui/UIManager.ts

import {
	Color,
	ColorSpace,
	CommonFn_MasterInterface,
	ConstsDataInterface,
	DOMDataInterface,
	DOMFn_MasterInterface,
	HSL,
	IOFn_MasterInterface,
	ModeDataInterface,
	Palette,
	SL,
	StoredPalette,
	SV,
	UIManager_ClassInterface
} from '../types/index.js';
import { commonFn } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { constsData as consts } from '../data/consts.js';
import { domData } from '../data/dom.js';
import { fileUtils } from '../dom/fileUtils.js';
import { ioFn } from '../io/index.js';
import { modeData as mode } from '../data/mode.js';

const thisModule = 'ui/UIManager.ts';

const logger = await createLogger();

export class UIManager implements UIManager_ClassInterface {
	private static instanceCounter = 0; // static instance ID counter
	private static instances = new Map<number, UIManager>(); // instance registry
	private id: number; // unique instance ID
	private currentPalette: Palette | null = null;
	private paletteHistory: Palette[] = [];

	private consts: ConstsDataInterface;
	private domData: DOMDataInterface;
	private logMode: ModeDataInterface['logging'];
	private mode: ModeDataInterface;

	private conversionUtils: CommonFn_MasterInterface['convert'];
	private coreUtils: CommonFn_MasterInterface['core'];
	private helpers: CommonFn_MasterInterface['helpers'];
	private utils: CommonFn_MasterInterface['utils'];

	private fileUtils: DOMFn_MasterInterface['fileUtils'];
	private ioFn: IOFn_MasterInterface;

	private getCurrentPaletteFn?: () => Promise<Palette | null>;
	private getStoredPalette?: (id: string) => Promise<StoredPalette | null>;

	constructor() {
		this.id = UIManager.instanceCounter++;

		UIManager.instances.set(this.id, this);

		this.paletteHistory = [];

		this.consts = consts;
		this.domData = domData;
		this.logMode = mode.logging;
		this.mode = mode;

		this.coreUtils = commonFn.core;
		this.helpers = commonFn.helpers;
		this.utils = commonFn.utils;
		this.conversionUtils = commonFn.convert;

		this.fileUtils = fileUtils;
		this.ioFn = ioFn;
	}

	/* PUBLIC METHODS */

	public addPaletteToHistory(palette: Palette): void {
		this.paletteHistory.unshift(palette);

		if (this.paletteHistory.length >= 50) this.paletteHistory.pop();
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

			return this.utils.random.hsl(false) as HSL;
		}
	}

	public async applyFirstColorToUI(color: HSL): Promise<HSL> {
		const thisMethod = 'applyFirstColorToUI()';
		try {
			const colorBox1 = this.domData.elements.divs.colorBox1;

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
			return this.utils.random.hsl(false) as HSL;
		}
	}

	public copyToClipboard(text: string, tooltipElement: HTMLElement): void {
		const thisMethod = 'copyToClipboard()';

		try {
			const colorValue = text.replace('Copied to clipboard!', '').trim();

			navigator.clipboard
				.writeText(colorValue)
				.then(() => {
					this.helpers.dom.showTooltip(tooltipElement);

					if (
						!this.mode.quiet &&
						this.mode.debug &&
						this.logMode.verbosity > 2 &&
						this.logMode.info
					) {
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

			this.helpers.dom.showToast('Please select a valid color.');

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
					this.ioFn.exportPalette(palette, format);
					break;
				case 'json':
					this.ioFn.exportPalette(palette, format);
					break;
				case 'xml':
					this.ioFn.exportPalette(palette, format);
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
			const data = await this.fileUtils.readFile(file);

			let palette: Palette | null = null;

			switch (format) {
				case 'JSON':
					palette = await this.ioFn.deserialize.fromJSON(data);
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
					palette =
						(await this.ioFn.deserialize.fromXML(data)) || null;
					break;
				case 'CSS':
					palette =
						(await this.ioFn.deserialize.fromCSS(data)) || null;
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

			if (this.logMode.info && this.logMode.verbosity > 1) {
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

	public pullParamsFromUI(): {
		type: number;
		swatches: number;
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	} {
		const thisMethod = 'pullParamsFromUI()';

		try {
			const paletteTypeOptionsElement =
				domData.elements.inputs.paletteTypeOptions;
			const numBoxesElement =
				domData.elements.inputs.paletteNumberOptions;
			const enableAlphaCheckbox =
				domData.elements.inputs.enableAlphaCheckbox;
			const limitDarknessCheckbox =
				domData.elements.inputs.limitDarknessCheckbox;
			const limitGraynessCheckbox =
				domData.elements.inputs.limitGraynessCheckbox;
			const limitLightnessCheckbox =
				domData.elements.inputs.limitLightnessCheckbox;

			if (
				!paletteTypeOptionsElement &&
				!this.mode.quiet &&
				this.logMode.debug &&
				this.logMode.verbosity >= 2
			) {
				logger.warn(
					'paletteTypeOptions DOM element not found',
					`${thisModule} > ${thisMethod}`
				);
			}
			if (
				!numBoxesElement &&
				!this.mode.quiet &&
				this.logMode.debug &&
				this.logMode.verbosity >= 2
			) {
				logger.warn(
					`numBoxes DOM element not found`,
					`${thisModule} > ${thisMethod}`
				);
			}
			if (
				(!enableAlphaCheckbox ||
					!limitDarknessCheckbox ||
					!limitGraynessCheckbox ||
					!limitLightnessCheckbox) &&
				!this.mode.quiet &&
				this.logMode.debug &&
				this.logMode.verbosity >= 2
			) {
				logger.warn(
					`One or more checkboxes not found`,
					`${thisModule} > ${thisMethod}`
				);
			}

			return {
				type: paletteTypeOptionsElement
					? parseInt(paletteTypeOptionsElement.value, 10)
					: 0,
				swatches: numBoxesElement
					? parseInt(numBoxesElement.value, 10)
					: 0,
				enableAlpha: enableAlphaCheckbox?.checked || false,
				limitDarkness: limitDarknessCheckbox?.checked || false,
				limitGrayness: limitGraynessCheckbox?.checked || false,
				limitLightness: limitLightnessCheckbox?.checked || false
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
				enableAlpha: false,
				limitDarkness: false,
				limitGrayness: false,
				limitLightness: false
			};
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

			if (!this.mode.quiet)
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
}
