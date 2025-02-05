// File: app/ui/services/EventServce.js

import { DOMDataInterface, HSL, Palette } from '../../../types/index.js';
import { domData } from '../../../data/dom.js';

export class DOMService {
	private domData: DOMDataInterface = domData;

	public updateHistoryUI(history: Palette[]): void {
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
					await IDBManager.getInstance().removePaletteFromHistory(
						palette.id
					);
					this.updateHistoryUI(
						await IDBManager.getInstance().getPaletteHistory()
					);
				});

			historyList.appendChild(entry);
		});
	}

	public updateColorBox(color: HSL, boxId: string): void {
		const colorBox = document.getElementById(boxId);
		if (colorBox) {
			colorBox.style.backgroundColor = this.colorToCSS(color);
		}
	}

	private colorToCSS(color: HSL): string {
		return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
	}
}
