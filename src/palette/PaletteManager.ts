// File: palette/PaletteManager.js

import { StateManager } from '../state/StateManager.js';
import {
	Color,
	GenerateHuesFn,
	GeneratePaletteFn,
	HelpersInterface,
	HSL,
	PaletteItem,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { domData } from '../data/dom.js';

const ids = domData.ids;

export class PaletteManager {
	private generateHues: GenerateHuesFn;
	private generatePalette: GeneratePaletteFn;

	private helpers: HelpersInterface;
	private log: ServicesInterface['app']['log'];
	private services: ServicesInterface;
	private utils: UtilitiesInterface;

	constructor(
		private stateManager: StateManager,
		generateHues: GenerateHuesFn,
		generatePalette: GeneratePaletteFn,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	) {
		this.log = services.app.log;
		this.generateHues = generateHues;
		this.generatePalette = generatePalette;
		this.helpers = helpers;
		this.services = services;
		this.utils = utils;
	}

	public renderNewPalette(): void {
		const paletteContainer = this.utils.core.getElement<HTMLDivElement>(
			ids.divs.paletteContainer
		);

		if (!paletteContainer) {
			this.log(
				'error',
				`Palette container not found`,
				'PaletteManager.renderNewPalette()',
				1
			);
			return;
		}

		// Step 1: Retrieve palette generation options from the UI
		const options = this.utils.palette.getPaletteOptionsFromUI(
			this.services,
			this.utils
		);

		this.log(
			'debug',
			`Palette options: ${JSON.stringify(options)}`,
			'PaletteManager.renderNewPalette()',
			2
		);

		// Step 2: Store the old palette in history
		const oldPalette = this.stateManager.getState().paletteHistory.at(-1);
		if (oldPalette) this.stateManager.addPaletteToHistory(oldPalette);

		// Step 3: Clear the existing palette
		paletteContainer.innerHTML = '';

		// Step 4: Generate a new palette
		const newPalette = this.generatePalette({
			options,
			helpers: this.helpers,
			generateHues: this.generateHues,
			services: this.services,
			utils: this.utils
		});

		// Step 5: Create and append palette columns
		const columnWidth = 100 / newPalette.items.length;
		const validColorSpace = ['hex', 'hsl', 'rgb'].includes(
			this.stateManager.getState().preferences.colorSpace
		)
			? this.stateManager.getState().preferences.colorSpace
			: 'hex';

		const columns = newPalette.items.map((item, index) => {
			const columnID = index + 1;
			const colorValue =
				item.css[validColorSpace as keyof PaletteItem['css']] ||
				item.css.hex;

			const column = document.createElement('div');
			column.id = `palette-column-${columnID}`;
			column.className = 'palette-column';
			column.setAttribute('draggable', 'true');
			column.style.backgroundColor = colorValue;

			// add UI elements inside the column
			this.createPaletteColumnUI(column, columnID, colorValue);

			return {
				column,
				state: {
					id: columnID,
					isLocked: false,
					position: columnID,
					size: columnWidth
				}
			};
		});

		// Append new columns to the palette container
		columns.forEach(({ column }) => paletteContainer.appendChild(column));

		// Update state with new columns
		this.stateManager.updatePaletteColumns(
			columns.map(col => col.state),
			true,
			3
		);

		// // Attach event listeners
		// args.attachPaletteListeners();
	}

	public renderPaletteColor(
		color: HSL,
		colorBox: HTMLDivElement,
		colorBoxNumber: number
	): void {
		try {
			const formatColorString = this.utils.color.convertColorToCSS(color);
			colorBox.style.backgroundColor = formatColorString;

			const clonedColor: Color = this.utils.typeGuards.isColor(color)
				? this.utils.core.clone(color)
				: this.utils.color.convertColorStringToColor(color, this.utils);

			if (!this.utils.validate.colorValue(clonedColor, this.utils)) {
				this.log(
					'error',
					'Invalid color values.',
					'PaletteRenderer.renderPaletteColor()'
				);
				return;
			}

			const colorTextOutputBox = document.getElementById(
				`color-text-output-box-${colorBoxNumber}`
			) as HTMLInputElement | null;

			if (!colorTextOutputBox) return;

			const stringifiedColor =
				this.utils.color.convertColorToCSS(clonedColor);

			this.log(
				'debug',
				`Updating DOM color: ${stringifiedColor}`,
				'PaletteRenderer.renderPaletteColor()',
				2
			);

			colorTextOutputBox.value = stringifiedColor;
			colorTextOutputBox.setAttribute('data-format', color.format);
		} catch (error) {
			this.log(
				'error',
				`Failed to update color: ${error}`,
				'PaletteRenderer.renderPaletteColor()'
			);
		}
	}
	private createPaletteColumnUI(
		column: HTMLElement,
		columnID: number,
		colorValue: string
	): void {
		// create color display input
		const colorDisplay = document.createElement('input');
		colorDisplay.id = `color-display-${columnID}`;
		colorDisplay.className = 'color-display';
		colorDisplay.type = 'text';
		colorDisplay.value = colorValue;

		// create color input button
		const colorInputBtn = document.createElement('button');
		colorInputBtn.id = `color-input-btn-${columnID}`;
		colorInputBtn.className = 'color-input-btn';
		colorInputBtn.textContent = 'Change Color';

		// create lock button
		const lockBtn = document.createElement('button');
		lockBtn.id = `lock-btn-${columnID}`;
		lockBtn.className = 'lock-btn';
		lockBtn.textContent = 'Lock 🔒';

		// create drag handle button
		const dragHandle = document.createElement('button');
		dragHandle.id = `drag-handle-${columnID}`;
		dragHandle.className = 'drag-handle';
		dragHandle.textContent = 'Move ☰';

		// create resize handle
		const resizeHandle = document.createElement('div');
		resizeHandle.id = `resize-handle-${columnID}`;
		resizeHandle.className = 'resize-handle';

		// create color input modal
		const colorInputModal = document.createElement('div');
		colorInputModal.id = `color-input-modal-${columnID}`;
		colorInputModal.className = 'color-input-modal hidden';

		// create color input inside the modal
		const colorInput = document.createElement('input');
		colorInput.id = `color-input-${columnID}`;
		colorInput.className = 'color-input';
		colorInput.type = 'color';
		colorInput.value = colorValue;

		// append elements to their parent
		colorInputModal.appendChild(colorInput);
		column.appendChild(colorDisplay);
		column.appendChild(colorInputBtn);
		column.appendChild(lockBtn);
		column.appendChild(dragHandle);
		column.appendChild(resizeHandle);
		column.appendChild(colorInputModal);
	}
}
