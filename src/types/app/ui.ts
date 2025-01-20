// File: src/types/app/ui.ts

export interface UIFnBaseInterface {
	enforceSwatchRules(minimumSwatches: number, maximumSwatches?: number): void;
}

export interface UIFnMasterInterface {
	enforceSwatchRules(minimumSwatches: number, maximumSwatches?: number): void;
}
