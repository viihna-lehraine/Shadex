import { EventManager } from './EventManager.js';
import { domData } from '../data/dom.js';

// File: events/UIEvents.js
const btns = domData.elements.btns;
const classes = domData.classes;
const elements = domData.elements;
class UIEvents {
    services;
    utils;
    log;
    constructor(services, utils) {
        this.services = services;
        this.utils = utils;
        this.services = services;
        this.utils = utils;
        this.log = this.services.app.log;
    }
    init() {
        EventManager.add(document, 'click', event => {
            const target = event.target;
            // open modal
            if (target.matches(domData.classes.modalTrigger)) {
                const modal = this.utils.core.getElement(target.dataset.modalID);
                modal?.classList.remove(domData.classes.hidden);
            }
            // close modal when clicking outside
            if (target.matches(domData.classes.modal)) {
                target.classList.add(domData.classes.hidden);
            }
        });
        // handle 'Esc' key press to close modals
        EventManager.add(document, 'keydown', ((event) => {
            if (event.key === 'Escape') {
                const openModals = this.utils.core.getAllElements(domData.classes.modal);
                openModals.forEach(modal => modal.classList.add(domData.classes.hidden));
            }
        }));
    }
    initButtons() {
        // desaturate button (Placeholder logic)
        EventManager.add(btns.desaturate, 'click', (e) => {
            e.preventDefault();
            this.log('debug', 'Desaturate button clicked', 'UIEvents.initButtons()', 5);
            this.log('debug', 'Desaturation logic not implemented!', 'UIEvents.initButtons()', 2);
        });
        // export button (Placeholder logic)
        EventManager.add(btns.export, 'click', (e) => {
            e.preventDefault();
            this.log('debug', 'Export button clicked', 'UIEvents.initButtons()', 5);
            this.log('debug', 'Export logic not implemented!', 'UIEvents.initButtons()', 2);
        });
        // generate button (Placeholder logic)
        EventManager.add(btns.generate, 'click', (e) => {
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
        if (target === elements.divs.helpMenu) {
            elements.divs.helpMenu.classList.add(classes.hidden);
        }
        if (target === elements.divs.historyMenu) {
            elements.divs.historyMenu.classList.add(classes.hidden);
        }
    }
}

export { UIEvents };
//# sourceMappingURL=UIEvents.js.map
