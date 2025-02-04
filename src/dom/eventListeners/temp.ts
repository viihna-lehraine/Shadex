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

	if (!mode.quiet && logMode.verbosity > 3)
		logger.info('Toast message added', `${thisModule} > ${thisMethod}`);

	setTimeout(() => {
		toast.classList.add('fade-out');

		if (!mode.quiet && logMode.verbosity > 3)
			logger.info(
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

		if (!mode.quiet && logMode.verbosity > 3)
			logger.info(
				'showTooltip executed',
				`${thisModule} > ${thisMethod}`
			);
	} catch (error) {
		if (logMode.error)
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
