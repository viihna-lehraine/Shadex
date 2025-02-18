// File: events/EventManager.js
class EventManager {
    static instance = null;
    static listeners = new Map();
    constructor() { }
    static getInstance() {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }
    static add(element, eventType, handler) {
        element.addEventListener(eventType, handler);
        EventManager.listeners.set(`${eventType}_${handler}`, {
            element,
            handler
        });
    }
    static listAll() {
        console.groupCollapsed(`Active Listeners.`);
        EventManager.listeners.forEach(({ element, handler }, key) => {
            console.log(`🛠️ Event: ${key.split('_')[0]}`, { element, handler });
        });
        console.groupEnd();
    }
    static listByType(eventType) {
        console.groupCollapsed(`Event Listeners for: ${eventType}`);
        EventManager.listeners.forEach(({ element, handler }, key) => {
            if (key.startsWith(`${eventType}_`)) {
                console.log({ element, handler });
            }
        });
        console.groupEnd();
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
