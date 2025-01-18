// File: src/dom/parse.ts

import { DOMParseFnInterface } from '../index/index.js';
import { data } from '../data/index.js';
import { log as logger } from '../classes/logger/index.js';

const domIDs = data.consts.dom.ids;
const logMode = data.mode.logging;
const mode = data.mode;

function checkbox(id: string): boolean | void {
	const checkbox = document.getElementById(id) as HTMLInputElement;

	if (!checkbox) {
		if (logMode.errors && !mode.quiet) {
			logger.error(`Checkbox element ${id} not found`);
		}

		return;
	}

	if (!(checkbox instanceof HTMLInputElement)) {
		if (logMode.errors && !mode.quiet) {
			logger.error(`Element ${id} is not a checkbox`);
		}

		return;
	}

	return checkbox ? checkbox.checked : undefined;
}

function paletteExportFormat(): string | void {
	const formatSelectionMenu = document.getElementById(
		domIDs.exportPaletteFormatOptions
	) as HTMLSelectElement;

	if (!formatSelectionMenu) {
		if (logMode.errors && !mode.quiet)
			logger.error('Export format selection dropdown not found');
	}

	const selectedFormat = formatSelectionMenu.value;

	if (
		selectedFormat !== 'CSS' &&
		selectedFormat !== 'JSON' &&
		selectedFormat !== 'XML'
	) {
		if (logMode.errors && !mode.quiet)
			logger.error('Invalid export format selected');

		return;
	} else {
		return selectedFormat;
	}
}

export const parse: DOMParseFnInterface = {
	checkbox,
	paletteExportFormat
};
