// File: dom/events/UIEventsService.ts

import {
	DOMElements,
	Helpers,
	Services,
	UIEventsContract,
	Utilities
} from '../../types/index.js';
import { DOMStore } from '../DOMStore.js';
import { EventManager } from './EventManager.js';
import { PaletteRendererService } from '../PaletteRendererService.js';
import { domIndex } from '../../config/index.js';

const caller = 'UIEventsService';
const classes = domIndex.classes;

export class UIEventsService implements UIEventsContract {
	static #instance: UIEventsService | null = null;

	#domStore: DOMStore;
	#elements: DOMElements;
	#paletteRenderer: PaletteRendererService;

	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];
	#utils: Utilities;

	private constructor(
		domStore: DOMStore,
		helpers: Helpers,
		paletteRenderer: PaletteRendererService,
		services: Services,
		utils: Utilities
	) {
		try {
			services.log.info(
				`Constructing UIEvents instance`,
				`${caller} constructor`
			);

			this.#domStore = domStore;
			this.#errors = services.errors;
			this.#helpers = helpers;
			this.#log = services.log;
			this.#utils = utils;

			const validatedElements = this.#domStore.getElements();

			if (!validatedElements) {
				throw new Error(
					`[${caller} constructor]: Critical UI elements not found. Application cannot start!`
				);
			}

			this.#elements = validatedElements;
			this.#paletteRenderer = paletteRenderer;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(
		domStore: DOMStore,
		helpers: Helpers,
		paletteRenderer: PaletteRendererService,
		services: Services,
		utils: Utilities
	): UIEventsService {
		return services.errors.handleSync(() => {
			if (!UIEventsService.#instance) {
				services.log.debug(
					'No UIEvents instance exists yet. Creating UIEvents instance',
					`${caller}.getInstance`
				);

				UIEventsService.#instance = new UIEventsService(
					domStore,
					helpers,
					paletteRenderer,
					services,
					utils
				);
			}

			return UIEventsService.#instance;
		}, `[${caller}.getInstance]: Failed to get UIEvents instance.`);
	}

	init(): void {
		return this.#errors.handleSync(() => {
			EventManager.add(document, 'click', event => {
				const target = event.target as HTMLElement;

				// open modal
				if (target.matches(classes.modalTrigger)) {
					const modal = this.#helpers.dom.getElement(target.dataset.modalID!);

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
						.getAllElements(`.${classes.modal}`)
						.forEach(modal => modal.classList.add(classes.hidden));
				}
			}) as EventListener);
		}, `[${caller}]: Failed to initialize UI events.`);
	}

	initButtons(): void {
		return this.#errors.handleSync(() => {
			const addButtonEvent = (
				button: HTMLElement | null,
				logMessage: string,
				action?: () => void
			) => {
				if (!button) return;

				EventManager.add(button, 'click', (e: Event) => {
					e.preventDefault();

					this.#log.debug(logMessage, `${caller}.initButtons`);

					action?.();
				});
			};

			addButtonEvent(
				this.#elements.btns.desaturate,
				'Desaturate button clicked',
				() => {
					this.#log.warn(
						'Desaturation logic not implemented!',
						`${caller}.initButtons`
					);
				}
			);

			addButtonEvent(
				this.#elements.btns.export,
				'Export button clicked',
				() => {
					this.#log.warn(
						'Export logic not implemented!',
						`${caller}.initButtons`
					);
				}
			);

			addButtonEvent(
				this.#elements.btns.generate,
				'Generate button clicked',
				() => {
					this.#paletteRenderer.renderNewPalette();
					this.#log.debug(
						'New palette generated and rendered',
						`${caller}.initButtons`
					);
				}
			);

			EventManager.add(document, 'click', this.handleWindowClick.bind(this));
		}, `[${caller}]: Failed to initialize buttons.`);
	}

	attachTooltipListener(id: string, tooltipText: string): void {
		return this.#errors.handleSync(() => {
			const element = this.#helpers.dom.getElement(id);

			if (!element) return;

			EventManager.add(element, 'mouseenter', () =>
				this.#utils.dom.createTooltip(element, tooltipText)
			);
			EventManager.add(element, 'mouseleave', () =>
				this.#utils.dom.removeTooltip(element)
			);
		}, `[${caller}]: Failed to attach tooltip listener for ${id}.`);
	}

	private handleWindowClick(event: Event): void {
		return this.#errors.handleSync(() => {
			const target = event.target as HTMLElement;

			if (target === this.#elements.divs.helpMenu) {
				this.#elements.divs.helpMenu.classList.add(classes.hidden);
			}

			if (target === this.#elements.divs.historyMenu) {
				this.#elements.divs.historyMenu.classList.add(classes.hidden);
			}
		}, `[${caller}]: Failed to handle window click.`);
	}
}
