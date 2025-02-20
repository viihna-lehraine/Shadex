// File: events/UIEvents.js

import { DOMElements, Helpers, Services, Utilities } from '../types/index.js';
import { EventManager } from './EventManager.js';
import { PaletteManager } from '../palette/PaletteManager.js';
import { domIndex } from '../config/index.js';

const classes = domIndex.classes;

export class UIEvents {
	#domStore: Services['domStore'];
	#elements: DOMElements;
	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];
	#utils: Utilities;

	constructor(
		helpers: Helpers,
		private paletteManager: PaletteManager,
		private services: Services,
		utils: Utilities
	) {
		this.services = services;
		this.#domStore = services.domStore;
		this.#errors = services.errors;
		this.#helpers = helpers;
		this.#log = this.services.log;
		this.paletteManager = paletteManager;
		this.#utils = utils;

		const validatedElements = this.#domStore.getElements();
		if (!validatedElements) {
			throw new Error(
				`Critical UI elements not found. Application cannot start`
			);
		}
		this.#elements = validatedElements;
	}

	init(): void {
		this.#errors.handleSync(() => {
			EventManager.add(document, 'click', event => {
				const target = event.target as HTMLElement;

				// open modal
				if (target.matches(classes.modalTrigger)) {
					const modal = this.#helpers.dom.getElement(
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
					this.#helpers.dom
						.getAllElements(classes.modal)
						.forEach(modal => modal.classList.add(classes.hidden));
				}
			}) as EventListener);
		}, 'Failed to initialize UI events');
	}

	initButtons(): void {
		this.#errors.handleSync(() => {
			const addButtonEvent = (
				button: HTMLElement | null,
				logMessage: string,
				action?: () => void
			) => {
				if (!button) return;

				EventManager.add(button, 'click', (e: Event) => {
					e.preventDefault();
					this.#log(logMessage, 'debug');
					action?.();
				});
			};

			addButtonEvent(
				this.#elements.btns.desaturate,
				'Desaturate button clicked',
				() => {
					this.#log('Desaturation logic not implemented!', 'warn');
				}
			);

			addButtonEvent(
				this.#elements.btns.export,
				'Export button clicked',
				() => {
					this.#log('Export logic not implemented!', 'debug');
				}
			);

			addButtonEvent(
				this.#elements.btns.generate,
				'Generate button clicked',
				() => {
					this.paletteManager.renderNewPalette();
					this.#log('New palette generated and rendered', 'debug');
				}
			);

			EventManager.add(
				document,
				'click',
				this.handleWindowClick.bind(this)
			);
		}, 'Failed to initialize buttons');
	}

	attachTooltipListener(id: string, tooltipText: string): void {
		this.#errors.handleSync(() => {
			const element = this.#helpers.dom.getElement(id);
			if (!element) return;

			EventManager.add(element, 'mouseenter', () =>
				this.#utils.dom.createTooltip(element, tooltipText)
			);
			EventManager.add(element, 'mouseleave', () =>
				this.#utils.dom.removeTooltip(element)
			);
		}, `Failed to attach tooltip listener for ${id}`);
	}

	private handleWindowClick(event: Event): void {
		this.#errors.handleSync(() => {
			const target = event.target as HTMLElement;

			if (target === this.#elements.divs.helpMenu) {
				this.#elements.divs.helpMenu.classList.add(classes.hidden);
			}

			if (target === this.#elements.divs.historyMenu) {
				this.#elements.divs.historyMenu.classList.add(classes.hidden);
			}
		}, 'Failed to handle window click');
	}
}
