import { EventManager } from './EventManager.js';
import '../config/partials/defaults.js';
import { domIndex } from '../config/partials/dom.js';
import '../config/partials/regex.js';

// File: events/UIEvents.ts
const classes = domIndex.classes;
class UIEvents {
    paletteManager;
    services;
    #domStore;
    #elements;
    #errors;
    #helpers;
    #log;
    #utils;
    constructor(helpers, paletteManager, services, utils) {
        this.paletteManager = paletteManager;
        this.services = services;
        this.services = services;
        this.#domStore = services.domStore;
        this.#errors = services.errors;
        this.#helpers = helpers;
        this.#log = this.services.log;
        this.paletteManager = paletteManager;
        this.#utils = utils;
        const validatedElements = this.#domStore.getElements();
        if (!validatedElements) {
            throw new Error(`Critical UI elements not found. Application cannot start`);
        }
        this.#elements = validatedElements;
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
                        .getAllElements(classes.modal)
                        .forEach(modal => modal.classList.add(classes.hidden));
                }
            }));
        }, 'Failed to initialize UI events.');
    }
    initButtons() {
        return this.#errors.handleSync(() => {
            const addButtonEvent = (button, logMessage, action) => {
                if (!button)
                    return;
                EventManager.add(button, 'click', (e) => {
                    e.preventDefault();
                    this.#log(logMessage, {
                        caller: '[UIEvents.initButtons]',
                        level: 'debug'
                    });
                    action?.();
                });
            };
            addButtonEvent(this.#elements.btns.desaturate, 'Desaturate button clicked', () => {
                this.#log('Desaturation logic not implemented!', {
                    caller: '[UIEvents.initButtons]',
                    level: 'warn'
                });
            });
            addButtonEvent(this.#elements.btns.export, 'Export button clicked', () => {
                this.#log('Export logic not implemented!', {
                    caller: '[UIEvents.initButtons]',
                    level: 'warn'
                });
            });
            addButtonEvent(this.#elements.btns.generate, 'Generate button clicked', () => {
                this.paletteManager.renderNewPalette();
                this.#log('New palette generated and rendered', {
                    caller: '[UIEvents.initButtons]',
                    level: 'debug'
                });
            });
            EventManager.add(document, 'click', this.handleWindowClick.bind(this));
        }, 'Failed to initialize buttons.');
    }
    attachTooltipListener(id, tooltipText) {
        return this.#errors.handleSync(() => {
            const element = this.#helpers.dom.getElement(id);
            if (!element)
                return;
            EventManager.add(element, 'mouseenter', () => this.#utils.dom.createTooltip(element, tooltipText));
            EventManager.add(element, 'mouseleave', () => this.#utils.dom.removeTooltip(element));
        }, `Failed to attach tooltip listener for ${id}.`);
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
        }, 'Failed to handle window click.');
    }
}

export { UIEvents };
//# sourceMappingURL=UIEvents.js.map
