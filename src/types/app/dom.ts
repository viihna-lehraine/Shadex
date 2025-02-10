// File: types/app/dom.js

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

export interface PaletteBoxObject {
	colorStripe: HTMLDivElement;
	swatchCount: number;
}
