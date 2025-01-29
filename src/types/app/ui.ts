// File: types/app/ui.js

export interface UIFn_BaseInterface {
	enforceSwatchRules(minimumSwatches: number, maximumSwatches?: number): void;
}

export interface UIFn_MasterInterface {
	enforceSwatchRules(minimumSwatches: number, maximumSwatches?: number): void;
}
