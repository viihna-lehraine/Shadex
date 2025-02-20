// File: common/services/DOMStore.ts

import {
	DOMElements,
	DOMStoreInterface,
	Helpers,
	Services,
	UnvalidatedDOMElements
} from '../../types/index.js';
import { domIndex } from '../../config/index.js';

const ids = domIndex.ids;

export class DOMStore implements DOMStoreInterface {
	static #instance: DOMStore;
	#elements: DOMElements | null = null;
	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];

	constructor(
		errors: Services['errors'],
		helpers: Helpers,
		log: Services['log']
	) {
		this.#errors = errors;
		this.#log = log;
		this.#helpers = helpers;
		this.#validateAndGetDOMElements();
	}

	static getInstance(
		errors: Services['errors'],
		helpers: Helpers,
		log: Services['log']
	): DOMStore {
		if (!DOMStore.#instance) {
			log(
				'No DOMStore instance exists yet. Creating DOMStore instance',
				'debug'
			);
			DOMStore.#instance = new DOMStore(errors, helpers, log);
		}

		log(
			'DOMStore instance already exists. Returning existing instance',
			'debug'
		);

		return DOMStore.#instance;
	}

	getElement<K extends keyof DOMElements, E extends keyof DOMElements[K]>(
		category: K,
		key: E
	): DOMElements[K][E] {
		const element = this.#elements?.[category]?.[key];

		if (!element) {
			this.#log(
				`Element ${category}.${String(key)} is not validated or missing.`,
				'error'
			);
			throw new Error(`Element ${category}.${String(key)} not found`);
		}
		return element;
	}

	getElements(): DOMElements {
		if (!this.#elements) {
			this.#log('DOM elements are not validated yet.', 'error');
			throw new Error('DOM elements not validated');
		}

		return this.#elements;
	}

	setElements(elements: DOMElements): void {
		this.#errors.handleSync(() => {
			this.#elements = elements;
		}, 'Unable to set DOM elements');
		this.#log('DOM elements set successfully', 'debug');
	}

	#validateAndGetDOMElements(): void {
		const missingElements: string[] = [];

		this.#errors.handleSync(
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
						this.#log(
							`No element type mapping for category "${category}". Skipping...`,
							'warn'
						);
						continue;
					}

					for (const [key, id] of Object.entries(elementsGroup)) {
						const element =
							this.#helpers.dom.getElement<
								HTMLElementTagNameMap[typeof tagName]
							>(id);
						if (!element) {
							this.#log(
								`Element with ID "${id}" not found.`,
								'error'
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
					this.#log(
						`Missing elements: ${missingElements.join(', ')}`,
						'warn'
					);
					throw new Error(
						'Some DOM elements are missing. Validation failed.'
					);
				}

				this.#elements = elements as DOMElements;
			},
			'Unable to validate DOM elements',
			{ missingElements: missingElements }
		);
		this.#log('All static elements are present! 🏳️‍⚧️ 🩷 🏳️‍⚧️', 'debug');
	}
}
