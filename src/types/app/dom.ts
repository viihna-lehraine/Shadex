// File: src/types/dom.js

export interface DOM_FunctionsMasterInterface {
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
