// File: app/ui/services/event/subServices/Window.js

import { DOMDataInterface } from '../../../../../types/index.js';
import { domData } from '../../../../../data/dom.js';

export class WindowEventSubService {
	private static instance: WindowEventSubService | null = null;

	private divElements: DOMDataInterface['elements']['static']['divs'];

	constructor() {
		this.divElements = domData.elements.static.divs;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new WindowEventSubService();
		}

		return this.instance;
	}

	public initialize(): void {
		window.addEventListener('click', e => this.handleWindowClick(e));
	}

	private handleWindowClick(e: MouseEvent): void {
		const target = e.target as HTMLElement;

		if (target === this.divElements.helpMenu) {
			this.divElements.helpMenu!.classList.add('hidden');
		}
		if (target === this.divElements.historyMenu) {
			this.divElements.historyMenu!.classList.add('hidden');
		}
	}
}
