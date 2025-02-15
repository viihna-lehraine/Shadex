// File: events/UIEvents.js

import { ServicesInterface, UtilitiesInterface } from '../types/index.js';
import { EventManager } from './EventManager.js';
import { constsData as consts } from '../data/consts.js';
import { domData } from '../data/dom.js';

const btns = domData.elements.btns;
const classes = domData.classes;
const elements = domData.elements;
const timeouts = consts.timeouts;

export class UIEvents {
	private log: ServicesInterface['app']['log'];

	constructor(
		private services: ServicesInterface,
		private utils: UtilitiesInterface
	) {
		this.services = services;
		this.utils = utils;
		this.log = this.services.app.log;
	}

	public init() {
		EventManager.add(document, 'click', event => {
			const target = event.target as HTMLElement;

			// open modal
			if (target.matches(domData.classes.modalTrigger)) {
				const modal = this.utils.core.getElement(
					target.dataset.modalID!
				);
				modal?.classList.remove(domData.classes.hidden);
			}

			// close modal when clicking outside
			if (target.matches(domData.classes.modal)) {
				target.classList.add(domData.classes.hidden);
			}
		});

		// handle 'Esc' key press to close modals
		EventManager.add(document, 'keydown', ((event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				const openModals = this.utils.core.getAllElements(
					domData.classes.modal
				);
				openModals.forEach(modal =>
					modal.classList.add(domData.classes.hidden)
				);
			}
		}) as EventListener);
	}

	public initButtons(): void {
		// desaturate button (Placeholder logic)
		EventManager.add(btns.desaturate!, 'click', (e: Event) => {
			e.preventDefault();
			this.log(
				'debug',
				'Desaturate button clicked',
				'UIEvents.initButtons()',
				5
			);
			this.log(
				'debug',
				'Desaturation logic not implemented!',
				'UIEvents.initButtons()',
				2
			);
		});

		// export button (Placeholder logic)
		EventManager.add(btns.export!, 'click', (e: Event) => {
			e.preventDefault();
			this.log(
				'debug',
				'Export button clicked',
				'UIEvents.initButtons()',
				5
			);
			this.log(
				'debug',
				'Export logic not implemented!',
				'UIEvents.initButtons()',
				2
			);
		});

		// generate button (Placeholder logic)
		EventManager.add(btns.generate!, 'click', (e: Event) => {
			e.preventDefault();
			this.log(
				'debug',
				'Generate button clicked',
				'UIEvents.initButtons()',
				5
			);
			this.log(
				'debug',
				'Palette generation logic not implemented!',
				'UIEvents.initButtons()',
				2
			);
		});

		EventManager.add(document, 'click', this.handleWindowClick.bind(this));
	}

	public attachTooltipListener(id: string, tooltipText: string): void {
		const element = this.utils.core.getElement(id);
		if (!element) return;

		let tooltip: HTMLElement | null = null;

		element.addEventListener('mouseenter', (e: MouseEvent) => {
			tooltip = this.utils.dom.createTooltipElement(element, tooltipText);
			tooltip.textContent = tooltipText;
			tooltip.style.position = 'absolute';
			tooltip.style.zIndex = '1000';
			tooltip.style.pointerEvents = 'none';
			tooltip.style.opacity = '0';
			tooltip.style.transition = 'opacity 0.2s ease-in-out';

			document.body.appendChild(tooltip);
			tooltip.style.left = `${e.clientX + 10}px`;
			tooltip.style.top = `${e.clientY + 10}px`;

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
					tooltip?.remove();
				}, timeouts.tooltip);
			}
		});
	}

	private handleWindowClick(event: Event): void {
		const target = event.target as HTMLElement;

		if (target === elements.divs.helpMenu) {
			elements.divs.helpMenu.classList.add(classes.hidden);
		}

		if (target === elements.divs.historyMenu) {
			elements.divs.historyMenu.classList.add(classes.hidden);
		}
	}
}
