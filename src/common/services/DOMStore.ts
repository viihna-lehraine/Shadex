// File: common/services/DOMStore.ts

import {
	DOMElements,
	DOMStoreInterface,
	Helpers,
	Services,
	UnvalidatedDOMElements
} from '../../types/index.js';
import { domIndex } from '../../config/index.js';

const caller = '[DOMStore]';
const ids = domIndex.ids;

/**
 * @description Stores validation data for DOM elements
 * @export
 * @class DOMStore
 * @implements {DOMStoreInterface}
 */
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
		return errors.handleSync(
			() => {
				if (!DOMStore.#instance) {
					log(
						'No DOMStore instance exists yet. Creating DOMStore instance',
						{
							caller: `${caller}.getInstance`,
							level: 'debug'
						}
					);
					DOMStore.#instance = new DOMStore(errors, helpers, log);
				}

				log(
					'DOMStore instance already exists. Returning existing instance',
					{
						caller: `${caller}.getInstance`,
						level: 'debug'
					}
				);

				return DOMStore.#instance;
			},
			'Error getting DOMStore instance.',
			{ fallback: new DOMStore(errors, helpers, log) }
		);
	}

	/**
	 * @description Get a single DOM element
	 * @param category *
	 * @param key *
	 * @returns {DOMElements[K][E]}
	 */
	getElement<K extends keyof DOMElements, E extends keyof DOMElements[K]>(
		category: K,
		key: E
	): DOMElements[K][E] {
		return this.#errors.handleSync(
			() => {
				const element = this.#elements?.[category]?.[key];

				if (!element) {
					this.#log(
						`Element ${category}.${String(key)} is not validated or missing.`,
						{
							caller: `${caller}.getElement`,
							level: 'error'
						}
					);
					throw new Error(
						`Element ${category}.${String(key)} not found`
					);
				}
				return element;
			},
			'Error getting DOM element.',
			{ fallback: null as unknown as DOMElements[K][E] }
		);
	}

	/**
	 * @description Get all DOM elements
	 * @param category *
	 * @param key *
	 * @returns {DOMElements[K][E]}
	 */
	getElements(): DOMElements {
		return this.#errors.handleSync(
			() => {
				if (!this.#elements) {
					this.#log('DOM elements are not validated yet.', {
						caller: `${caller}.getElements`,
						level: 'warn'
					});
					throw new Error('DOM elements not validated');
				}

				return this.#elements;
			},
			'Error getting DOM elements.',
			{ fallback: {} as DOMElements }
		);
	}

	/**
	 * @description Sets class instance's DOM elements value
	 * @param elements DOMElements
	 */
	setElements(elements: DOMElements): void {
		return this.#errors.handleSync(() => {
			this.#elements = elements;

			this.#log('DOM elements set successfully', {
				caller: `${caller}.setElements`,
				level: 'debug'
			});
		}, 'Unable to set DOM elements');
	}

	/**
	 * @description Validates and retrieves DOM elements
	 * @private
	 * @memberof DOMStore
	 * @returns {void}
	 */
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
							{
								caller: `${caller}.#validateAndGetDOMElements`,
								level: 'warn'
							}
						);
						continue;
					}

					for (const [key, id] of Object.entries(elementsGroup)) {
						const element =
							this.#helpers.dom.getElement<
								HTMLElementTagNameMap[typeof tagName]
							>(id);
						if (!element) {
							this.#log(`Element with ID "${id}" not found.`, {
								caller: `${caller}.#validateAndGetDOMElements`,
								level: 'warn'
							});
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
						{
							caller: `${caller}.#validateAndGetDOMElements`,
							level: 'error'
						}
					);
					throw new Error(
						'Some DOM elements are missing. Validation failed.'
					);
				}

				this.#elements = elements as DOMElements;
			},
			'Unable to validate DOM elements',
			{ context: { missingElements } }
		);
		this.#log('All static elements are present! 🏳️‍⚧️ 🩷 🏳️‍⚧️', {
			caller: `${caller}.#validateAndGetDOMElements`,
			level: 'info'
		});
	}
}
