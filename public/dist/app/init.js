import { DOMStore } from '../dom/DOMStore.js';
import { EventManager } from '../dom/events/EventManager.js';
import { PaletteEventsService } from '../dom/events/PaletteEventsService.js';
import { PaletteStateService } from '../state/PaletteStateService.js';
import { StateManager } from '../state/StateManager.js';
import { UIEventsService } from '../dom/events/UIEventsService.js';

async function initializeDOMStore(helpers, services) {
    const { errors, log } = services;
    return errors.handleAsync(async () => {
        return DOMStore.getInstance(errors, helpers, log);
    }, 'Error initializing DOMStore');
}
async function initializeEventManager(services) {
    const { errors } = services;
    return errors.handleAsync(async () => {
        return EventManager.getInstance(services);
    }, 'Error initializing EventManager');
}
async function initializePaletteEventsService(domStore, helpers, paletteRenderer, paletteState, services, stateManager, utils) {
    const { errors } = services;
    return await errors.handleAsync(async () => {
        const paletteEvents = PaletteEventsService.getInstance(domStore, helpers, paletteRenderer, paletteState, services, stateManager, utils);
        paletteEvents.init();
        return paletteEvents;
    }, 'Error initializing events');
}
async function initializePaletteStateService(helpers, services, stateManager, utils) {
    const { errors } = services;
    return await errors.handleAsync(async () => {
        const palettestate = PaletteStateService.getInstance(helpers, services, stateManager, utils);
        return palettestate;
    }, 'Error initializing PaletteState');
}
async function initializeStateManager(helpers, services, utils) {
    const { errors } = services;
    return await errors.handleAsync(async () => {
        const stateManager = StateManager.getInstance(helpers, services, utils);
        return stateManager;
    }, 'Error initializing StateManager');
}
async function initializeUIEventsService(domStore, helpers, paletteRenderer, services, utils) {
    const { errors } = services;
    return await errors.handleAsync(async () => {
        const uiEvents = UIEventsService.getInstance(domStore, helpers, paletteRenderer, services, utils);
        uiEvents.init();
        uiEvents.initButtons();
        return uiEvents;
    }, 'Error initializing UIEventsService');
}
async function initializeUtilities(helpers, services) {
    const { errors } = services;
    return await errors.handleAsync(async () => {
        const { utilitiesFactory } = await import('../core/factories/utils.js');
        const utils = await utilitiesFactory(helpers, services);
        return utils;
    }, 'Error initializing utils');
}

export { initializeDOMStore, initializeEventManager, initializePaletteEventsService, initializePaletteStateService, initializeStateManager, initializeUIEventsService, initializeUtilities };
//# sourceMappingURL=init.js.map
