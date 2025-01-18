// File: src/index/app/dom.js

export interface DOMEventsInterface {
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void
	): void;
	handlePaletteGen: () => void;
	initializeEventListeners(): void;
}

export interface DOMFileUtilsFnInterface {
	download(data: string, filename: string, type: string): void;
	readFile(file: File): Promise<string>;
}

export interface DOMParseFnInterface {
	checkbox(id: string): boolean | void;
	paletteExportFormat(): string | void;
}

export interface DOMValidateFnInterface {
	elements(): void;
}

export interface DOMFnEventsInterface {
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void
	): void;
	handlePaletteGen: () => void;
	initializeEventListeners(): void;
}

export interface DOMFnMasterInterface {
	events: DOMFnEventsInterface;
	fileUtils: DOMFileUtilsFnInterface;
	parse: DOMParseFnInterface;
	validate: DOMValidateFnInterface;
}
