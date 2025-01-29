// File: types/dom.js

export interface DOMFn_MasterInterface {
	events: {
		addEventListener<K extends keyof HTMLElementEventMap>(
			id: string,
			eventType: K,
			callback: (ev: HTMLElementEventMap[K]) => void
		): void;
		handlePaletteGen: () => void;
		initializeEventListeners(): void;
	};
	fileUtils: {
		download(data: string, filename: string, type: string): void;
		readFile(file: File): Promise<string>;
	};
	parse: {
		checkbox(id: string): boolean | void;
		paletteExportFormat(): string | void;
	};
	validate: {
		elements(): void;
	};
}

export interface MakePaletteBox {
	colorStripe: HTMLDivElement;
	paletteBoxCount: number;
}
