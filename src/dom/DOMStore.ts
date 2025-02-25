// File: common/services/DOMStore.ts

import {
	DOMElements,
	DOMStoreContract,
	Helpers,
	Services,
	UnvalidatedDOMElements
} from '../types/index.js';
import { domIndex } from '../config/index.js';

const caller = 'DOMStore';
const ids = domIndex.ids;

export class DOMStore implements DOMStoreContract {
	static #instance: DOMStore;

	#elements: DOMElements | null = null;

	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];

	private constructor(
		errors: Services['errors'],
		helpers: Helpers,
		log: Services['log']
	) {
		try {
			log.info(`Constructing DOMStore instance`, `${caller} constructor`);

			this.#errors = errors;
			this.#log = log;
			this.#helpers = helpers;

			this.#validateAndGetDOMElements();
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(
		errors: Services['errors'],
		helpers: Helpers,
		log: Services['log']
	): DOMStore {
		return errors.handleSync(
			() => {
				if (!DOMStore.#instance) {
					log.debug(
						'No DOMStore instance exists yet. Creating DOMStore instance',
						`${caller}.getInstance`
					);

					DOMStore.#instance = new DOMStore(errors, helpers, log);
				}

				return DOMStore.#instance;
			},
			`[${caller}]: Error getting DOMStore instance.`,
			{ fallback: new DOMStore(errors, helpers, log) }
		);
	}

	getElement<K extends keyof DOMElements, E extends keyof DOMElements[K]>(
		category: K,
		key: E
	): DOMElements[K][E] {
		return this.#errors.handleSync(() => {
			const element = this.#elements?.[category]?.[key];

			if (!element) {
				this.#log.error(
					`Element ${category}.${String(key)} is not validated or missing.`,
					`${caller}.getElement`
				);

				throw new Error(
					`[${caller}]: Element ${category}.${String(key)} not found`
				);
			}

			return element;
		}, `[${caller}]: Error getting DOM element.`);
	}

	getElements(): DOMElements {
		return this.#errors.handleSync(() => {
			if (!this.#elements) {
				this.#log.warn(
					'DOM elements are not validated yet.',
					`${caller}.getElements`
				);

				throw new Error(
					`[${caller}]: DOM elements are not yet validated.`
				);
			}

			return this.#elements;
		}, `[${caller}]: Error getting DOM elements.`);
	}

	setElements(elements: DOMElements): void {
		return this.#errors.handleSync(() => {
			this.#elements = elements;

			this.#log.debug(
				'DOM elements set successfully',
				`${caller}.setElements`
			);
		}, `[${caller}]: Unable to set DOM elements.`);
	}

	#validateAndGetDOMElements(): void {
		const missingElements: string[] = [];

		return this.#errors.handleSync(
			() => {
				const elementTypeMap: Record<
					keyof UnvalidatedDOMElements,
					keyof HTMLElementTagNameMap
				> = {
					btns: 'button',
					divs: 'div',
					inputs: 'input'
				};

				const elements: Partial<DOMElements> = {
					btns: {} as DOMElements['btns'],
					divs: {} as DOMElements['divs'],
					inputs: {} as DOMElements['inputs']
				};

				for (const [category, elementsGroup] of Object.entries(ids)) {
					const tagName =
						elementTypeMap[
							category as keyof UnvalidatedDOMElements
						];
					if (!tagName) {
						this.#log.warn(
							`No element type mapping for category "${category}". Skipping...`,
							`${caller}.#validateAndGetDOMElements`
						);
						continue;
					}

					for (const [key, id] of Object.entries(elementsGroup)) {
						const element =
							this.#helpers.dom.getElement<
								HTMLElementTagNameMap[typeof tagName]
							>(id);

						if (!element) {
							this.#log.warn(
								`Element with ID "${id}" not found.`,
								`${caller}.#validateAndGetDOMElements`
							);

							missingElements.push(id);
						} else {
							(
								elements[
									category as keyof DOMElements
								] as Record<string, HTMLElement>
							)[key] = element;
						}
					}
				}

				if (missingElements.length > 0) {
					this.#log.warn(
						`Missing elements: ${missingElements.join(', ')}`,
						`${caller}.#validateAndGetDOMElements`
					);
					throw new Error(
						`[${caller}]: Some DOM elements are missing. Validation failed.`
					);
				}

				this.#elements = elements as DOMElements;

				this.#log.info(
					'All static elements are present! 🏳️‍⚧️ 🩷 🏳️‍⚧️',
					`[${caller}.#validateAndGetDOMElements]`
				);
			},
			`[${caller}]: Unable to validate DOM elements.`,
			{ context: { missingElements } }
		);
	}
}
