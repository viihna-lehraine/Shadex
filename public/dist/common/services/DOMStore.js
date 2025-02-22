import { domIndex } from '../../config/index.js';

// File: common/services/DOMStore.ts
const caller = '[DOMStore]';
const ids = domIndex.ids;
/**
 * @description Stores validation data for DOM elements
 * @export
 * @class DOMStore
 * @implements {DOMStoreInterface}
 */
class DOMStore {
    static #instance;
    #elements = null;
    #errors;
    #helpers;
    #log;
    constructor(errors, helpers, log) {
        this.#errors = errors;
        this.#log = log;
        this.#helpers = helpers;
        this.#validateAndGetDOMElements();
    }
    static getInstance(errors, helpers, log) {
        return errors.handleSync(() => {
            if (!DOMStore.#instance) {
                log('No DOMStore instance exists yet. Creating DOMStore instance', {
                    caller: `${caller}.getInstance`,
                    level: 'debug'
                });
                DOMStore.#instance = new DOMStore(errors, helpers, log);
            }
            log('DOMStore instance already exists. Returning existing instance', {
                caller: `${caller}.getInstance`,
                level: 'debug'
            });
            return DOMStore.#instance;
        }, 'Error getting DOMStore instance.', { fallback: new DOMStore(errors, helpers, log) });
    }
    /**
     * @description Get a single DOM element
     * @param category *
     * @param key *
     * @returns {DOMElements[K][E]}
     */
    getElement(category, key) {
        return this.#errors.handleSync(() => {
            const element = this.#elements?.[category]?.[key];
            if (!element) {
                this.#log(`Element ${category}.${String(key)} is not validated or missing.`, {
                    caller: `${caller}.getElement`,
                    level: 'error'
                });
                throw new Error(`Element ${category}.${String(key)} not found`);
            }
            return element;
        }, 'Error getting DOM element.', { fallback: null });
    }
    /**
     * @description Get all DOM elements
     * @param category *
     * @param key *
     * @returns {DOMElements[K][E]}
     */
    getElements() {
        return this.#errors.handleSync(() => {
            if (!this.#elements) {
                this.#log('DOM elements are not validated yet.', {
                    caller: `${caller}.getElements`,
                    level: 'warn'
                });
                throw new Error('DOM elements not validated');
            }
            return this.#elements;
        }, 'Error getting DOM elements.', { fallback: {} });
    }
    /**
     * @description Sets class instance's DOM elements value
     * @param elements DOMElements
     */
    setElements(elements) {
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
    #validateAndGetDOMElements() {
        const missingElements = [];
        this.#errors.handleSync(() => {
            const elementTypeMap = {
                btns: 'button',
                divs: 'div',
                inputs: 'input'
            };
            const elements = {
                btns: {},
                divs: {},
                inputs: {}
            };
            for (const [category, elementsGroup] of Object.entries(ids)) {
                const tagName = elementTypeMap[category];
                if (!tagName) {
                    this.#log(`No element type mapping for category "${category}". Skipping...`, {
                        caller: `${caller}.#validateAndGetDOMElements`,
                        level: 'warn'
                    });
                    continue;
                }
                for (const [key, id] of Object.entries(elementsGroup)) {
                    const element = this.#helpers.dom.getElement(id);
                    if (!element) {
                        this.#log(`Element with ID "${id}" not found.`, {
                            caller: `${caller}.#validateAndGetDOMElements`,
                            level: 'warn'
                        });
                        missingElements.push(id);
                    }
                    else {
                        elements[category][key] = element;
                    }
                }
            }
            if (missingElements.length > 0) {
                this.#log(`Missing elements: ${missingElements.join(', ')}`, {
                    caller: `${caller}.#validateAndGetDOMElements`,
                    level: 'error'
                });
                throw new Error('Some DOM elements are missing. Validation failed.');
            }
            this.#elements = elements;
        }, 'Unable to validate DOM elements', { context: { missingElements } });
        this.#log('All static elements are present! 🏳️‍⚧️ 🩷 🏳️‍⚧️', {
            caller: `${caller}.#validateAndGetDOMElements`,
            level: 'info'
        });
    }
}

export { DOMStore };
//# sourceMappingURL=DOMStore.js.map
