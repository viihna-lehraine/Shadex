// File: events/EventManager.js
class EventManager {
    static listeners = new Map();
    static services;
    constructor(services) {
        EventManager.services = services;
    }
    static add(element, eventType, handler) {
        element.addEventListener(eventType, handler);
        EventManager.listeners.set(`${eventType}_${handler}`, {
            element,
            handler
        });
    }
    static listAll() {
        EventManager.services.app.log('debug', `Active Event Listeners: ${[...EventManager.listeners.keys()]}`, 'EventManager.listAll()', 3);
    }
    static remove(element, eventType, handler) {
        element.removeEventListener(eventType, handler);
        EventManager.listeners.delete(`${eventType}_${handler}`);
    }
    static removeAll() {
        EventManager.listeners.forEach(({ element, handler }, key) => {
            const [eventType] = key.split('_');
            element.removeEventListener(eventType, handler);
        });
        EventManager.listeners.clear();
    }
}

export { EventManager };
//# sourceMappingURL=EventManager.js.map
