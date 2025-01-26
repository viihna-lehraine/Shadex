// File: src/dom/parse.ts

import { DOM_FunctionsMasterInterface } from '../types/index.js';
import { consts, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';

const logger = await createLogger();

const domIDs = consts.dom.ids;
const logMode = mode.logging;

function checkbox(id: string): boolean | void {
	const checkbox = document.getElementById(id) as HTMLInputElement;

	if (!checkbox) {
		if (logMode.error && !mode.quiet) {
			logger.error(
				`Checkbox element ${id} not found`,
				'dom > parse > checkbox()'
			);
		}

		return;
	}

	if (!(checkbox instanceof HTMLInputElement)) {
		if (logMode.error && !mode.quiet) {
			logger.error(
				`Element ${id} is not a checkbox`,
				'dom > parse > checkbox()'
			);
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
		if (logMode.error && !mode.quiet)
			logger.error(
				'Export format selection dropdown not found',
				'dom > parse > paletteExportFormat()'
			);
	}

	const selectedFormat = formatSelectionMenu.value;

	if (
		selectedFormat !== 'CSS' &&
		selectedFormat !== 'JSON' &&
		selectedFormat !== 'XML'
	) {
		if (logMode.error && !mode.quiet)
			logger.error(
				'Invalid export format selected',
				'dom > parse > paletteExportFormat()'
			);

		return;
	} else {
		return selectedFormat;
	}
}

export const parse: DOM_FunctionsMasterInterface['parse'] = {
	checkbox,
	paletteExportFormat
};
