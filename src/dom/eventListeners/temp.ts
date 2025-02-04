// File: dom/eventListeners/temp.js

import { createLogger } from '../../logger/factory.js';
import { constsData as consts } from '../../data/consts.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;
const timeouts = consts.timeouts;

const thisModule = 'dom/eventListeners/groups/temp.js';

const logger = await createLogger();

export function showToast(message: string): void {
	const thisMethod = 'showToast()';
	const toast = document.createElement('div');

	toast.className = 'toast-message';

	toast.textContent = message;

	document.body.appendChild(toast);

	if (logMode.debug && logMode.verbosity >= 4)
		logger.debug('Toast message added', `${thisModule} > ${thisMethod}`);

	setTimeout(() => {
		toast.classList.add('fade-out');

		if (logMode.debug && logMode.verbosity >= 4)
			logger.debug(
				'Toast message faded out',
				`${thisModule} > ${thisMethod}`
			);

		toast.addEventListener('transitioned', () => toast.remove());
	}, timeouts.toast || 3000);
}

export function showTooltip(tooltipElement: HTMLElement): void {
	const thisMethod = 'showTooltip()';

	try {
		const tooltip =
			tooltipElement.querySelector<HTMLElement>('.tooltiptext');

		if (tooltip) {
			tooltip.style.visibility = 'visible';
			tooltip.style.opacity = '1';
			setTimeout(() => {
				tooltip.style.visibility = 'hidden';
				tooltip.style.opacity = '0';
			}, consts.timeouts.tooltip || 1000);
		}

		if (logMode.debug && logMode.verbosity >= 4)
			logger.info(
				'showTooltip executed',
				`${thisModule} > ${thisMethod}`
			);
	} catch (error) {
		if (logMode.error && logMode.verbosity >= 4)
			logger.error(
				`Failed to execute showTooltip: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
	}
}

export const tempListeners = {
	showToast,
	showTooltip
};
