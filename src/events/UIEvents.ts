// File: events/UIEvents.js

import {
	DOMElements,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { EventManager } from './EventManager.js';
import { data } from '../data/index.js';

const classes = data.dom.classes;
const ids = data.dom.ids;

export class UIEvents {
	private log: ServicesInterface['log'];
	private elements: DOMElements;

	constructor(
		private services: ServicesInterface,
		private utils: UtilitiesInterface
	) {
		this.services = services;
		this.utils = utils;
		this.log = this.services.log;

		const validatedElements = this.utils.dom.getValidatedDOMElements(ids);
		if (!validatedElements) {
			throw new Error(
				`Critical UI elements not found. Application cannot start`
			);
		}
		this.elements = validatedElements;
	}

	public init() {
		EventManager.add(document, 'click', event => {
			const target = event.target as HTMLElement;

			// open modal
			if (target.matches(classes.modalTrigger)) {
				const modal = this.utils.core.getElement(
					target.dataset.modalID!
				);
				modal?.classList.remove(classes.hidden);
			}

			// close modal when clicking outside
			if (target.matches(classes.modal)) {
				target.classList.add(classes.hidden);
			}
		});

		// handle 'Esc' key press to close modals
		EventManager.add(document, 'keydown', ((event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				const openModals = this.utils.core.getAllElements(
					classes.modal
				);
				openModals.forEach(modal =>
					modal.classList.add(classes.hidden)
				);
			}
		}) as EventListener);
	}

	public initButtons(): void {
		// desaturate button (Placeholder logic)
		EventManager.add(this.elements.btns.desaturate, 'click', (e: Event) => {
			e.preventDefault();
			this.log(
				'debug',
				'Desaturate button clicked',
				'UIEvents.initButtons',
				5
			);
			this.log(
				'debug',
				'Desaturation logic not implemented!',
				'UIEvents.initButtons',
				2
			);
		});

		// export button (Placeholder logic)
		EventManager.add(this.elements.btns.export, 'click', (e: Event) => {
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
		EventManager.add(this.elements.btns.generate, 'click', (e: Event) => {
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

		EventManager.add(element, 'mouseenter', () => {
			this.utils.dom.createTooltip(element, tooltipText);
		});

		EventManager.add(element, 'mouseleave', () => {
			this.utils.dom.removeTooltip(element);
		});
	}

	private handleWindowClick(event: Event): void {
		const target = event.target as HTMLElement;

		if (target === this.elements.divs.helpMenu) {
			this.elements.divs.helpMenu.classList.add(classes.hidden);
		}

		if (target === this.elements.divs.historyMenu) {
			this.elements.divs.historyMenu.classList.add(classes.hidden);
		}
	}
}
