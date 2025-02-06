// File: types/app/dom.js

import { ColorSpace } from '../index.js';
import type { UIManager } from '../../app/ui/UIManager.js';

export interface DOMFn_EventListenerFnInterface {
	initializeEventListeners(uiManager: UIManager): void;
	btn: {
		initialize: {
			conversionBtns: () => void;
			main: (uiManager: UIManager) => void;
		};
	};
	dragAndDrop: {
		attach(element: HTMLElement | null): void;
	};
	palette: {
		initialize: {
			liveColorRender(): void;
		};
	};
	temp: {
		showToast(message: string): void;
		showTooltip(tooltipElement: HTMLElement): void;
	};
	window: {
		initialize(): void;
	};
}

export interface DOMUtilsInterface {
	addConversionListener: (id: string, colorSpace: string) => void;
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void
	): void;
	downloadFile(data: string, filename: string, type: string): void;
	readFile(file: File): Promise<string>;
	switchColorSpace(targetFormat: ColorSpace): Promise<void>;
}

export interface PaletteBoxObject {
	colorStripe: HTMLDivElement;
	swatchCount: number;
}
