import { domIndex } from '../../config/index.js';

// File: common/services/DOMStore.ts
const ids = domIndex.ids;
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
        if (!DOMStore.#instance) {
            log('No DOMStore instance exists yet. Creating DOMStore instance', 'debug');
            DOMStore.#instance = new DOMStore(errors, helpers, log);
        }
        log('DOMStore instance already exists. Returning existing instance', 'debug');
        return DOMStore.#instance;
    }
    getElement(category, key) {
        const element = this.#elements?.[category]?.[key];
        if (!element) {
            this.#log(`Element ${category}.${String(key)} is not validated or missing.`, 'error');
            throw new Error(`Element ${category}.${String(key)} not found`);
        }
        return element;
    }
    getElements() {
        if (!this.#elements) {
            this.#log('DOM elements are not validated yet.', 'error');
            throw new Error('DOM elements not validated');
        }
        return this.#elements;
    }
    setElements(elements) {
        this.#errors.handleSync(() => {
            this.#elements = elements;
        }, 'Unable to set DOM elements');
        this.#log('DOM elements set successfully', 'debug');
    }
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
                    this.#log(`No element type mapping for category "${category}". Skipping...`, 'warn');
                    continue;
                }
                for (const [key, id] of Object.entries(elementsGroup)) {
                    const element = this.#helpers.dom.getElement(id);
                    if (!element) {
                        this.#log(`Element with ID "${id}" not found.`, 'error');
                        missingElements.push(id);
                    }
                    else {
                        elements[category][key] = element;
                    }
                }
            }
            if (missingElements.length > 0) {
                this.#log(`Missing elements: ${missingElements.join(', ')}`, 'warn');
                throw new Error('Some DOM elements are missing. Validation failed.');
            }
            this.#elements = elements;
        }, 'Unable to validate DOM elements', { missingElements: missingElements });
        this.#log('All static elements are present! 🏳️‍⚧️ 🩷 🏳️‍⚧️', 'debug');
    }
}

export { DOMStore };
//# sourceMappingURL=DOMStore.js.map
