import { EventManager } from './EventManager.js';
import { data } from '../data/index.js';

// File: events/UIEvents.js
const classes = data.dom.classes;
const ids = data.dom.ids;
class UIEvents {
    paletteManager;
    services;
    utils;
    log;
    errors;
    elements;
    constructor(paletteManager, services, utils) {
        this.paletteManager = paletteManager;
        this.services = services;
        this.utils = utils;
        this.services = services;
        this.errors = services.errors;
        this.utils = utils;
        this.log = this.services.log;
        this.paletteManager = paletteManager;
        const validatedElements = this.utils.dom.getValidatedDOMElements(ids);
        if (!validatedElements) {
            throw new Error(`Critical UI elements not found. Application cannot start`);
        }
        this.elements = validatedElements;
    }
    init() {
        this.errors.handle(() => {
            EventManager.add(document, 'click', event => {
                const target = event.target;
                // open modal
                if (target.matches(classes.modalTrigger)) {
                    const modal = this.utils.core.getElement(target.dataset.modalID);
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
                    this.utils.core
                        .getAllElements(classes.modal)
                        .forEach(modal => modal.classList.add(classes.hidden));
                }
            }));
        }, 'Failed to initialize UI events', 'UIEvents.init');
    }
    initButtons() {
        this.errors.handle(() => {
            const addButtonEvent = (button, logMessage, action) => {
                if (!button)
                    return;
                EventManager.add(button, 'click', (e) => {
                    e.preventDefault();
                    this.log('debug', logMessage, 'UIEvents.initButtons()', 5);
                    action?.();
                });
            };
            addButtonEvent(this.elements.btns.desaturate, 'Desaturate button clicked', () => {
                this.log('debug', 'Desaturation logic not implemented!', 'UIEvents.initButtons()', 2);
            });
            addButtonEvent(this.elements.btns.export, 'Export button clicked', () => {
                this.log('debug', 'Export logic not implemented!', 'UIEvents.initButtons()', 2);
            });
            addButtonEvent(this.elements.btns.generate, 'Generate button clicked', () => {
                this.paletteManager.renderNewPalette();
                this.log('debug', 'New palette generated and rendered', 'UIEvents.initButtons()', 2);
            });
            EventManager.add(document, 'click', this.handleWindowClick.bind(this));
        }, 'Failed to initialize buttons', 'UIEvents.initButtons');
    }
    attachTooltipListener(id, tooltipText) {
        this.errors.handle(() => {
            const element = this.utils.core.getElement(id);
            if (!element)
                return;
            EventManager.add(element, 'mouseenter', () => this.utils.dom.createTooltip(element, tooltipText));
            EventManager.add(element, 'mouseleave', () => this.utils.dom.removeTooltip(element));
        }, `Failed to attach tooltip listener for ${id}`, 'UIEvents.attachTooltipListener');
    }
    handleWindowClick(event) {
        this.errors.handle(() => {
            const target = event.target;
            if (target === this.elements.divs.helpMenu) {
                this.elements.divs.helpMenu.classList.add(classes.hidden);
            }
            if (target === this.elements.divs.historyMenu) {
                this.elements.divs.historyMenu.classList.add(classes.hidden);
            }
        }, 'Failed to handle window click', 'UIEvents.handleWindowClick');
    }
}

export { UIEvents };
//# sourceMappingURL=UIEvents.js.map
