// File: events/UIEvents.js

import {
	DOMElements,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { EventManager } from './EventManager.js';
import { PaletteManager } from '../palette/PaletteManager.js';
import { data } from '../data/index.js';

const classes = data.dom.classes;
const ids = data.dom.ids;

export class UIEvents {
	private log: ServicesInterface['log'];
	private errors: ServicesInterface['errors'];
	private elements: DOMElements;

	constructor(
		private paletteManager: PaletteManager,
		private services: ServicesInterface,
		private utils: UtilitiesInterface
	) {
		this.services = services;
		this.errors = services.errors;
		this.utils = utils;
		this.log = this.services.log;
		this.paletteManager = paletteManager;

		const validatedElements = this.utils.dom.getValidatedDOMElements(ids);
		if (!validatedElements) {
			throw new Error(
				`Critical UI elements not found. Application cannot start`
			);
		}
		this.elements = validatedElements;
	}

	public init(): void {
		this.errors.handle(
			() => {
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
				EventManager.add(document, 'keydown', ((
					event: KeyboardEvent
				) => {
					if (event.key === 'Escape') {
						this.utils.core
							.getAllElements(classes.modal)
							.forEach(modal =>
								modal.classList.add(classes.hidden)
							);
					}
				}) as EventListener);
			},
			'Failed to initialize UI events',
			'UIEvents.init'
		);
	}

	public initButtons(): void {
		this.errors.handle(
			() => {
				const addButtonEvent = (
					button: HTMLElement | null,
					logMessage: string,
					action?: () => void
				) => {
					if (!button) return;

					EventManager.add(button, 'click', (e: Event) => {
						e.preventDefault();
						this.log(
							'debug',
							logMessage,
							'UIEvents.initButtons()',
							5
						);
						action?.();
					});
				};

				addButtonEvent(
					this.elements.btns.desaturate,
					'Desaturate button clicked',
					() => {
						this.log(
							'debug',
							'Desaturation logic not implemented!',
							'UIEvents.initButtons()',
							2
						);
					}
				);

				addButtonEvent(
					this.elements.btns.export,
					'Export button clicked',
					() => {
						this.log(
							'debug',
							'Export logic not implemented!',
							'UIEvents.initButtons()',
							2
						);
					}
				);

				addButtonEvent(
					this.elements.btns.generate,
					'Generate button clicked',
					() => {
						this.paletteManager.renderNewPalette();
						this.log(
							'debug',
							'New palette generated and rendered',
							'UIEvents.initButtons()',
							2
						);
					}
				);

				EventManager.add(
					document,
					'click',
					this.handleWindowClick.bind(this)
				);
			},
			'Failed to initialize buttons',
			'UIEvents.initButtons'
		);
	}

	public attachTooltipListener(id: string, tooltipText: string): void {
		this.errors.handle(
			() => {
				const element = this.utils.core.getElement(id);
				if (!element) return;

				EventManager.add(element, 'mouseenter', () =>
					this.utils.dom.createTooltip(element, tooltipText)
				);
				EventManager.add(element, 'mouseleave', () =>
					this.utils.dom.removeTooltip(element)
				);
			},
			`Failed to attach tooltip listener for ${id}`,
			'UIEvents.attachTooltipListener'
		);
	}

	private handleWindowClick(event: Event): void {
		this.errors.handle(
			() => {
				const target = event.target as HTMLElement;

				if (target === this.elements.divs.helpMenu) {
					this.elements.divs.helpMenu.classList.add(classes.hidden);
				}

				if (target === this.elements.divs.historyMenu) {
					this.elements.divs.historyMenu.classList.add(
						classes.hidden
					);
				}
			},
			'Failed to handle window click',
			'UIEvents.handleWindowClick'
		);
	}
}
