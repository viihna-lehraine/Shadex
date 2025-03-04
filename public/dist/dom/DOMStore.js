import '../config/partials/defaults.js';
import { domIndex } from '../config/partials/dom.js';
import '../config/partials/regex.js';

const caller = 'DOMStore';
const ids = domIndex.ids;
class DOMStore {
    static #instance;
    #elements = null;
    #errors;
    #helpers;
    #log;
    constructor(errors, helpers, log) {
        try {
            log.info(`Constructing DOMStore instance`, `${caller} constructor`);
            this.#errors = errors;
            this.#log = log;
            this.#helpers = helpers;
            this.#validateAndGetDOMElements();
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(errors, helpers, log) {
        return errors.handleSync(() => {
            if (!DOMStore.#instance) {
                log.debug('No DOMStore instance exists yet. Creating DOMStore instance', `${caller}.getInstance`);
                DOMStore.#instance = new DOMStore(errors, helpers, log);
            }
            log.debug(`Returning DOMStore instance`, `${caller}.getInstance`);
            return DOMStore.#instance;
        }, `[${caller}]: Error getting DOMStore instance.`);
    }
    getElement(category, key) {
        return this.#errors.handleSync(() => {
            const element = this.#elements?.[category]?.[key];
            if (!element) {
                this.#log.error(`Element ${category}.${String(key)} is not validated or missing.`, `${caller}.getElement`);
                throw new Error(`[${caller}]: Element ${category}.${String(key)} not found`);
            }
            return element;
        }, `[${caller}]: Error getting DOM element.`);
    }
    getElements() {
        return this.#errors.handleSync(() => {
            if (!this.#elements) {
                this.#log.warn('DOM elements are not validated yet.', `${caller}.getElements`);
                throw new Error(`[${caller}]: DOM elements are not yet validated.`);
            }
            return this.#elements;
        }, `[${caller}]: Error getting DOM elements.`);
    }
    setElements(elements) {
        return this.#errors.handleSync(() => {
            this.#elements = elements;
            this.#log.debug('DOM elements set successfully', `${caller}.setElements`);
        }, `[${caller}]: Unable to set DOM elements.`);
    }
    #validateAndGetDOMElements() {
        const missingElements = [];
        return this.#errors.handleSync(() => {
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
                    this.#log.warn(`No element type mapping for category "${category}". Skipping...`, `${caller}.#validateAndGetDOMElements`);
                    continue;
                }
                for (const [key, id] of Object.entries(elementsGroup)) {
                    const element = this.#helpers.dom.getElement(id);
                    if (!element) {
                        this.#log.warn(`Element with ID "${id}" not found.`, `${caller}.#validateAndGetDOMElements`);
                        missingElements.push(id);
                    }
                    else {
                        elements[category][key] = element;
                    }
                }
            }
            if (missingElements.length > 0) {
                this.#log.warn(`Missing elements: ${missingElements.join(', ')}`, `${caller}.#validateAndGetDOMElements`);
                throw new Error(`[${caller}]: Some DOM elements are missing. Validation failed.`);
            }
            this.#elements = elements;
            this.#log.info('All static elements are present! 🏳️‍⚧️ 🩷 🏳️‍⚧️', `[${caller}.#validateAndGetDOMElements]`);
        }, `[${caller}]: Unable to validate DOM elements.`, { context: { missingElements } });
    }
}

export { DOMStore };
//# sourceMappingURL=DOMStore.js.map
