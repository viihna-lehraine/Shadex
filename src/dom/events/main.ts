// File: dom/events/events.js

import { domData } from '../../data/dom.js';

const elements = domData.elements;

const divElements = elements.divs;

export function handleWindowClick(e: MouseEvent): void {
	const target = e.target as HTMLElement;

	if (target === divElements.helpMenu) {
		divElements.helpMenu!.classList.add('hidden');
	}
	if (target === divElements.historyMenu) {
		divElements.historyMenu!.classList.add('hidden');
	}
}

export function showToast(message: string): void {
	if (document.querySelector('.toast-message')) return;

	const toast = document.createElement('div');

	toast.className = 'toast-message';
	toast.textContent = message;
	document.body.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('fade-out');
		toast.addEventListener('transitioned', () => toast.remove());
	}, 3000);
}

export function showTooltip(tooltipElement: HTMLElement): void {
	const tooltip = tooltipElement.querySelector<HTMLElement>('.tooltiptext');

	if (tooltip) {
		tooltip.style.visibility = 'visible';
		tooltip.style.opacity = '1';

		setTimeout(() => {
			tooltip.style.visibility = 'hidden';
			tooltip.style.opacity = '0';
		}, 1000);
	}
}
