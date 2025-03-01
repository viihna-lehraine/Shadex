import { EventManager } from './EventManager.js';
import '../../config/partials/defaults.js';
import { domIndex } from '../../config/partials/dom.js';
import '../../config/partials/regex.js';

// File: dom/events/UIEventsService.ts
const caller = 'UIEventsService';
const classes = domIndex.classes;
class UIEventsService {
    static #instance = null;
    #domStore;
    #elements;
    #paletteRenderer;
    #errors;
    #helpers;
    #log;
    #utils;
    constructor(domStore, helpers, paletteRenderer, services, utils) {
        try {
            services.log.info(`Constructing UIEvents instance`, `${caller} constructor`);
            this.#domStore = domStore;
            this.#errors = services.errors;
            this.#helpers = helpers;
            this.#log = services.log;
            this.#utils = utils;
            const validatedElements = this.#domStore.getElements();
            if (!validatedElements) {
                throw new Error(`[${caller} constructor]: Critical UI elements not found. Application cannot start!`);
            }
            this.#elements = validatedElements;
            this.#paletteRenderer = paletteRenderer;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(domStore, helpers, paletteRenderer, services, utils) {
        return services.errors.handleSync(() => {
            if (!UIEventsService.#instance) {
                services.log.debug('No UIEvents instance exists yet. Creating UIEvents instance', `${caller}.getInstance`);
                UIEventsService.#instance = new UIEventsService(domStore, helpers, paletteRenderer, services, utils);
            }
            return UIEventsService.#instance;
        }, `[${caller}.getInstance]: Failed to get UIEvents instance.`);
    }
    init() {
        return this.#errors.handleSync(() => {
            EventManager.add(document, 'click', event => {
                const target = event.target;
                // open modal
                if (target.matches(classes.modalTrigger)) {
                    const modal = this.#helpers.dom.getElement(target.dataset.modalID);
                    modal?.classList.remove(classes.hidden);
                }
                // close modal when clicking outside
                if (target.matches(classes.modal)) {
                    target.classList.add(classes.hidden);
                }
            });
            // handle 'Esc' key press to close modals
            EventManager.add(document, 'keydown', ((event) => {
                if (event.key === 'Escape') {
                    this.#helpers.dom
                        .getAllElements(`.${classes.modal}`)
                        .forEach(modal => modal.classList.add(classes.hidden));
                }
            }));
        }, `[${caller}]: Failed to initialize UI events.`);
    }
    initButtons() {
        return this.#errors.handleSync(() => {
            const addButtonEvent = (button, logMessage, action) => {
                if (!button)
                    return;
                EventManager.add(button, 'click', (e) => {
                    e.preventDefault();
                    this.#log.debug(logMessage, `${caller}.initButtons`);
                    action?.();
                });
            };
            addButtonEvent(this.#elements.btns.desaturate, 'Desaturate button clicked', () => {
                this.#log.warn('Desaturation logic not implemented!', `${caller}.initButtons`);
            });
            addButtonEvent(this.#elements.btns.export, 'Export button clicked', () => {
                this.#log.warn('Export logic not implemented!', `${caller}.initButtons`);
            });
            addButtonEvent(this.#elements.btns.generate, 'Generate button clicked', () => {
                this.#paletteRenderer.renderNewPalette();
                this.#log.debug('New palette generated and rendered', `${caller}.initButtons`);
            });
            EventManager.add(document, 'click', this.handleWindowClick.bind(this));
        }, `[${caller}]: Failed to initialize buttons.`);
    }
    attachTooltipListener(id, tooltipText) {
        return this.#errors.handleSync(() => {
            const element = this.#helpers.dom.getElement(id);
            if (!element)
                return;
            EventManager.add(element, 'mouseenter', () => this.#utils.dom.createTooltip(element, tooltipText));
            EventManager.add(element, 'mouseleave', () => this.#utils.dom.removeTooltip(element));
        }, `[${caller}]: Failed to attach tooltip listener for ${id}.`);
    }
    handleWindowClick(event) {
        return this.#errors.handleSync(() => {
            const target = event.target;
            if (target === this.#elements.divs.helpMenu) {
                this.#elements.divs.helpMenu.classList.add(classes.hidden);
            }
            if (target === this.#elements.divs.historyMenu) {
                this.#elements.divs.historyMenu.classList.add(classes.hidden);
            }
        }, `[${caller}]: Failed to handle window click.`);
    }
}

export { UIEventsService };
//# sourceMappingURL=UIEventsService.js.map
