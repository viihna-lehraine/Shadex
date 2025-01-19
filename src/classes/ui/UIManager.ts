// File: src/classes/ui/UIManager.ts

import {
	Color,
	ColorSpace,
	CommonFnMasterInterface,
	DataInterface,
	DOMFnMasterInterface,
	HSL,
	Palette,
	SL,
	StoredPalette,
	SV,
	SyncLoggerFactory,
	UIManagerInterface
} from '../../index/index.js';
import { common, core, helpers, utils } from '../../common/index.js';
import { data } from '../../data/index.js';
import { dom } from '../../dom/index.js';
import { io } from '../../io/index.js';
import { log } from '../logger/index.js';

export class UIManager implements UIManagerInterface {
	private static instanceCounter = 0; // static instance ID counter
	private static instances = new Map<number, UIManager>(); // instance registry
	private id: number; // unique instance ID
	private currentPalette: Palette | null = null;
	private paletteHistory: Palette[] = [];

	private logger: SyncLoggerFactory;
	private errorUtils: CommonFnMasterInterface['utils']['errors'];
	private conversionUtils: CommonFnMasterInterface['convert'];
	private dom: DOMFnMasterInterface;
	private io = io;

	private elements: DataInterface['consts']['dom']['elements'];

	private logMode: DataInterface['mode']['logging'] = data.mode.logging;
	private mode: DataInterface['mode'] = data.mode;

	private getCurrentPaletteFn?: () => Promise<Palette | null>;
	private getStoredPalette?: (id: string) => Promise<StoredPalette | null>;

	constructor(elements: DataInterface['consts']['dom']['elements']) {
		this.id = UIManager.instanceCounter++;
		UIManager.instances.set(this.id, this);
		this.paletteHistory = [];
		this.logger = log;
		this.errorUtils = utils.errors;
		this.conversionUtils = common.convert;
		this.elements = elements;
		this.dom = dom;
		this.io = io;
	}

	/* PUBLIC METHODS */

	public addPaletteToHistory(palette: Palette): void {
		this.paletteHistory.unshift(palette);

		if (this.paletteHistory.length >= 50) this.paletteHistory.pop();
	}

	public applyCustomColor(): HSL {
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

			if (!utils.color.isColorSpace(selectedFormat)) {
				if (!this.mode.gracefulErrors)
					throw new Error(
						`Unsupported color format: ${selectedFormat}`
					);
			}

			const parsedColor = utils.color.parseColor(
				selectedFormat,
				rawValue
			) as Exclude<Color, SL | SV>;

			if (!parsedColor) {
				if (!this.mode.gracefulErrors)
					throw new Error(`Invalid color value: ${rawValue}`);
			}

			const hslColor = utils.color.isHSLColor(parsedColor)
				? parsedColor
				: this.conversionUtils.toHSL(parsedColor);

			return hslColor;
		} catch (error) {
			if (this.logMode.errors)
				this.logger.error(
					`Failed to apply custom color: ${error}. Returning randomly generated hex color`
				);

			return utils.random.hsl(false) as HSL;
		}
	}

	public applyFirstColorToUI(color: HSL): HSL {
		try {
			const colorBox1 = this.elements.colorBox1;

			if (!colorBox1) {
				if (this.logMode.errors)
					this.logger.error('color-box-1 is null');

				return color;
			}

			const formatColorString = core.convert.toCSSColorString(color);

			if (!formatColorString) {
				if (this.logMode.errors)
					this.logger.error(
						'Unexpected or unsupported color format.'
					);

				return color;
			}

			colorBox1.style.backgroundColor = formatColorString;

			utils.palette.populateOutputBox(color, 1);

			return color;
		} catch (error) {
			if (this.logMode.errors)
				this.logger.error(
					`Failed to apply first color to UI: ${error}`
				);
			return utils.random.hsl(false) as HSL;
		}
	}

	public copyToClipboard(text: string, tooltipElement: HTMLElement): void {
		try {
			const colorValue = text.replace('Copied to clipboard!', '').trim();

			navigator.clipboard
				.writeText(colorValue)
				.then(() => {
					helpers.dom.showTooltip(tooltipElement);

					if (
						!this.mode.quiet &&
						this.mode.debug &&
						this.logMode.verbosity > 2 &&
						this.logMode.info
					) {
						this.logger.info(`Copied color value: ${colorValue}`);
					}

					setTimeout(
						() => tooltipElement.classList.remove('show'),
						data.consts.timeouts.tooltip || 1000
					);
				})
				.catch(err => {
					if (this.logMode.errors)
						this.logger.error(`Error copying to clipboard: ${err}`);
				});
		} catch (error) {
			if (this.logMode.errors)
				this.logger.error(`Failed to copy to clipboard: ${error}`);
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
			colorBox.style.backgroundColor = item.cssStrings.hexCSSString;

			row.appendChild(colorBox);
			row.appendChild(cell);
			table.appendChild(row);
		});

		fragment.appendChild(table);

		return fragment as unknown as HTMLElement;
	}

	public desaturateColor(selectedColor: number): void {
		try {
			this.getElementsForSelectedColor(selectedColor);
		} catch (error) {
			if (this.logMode.errors)
				this.logger.error(`Failed to desaturate color: ${error}`);
		}
	}

	public getElementsForSelectedColor(selectedColor: number): {
		selectedColorTextOutputBox: HTMLElement | null;
		selectedColorBox: HTMLElement | null;
		selectedColorStripe: HTMLElement | null;
	} {
		const selectedColorBox = document.getElementById(
			`color-box-${selectedColor}`
		);

		if (!selectedColorBox) {
			if (this.logMode.warnings)
				this.logger.warning(
					`Element not found for color ${selectedColor}`
				);

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

	public async handleExport(format: 'css' | 'json' | 'xml'): Promise<void> {
		try {
			const palette = await this.getCurrentPalette();

			if (!palette) {
				this.logger.error('No palette available for export');

				return;
			}

			switch (format) {
				case 'css':
					this.io.exportPalette(palette, format);
					break;
				case 'json':
					this.io.exportPalette(palette, format);
					break;
				case 'xml':
					this.io.exportPalette(palette, format);
					break;
				default:
					throw new Error(`Unsupported export format: ${format}`);
			}
		} catch (error) {
			if (this.logMode.errors && this.logMode.verbosity > 1)
				this.logger.error(`Failed to export palette: ${error}`);
		}
	}

	public async handleImport(
		file: File,
		format: 'JSON' | 'XML' | 'CSS'
	): Promise<void> {
		try {
			const data = await this.dom.fileUtils.readFile(file);

			let palette: Palette | null = null;

			switch (format) {
				case 'JSON':
					palette = await this.io.deserialize.fromJSON(data);
					if (!palette) {
						if (this.logMode.errors && this.logMode.verbosity > 1) {
							this.logger.error(
								'Failed to deserialize JSON data'
							);
						}
						return;
					}
					break;
				case 'XML':
					palette = (await this.io.deserialize.fromXML(data)) || null;
					break;
				case 'CSS':
					palette = (await this.io.deserialize.fromCSS(data)) || null;
					break;
				default:
					throw new Error(`Unsupported format: ${format}`);
			}

			if (!palette) {
				if (this.logMode.errors && this.logMode.verbosity > 1) {
					this.logger.error(`Failed to deserialize ${format} data`);
				}
				return;
			}

			this.addPaletteToHistory(palette);

			if (this.logMode.info && this.logMode.verbosity > 1) {
				this.logger.info(
					`Successfully imported palette in ${format} format.`
				);
			}
		} catch (error) {
			this.logger.error(`Failed to import file: ${error}`);
		}
	}

	public pullParamsFromUI(): {
		paletteType: number;
		numBoxes: number;
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	} {
		try {
			const paletteTypeOptionsElement =
				data.consts.dom.elements.paletteTypeOptions;
			const numBoxesElement =
				data.consts.dom.elements.paletteNumberOptions;
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
				numBoxes: numBoxesElement
					? parseInt(numBoxesElement.value, 10)
					: 0,
				enableAlpha: enableAlphaCheckbox?.checked || false,
				limitDarkness: limitDarknessCheckbox?.checked || false,
				limitGrayness: limitGraynessCheckbox?.checked || false,
				limitLightness: limitLightnessCheckbox?.checked || false
			};
		} catch (error) {
			if (this.logMode.errors)
				this.logger.error(
					`Failed to pull parameters from UI: ${error}`
				);

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

	public async renderPalette(tableId: string): Promise<void | null> {
		if (!this.getStoredPalette) {
			throw new Error('Palette fetching function has not been set.');
		}

		return this.errorUtils.handleAsync(async () => {
			const storedPalette = await this.getStoredPalette!(tableId);
			const paletteRow = document.getElementById('palette-row');

			if (!storedPalette)
				throw new Error(`Palette ${tableId} not found.`);
			if (!paletteRow) throw new Error('Palette row element not found.');

			paletteRow.innerHTML = '';

			const tableElement = this.createPaletteTable(storedPalette);
			paletteRow.appendChild(tableElement);

			if (!this.mode.quiet) log.info(`Rendered palette ${tableId}.`);
		}, 'UIManager.renderPalette(): Error rendering palette');
	}

	public saturateColor(selectedColor: number): void {
		try {
			this.getElementsForSelectedColor(selectedColor);
			// *DEV-NOTE* unfinished function
		} catch (error) {
			if (this.logMode.errors)
				log.error(`Failed to saturate color: ${error}`);
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
}
