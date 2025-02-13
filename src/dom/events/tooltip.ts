// File: dom/events/tooltip.js

import {
	CoreUtilsInterface,
	CreateTooltipElementFn
} from '../../types/index.js';
import { constsData as consts } from '../../data/consts.js';

const timeouts = consts.timeouts;

export function attachTooltipListener(
	id: string,
	tooltipText: string,
	coreUtils: CoreUtilsInterface,
	createTooltipElement: CreateTooltipElementFn
): void {
	const element = coreUtils.getElement(id);

	if (!element) return;

	let tooltip: HTMLElement | null = null;

	element.addEventListener('mouseenter', (e: MouseEvent) => {
		tooltip = createTooltipElement();
		tooltip.textContent = tooltipText;
		tooltip.style.position = 'absolute';
		tooltip.style.zIndex = '1000';
		tooltip.style.pointerEvents = 'none';
		tooltip.style.opacity = '0';
		tooltip.style.transition = 'opacity 0.2s ease-in-out';

		document.body.appendChild(tooltip);
		const { clientX: mouseX, clientY: mouseY } = e;
		tooltip.style.left = `${mouseX + 10}px`;
		tooltip.style.top = `${mouseY + 10}px`;
		setTimeout(() => {
			if (tooltip) tooltip.style.opacity = '1';
		}, timeouts.tooltip);
	});

	element.addEventListener('mousemove', (e: MouseEvent) => {
		if (tooltip) {
			tooltip.style.left = `${e.clientX + 10}px`;
			tooltip.style.top = `${e.clientY + 10}px`;
		}
	});

	element.addEventListener('mouseleave', () => {
		if (tooltip) {
			tooltip.style.opacity = '0';
			setTimeout(() => {
				if (tooltip && tooltip.parentElement) {
					tooltip.parentElement.removeChild(tooltip);
				}
			}, timeouts.tooltip);
		}
	});
}
