// File: app/ui/services/subServices/DOMService.js

import {
	CommonFn_MasterInterface,
	DOMDataInterface,
	DOMSubService_ClassInterface,
	HSL,
	Palette
} from '../../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import { commonFn } from '../../../../common/index.js';
import { domData } from '../../../../data/dom.js';

export class DOMSubService implements DOMSubService_ClassInterface {
	private static instance: DOMSubService | null = null;

	private domData: DOMDataInterface;
	private coreConversionUtils: CommonFn_MasterInterface['core']['convert'];

	private idbManager!: IDBManager;

	constructor() {
		this.domData = domData;
		this.coreConversionUtils = commonFn.core.convert;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new DOMSubService();

			await this.instance.init();
		}

		return this.instance;
	}

	public getCheckboxState(id: string): boolean | void {
		const checkbox = document.getElementById(id) as HTMLInputElement | null;

		return checkbox ? checkbox.checked : undefined;
	}

	public getElement<T extends HTMLElement>(id: string): T | null {
		return document.getElementById(id) as T | null;
	}

	public getSelectedExportFormat(): string | void {
		const formatSelectionMenu = document.getElementById(
			this.domData.ids.static.selects.exportFormatOption
		) as HTMLSelectElement | null;

		if (!formatSelectionMenu) return;

		const selectedFormat = formatSelectionMenu.value;

		if (['CSS', 'JSON', 'XML'].includes(selectedFormat)) {
			return selectedFormat;
		}
		return undefined;
	}

	public async updateColorBox(color: HSL, boxId: string): Promise<void> {
		const colorBox = document.getElementById(boxId);

		if (colorBox) {
			colorBox.style.backgroundColor =
				await this.coreConversionUtils.colorToCSS(color);
		}
	}

	public updateHistory(history: Palette[]): void {
		const historyList = this.domData.elements.static.divs.paletteHistory;

		if (!historyList) return;

		historyList.innerHTML = '';

		history.forEach(palette => {
			const entry = document.createElement('div');

			entry.classList.add('history-item');
			entry.id = `palette_${palette.id}`;

			entry.innerHTML = `
				<p>Palette #${palette.metadata.name || palette.id}</p>
				<div class="color-preview">
					${palette.items.map(item => `<span class="color-box" style="background: ${item.colors.css.hex};"></span>`).join(' ')}
				</div>
				<button class="remove-history-item" data-id="${palette.id}-history-remove-btn">Remove</button>
			`;

			entry
				.querySelector('.remove-history-item')
				?.addEventListener('click', async () => {
					await this.idbManager.savePaletteHistory(
						history.filter(p => p.id !== palette.id)
					);

					this.updateHistory(
						await this.idbManager.getPaletteHistory()
					);
				});

			historyList.appendChild(entry);
		});
	}

	private async init(): Promise<void> {
		this.idbManager = await IDBManager.getInstance();
	}
}
