// File: src/classes/ui/UIManager.ts

import {
	CommonUtilsFnMasterInterface,
	DataInterface,
	HSL,
	Palette,
	StoredPalette,
	UIManagerInterface
} from '../../index/index.js';
import { core, helpers, utils } from '../../common/index.js';
import { data } from '../../data/index.js';
import { log } from '../logger/index.js';

export class UIManager implements UIManagerInterface {
	private static instanceCounter = 0; // static instance ID counter
	private static instances = new Map<number, UIManager>(); // instance registry
	private id: number; // unique instance ID

	private errorUtils: CommonUtilsFnMasterInterface['errors'];

	private elements: DataInterface['consts']['dom']['elements'];
	private paletteHistory: Palette[];

	private logMode: DataInterface['mode']['logging'] = data.mode.logging;
	private mode: DataInterface['mode'] = data.mode;

	private getStoredPalette?: (id: string) => Promise<StoredPalette | null>;

	constructor(elements: DataInterface['consts']['dom']['elements']) {
		this.id = UIManager.instanceCounter++;
		UIManager.instances.set(this.id, this);
		this.errorUtils = utils.errors;
		this.elements = elements;
		this.paletteHistory = [];

		if (!this.mode.quiet && this.logMode.debug)
			log.info(`UIManager instance created with ID ${this.id}`);
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
			if (logMode.errors)
				log.error(
					`Failed to apply custom color: ${error}. Returning randomly generated hex color`
				);

			return utils.random.hsl(false) as HSL;
		}
	}

	public applyFirstColorToUI(color: HSL): HSL {
		try {
			const colorBox1 = this.elements.colorBox1;

			if (!colorBox1) {
				if (this.logMode.errors) log.error('color-box-1 is null');

				return color;
			}

			const formatColorString = core.convert.toCSSColorString(color);

			if (!formatColorString) {
				if (this.logMode.errors)
					log.error('Unexpected or unsupported color format.');

				return color;
			}

			colorBox1.style.backgroundColor = formatColorString;

			utils.palette.populateOutputBox(color, 1);

			return color;
		} catch (error) {
			if (this.logMode.errors)
				log.error(`Failed to apply first color to UI: ${error}`);
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
						log.info(`Copied color value: ${colorValue}`);
					}

					setTimeout(
						() => tooltipElement.classList.remove('show'),
						data.consts.timeouts.tooltip || 1000
					);
				})
				.catch(err => {
					if (this.logMode.errors)
						log.error(`Error copying to clipboard: ${err}`);
				});
		} catch (error) {
			if (this.logMode.errors)
				log.error(`Failed to copy to clipboard: ${error}`);
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
				log.error(`Failed to desaturate color: ${error}`);
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
				log.warn(`Element not found for color ${selectedColor}`);

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

	public static getInstanceById(id: number): UIManager | undefined {
		return UIManager.instances.get(id);
	}

	public static deleteInstanceById(id: number): void {
		UIManager.instances.delete(id);
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
				log.error(`Failed to pull parameters from UI: ${error}`);

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

	public setGetStoredPalette(
		getter: (id: string) => Promise<StoredPalette | null>
	): void {
		this.getStoredPalette = getter;
	}

	/* PRIVATE METHODS */
}
