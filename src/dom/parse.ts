// File: dom/parse.js

import { DOMFn_MasterInterface } from '../types/index.js';
import { createLogger } from '../logger/index.js';
import { domData } from '../data/dom.js';
import { modeData as mode } from '../data/mode.js';

const ids = domData.ids.static;
const logMode = mode.logging;

const thisModule = 'dom/parse.js';

const logger = await createLogger();

function checkbox(id: string): boolean | void {
	const thisFunction = 'checkbox()';
	const checkbox = document.getElementById(id) as HTMLInputElement;

	if (!checkbox) {
		if (logMode.error && !mode.quiet) {
			logger.error(
				`Checkbox element ${id} not found`,
				`${thisModule} > ${thisFunction}`
			);
		}

		return;
	}

	if (!(checkbox instanceof HTMLInputElement)) {
		if (logMode.error && !mode.quiet) {
			logger.error(
				`Element ${id} is not a checkbox`,
				`${thisModule} > ${thisFunction}`
			);
		}

		return;
	}

	return checkbox ? checkbox.checked : undefined;
}

function paletteExportFormat(): string | void {
	const thisFunction = 'paletteExportFormat()';
	const formatSelectionMenu = document.getElementById(
		ids.selects.exportFormatOption
	) as HTMLSelectElement;

	if (!formatSelectionMenu) {
		if (logMode.error && !mode.quiet)
			logger.error(
				'Export format selection dropdown not found',
				`${thisModule} > ${thisFunction}`
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
				`${thisModule} > ${thisFunction}`
			);

		return;
	} else {
		return selectedFormat;
	}
}

export const parse: DOMFn_MasterInterface['parse'] = {
	checkbox,
	paletteExportFormat
};
