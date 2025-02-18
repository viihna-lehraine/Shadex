import { EventManager } from './EventManager.js';
import { data } from '../data/index.js';

// File: events/UIEvents.js
const classes = data.dom.classes;
const ids = data.dom.ids;
class UIEvents {
    services;
    utils;
    log;
    elements;
    constructor(services, utils) {
        this.services = services;
        this.utils = utils;
        this.services = services;
        this.utils = utils;
        this.log = this.services.log;
        const validatedElements = this.utils.dom.getValidatedDOMElements(ids);
        if (!validatedElements) {
            throw new Error(`Critical UI elements not found. Application cannot start`);
        }
        this.elements = validatedElements;
    }
    init() {
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
                const openModals = this.utils.core.getAllElements(classes.modal);
                openModals.forEach(modal => modal.classList.add(classes.hidden));
            }
        }));
    }
    initButtons() {
        // desaturate button (Placeholder logic)
        EventManager.add(this.elements.btns.desaturate, 'click', (e) => {
            e.preventDefault();
            this.log('debug', 'Desaturate button clicked', 'UIEvents.initButtons', 5);
            this.log('debug', 'Desaturation logic not implemented!', 'UIEvents.initButtons', 2);
        });
        // export button (Placeholder logic)
        EventManager.add(this.elements.btns.export, 'click', (e) => {
            e.preventDefault();
            this.log('debug', 'Export button clicked', 'UIEvents.initButtons()', 5);
            this.log('debug', 'Export logic not implemented!', 'UIEvents.initButtons()', 2);
        });
        // generate button (Placeholder logic)
        EventManager.add(this.elements.btns.generate, 'click', (e) => {
            e.preventDefault();
            this.log('debug', 'Generate button clicked', 'UIEvents.initButtons()', 5);
            this.log('debug', 'Palette generation logic not implemented!', 'UIEvents.initButtons()', 2);
        });
        EventManager.add(document, 'click', this.handleWindowClick.bind(this));
    }
    attachTooltipListener(id, tooltipText) {
        const element = this.utils.core.getElement(id);
        if (!element)
            return;
        EventManager.add(element, 'mouseenter', () => {
            this.utils.dom.createTooltip(element, tooltipText);
        });
        EventManager.add(element, 'mouseleave', () => {
            this.utils.dom.removeTooltip(element);
        });
    }
    handleWindowClick(event) {
        const target = event.target;
        if (target === this.elements.divs.helpMenu) {
            this.elements.divs.helpMenu.classList.add(classes.hidden);
        }
        if (target === this.elements.divs.historyMenu) {
            this.elements.divs.historyMenu.classList.add(classes.hidden);
        }
    }
}

export { UIEvents };
//# sourceMappingURL=UIEvents.js.map
