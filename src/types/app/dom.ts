// File: types/dom.js

import { ColorSpace, Hex, HSL, RGB } from '../index.js';
import type { UIManager } from '../../ui/UIManager.js';

export interface DOMFn_EventListenerFnInterface {
	initializeEventListeners(uiManager: UIManager): void;
	btn: {
		initialize: {
			conversionBtns: () => void;
			main: (uiManager: UIManager) => void;
		};
	};
	dad: {
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

export interface DOMFn_MasterInterface {
	initializeEventListeners(uiManager: UIManager): void;
	parse: {
		checkbox(id: string): boolean | void;
		colorInput(input: HTMLInputElement): Hex | HSL | RGB | null;
		paletteExportFormat(): string | void;
	};
	utils: {
		switchColorSpace(targetFormat: ColorSpace): Promise<void>;
		file: {
			download(data: string, filename: string, type: string): void;
			readFile(file: File): Promise<string>;
		};
		event: {
			addEventListener<K extends keyof HTMLElementEventMap>(
				id: string,
				eventType: K,
				callback: (ev: HTMLElementEventMap[K]) => void
			): void;
			addConversionListener: (id: string, colorSpace: string) => void;
		};
	};
	validate: {
		staticElements(): void;
	};
}

export interface PaletteBoxObject {
	colorStripe: HTMLDivElement;
	swatchCount: number;
}
