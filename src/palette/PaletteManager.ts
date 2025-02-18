// File: palette/PaletteManager.js

import { StateManager } from '../state/StateManager.js';
import {
	Color,
	CommonFunctionsInterface,
	GenerateHuesFnGroup,
	GeneratePaletteFn,
	GeneratePaletteFnGroup,
	HSL,
	PaletteItem,
	PaletteManagerClassInterface,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { data } from '../data/index.js';

const ids = data.dom.ids;

export class PaletteManager implements PaletteManagerClassInterface {
	private generateHues: GenerateHuesFnGroup;
	private generatePaletteFns: GeneratePaletteFnGroup;
	private generatePalette: GeneratePaletteFn;

	private common: CommonFunctionsInterface;
	private log: ServicesInterface['log'];

	private utils: UtilitiesInterface;

	constructor(
		private stateManager: StateManager,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup,
		generatePaletteFns: GeneratePaletteFnGroup,
		generatePalette: GeneratePaletteFn
	) {
		console.log(`[PaletteManager.constructor] Entering constructor...`);
		console.log(
			'[PaletteManager.constructor] Argument 1 - stateManager',
			stateManager
		);
		console.log(
			`[PaletteManager.constructor] Argument 2 - Common Fn Group`,
			common
		);
		console.log(
			`[PaletteManager.constructor] Argument 3 - Generate Hues Fn Group`,
			generateHues
		);
		console.log(
			`[PaletteManager.constructor] Argument 4 - Generate Palette Fn Group`,
			generatePaletteFns
		);
		console.log(
			`[PaletteManager.constructor] Argument 5 - Generate Palette Fn`,
			generatePalette
		);

		this.log = common.services.log;
		this.generateHues = generateHues;
		this.generatePaletteFns = generatePaletteFns;
		this.generatePalette = generatePalette;
		this.common = common;
		this.utils = common.utils;

		this.log(
			'debug',
			'Completing initialization',
			'PaletteManager.constructor()',
			2
		);
	}

	public handleColumnResize(columnID: number, newSize: number): void {
		const currentState = this.stateManager.getState();
		const columns = currentState.paletteContainer.columns;

		// find colunmn
		const columnIndex = columns.findIndex(col => col.id === columnID);
		if (columnIndex === -1) {
			this.log(
				'warn',
				`Column with ID ${columnID} not found.`,
				'PaletteManager.handleColumnResize()'
			);
		}

		// ensure new size is within limits
		const minSize = data.config.ui.minColumnSize;
		const maxSize = data.config.ui.maxColumnSize;
		const adjustedSize = Math.max(minSize, Math.min(newSize, maxSize));

		// distribute size difference
		const sizeDiff = adjustedSize - columns[columnIndex].size;
		columns[columnIndex].size = adjustedSize;

		const unlockedColumns = columns.filter(
			(__, i) => i !== columnIndex && !columns[i].isLocked
		);
		const disributeAmount = sizeDiff / unlockedColumns.length;

		unlockedColumns.forEach(col => (col.size -= disributeAmount));

		// ensure total width is 100%
		const totalSize = columns.reduce((sum, col) => sum + col.size, 0);
		const correctionFactor = 100 / totalSize;
		columns.forEach(col => (col.size *= correctionFactor));

		// update state
		this.stateManager.updatePaletteColumns(columns, true, 2);
	}

	public handleColumnLock(columnID: number): void {
		const currentState = this.stateManager.getState();
		const columns = currentState.paletteContainer.columns;

		// find column by ID
		const columnIndex = columns.findIndex(col => col.id === columnID);

		if (columnIndex === -1) {
			this.log(
				'warn',
				`Column with ID ${columnID} not found.`,
				'PaletteManager.handleColumnLock()'
			);
			return;
		}

		// toggle lock state
		columns[columnIndex].isLocked = !columns[columnIndex].isLocked;

		this.stateManager.updatePaletteColumns(columns, true, 2);
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
		const options = this.utils.palette.getPaletteOptionsFromUI();

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
		const newPalette = this.generatePalette(
			options,
			this.common,
			this.generateHues,
			this.generatePaletteFns
		);

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
				: this.utils.color.convertColorStringToColor(color);

			if (!this.utils.validate.colorValue(clonedColor)) {
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

	public swapColumns(draggedID: number, targetID: number): void {
		const currentState = this.stateManager.getState();
		const columns = [...currentState.paletteContainer.columns];

		const draggedIndex = columns.findIndex(col => col.id === draggedID);
		const targetIndex = columns.findIndex(col => col.id === targetID);

		if (draggedIndex === -1 || targetIndex === -1) {
			this.log(
				'warn',
				`Failed to swap: Column ID ${draggedID} or ${targetID} not found.`,
				'PaletteManager.swapColumns()'
			);
			return;
		}

		// swap positions in the array
		[columns[draggedIndex].position, columns[targetIndex].position] = [
			columns[targetIndex].position,
			columns[draggedIndex].position
		];

		// sort the array based on the new positions
		columns.sort((a, b) => a.position - b.position);

		// update state with new column order
		this.stateManager.updatePaletteColumns(columns, true, 3);

		this.log(
			'debug',
			`Swapped columns ${draggedID} and ${targetID}. New order: ${columns.map(col => col.id).join(', ')}`,
			'PaletteManager.swapColumns()'
		);
	}
}
