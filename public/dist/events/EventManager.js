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
        try {
            element.addEventListener(eventType, handler);
            EventManager.listeners.set(`${eventType}_${handler}`, {
                element,
                handler
            });
        }
        catch (error) {
            console.error(`Failed to add event listener for ${eventType}:`, error);
        }
    }
    static listAll() {
        try {
            console.groupCollapsed(`Active Listeners.`);
            EventManager.listeners.forEach(({ element, handler }, key) => {
                console.log(`🛠️ Event: ${key.split('_')[0]}`, {
                    element,
                    handler
                });
            });
            console.groupEnd();
        }
        catch (error) {
            console.error('Failed to list all event listeners:', error);
        }
    }
    static listByType(eventType) {
        try {
            console.groupCollapsed(`Event Listeners for: ${eventType}`);
            EventManager.listeners.forEach(({ element, handler }, key) => {
                if (key.startsWith(`${eventType}_`)) {
                    console.log({ element, handler });
                }
            });
            console.groupEnd();
        }
        catch (error) {
            console.error(`Failed to list event listeners for ${eventType}:`, error);
        }
    }
    static remove(element, eventType, handler) {
        try {
            element.removeEventListener(eventType, handler);
            EventManager.listeners.delete(`${eventType}_${handler}`);
        }
        catch (error) {
            console.error(`Failed to remove event listener for ${eventType}:`, error);
        }
    }
    static removeAll() {
        try {
            EventManager.listeners.forEach(({ element, handler }, key) => {
                const [eventType] = key.split('_');
                element.removeEventListener(eventType, handler);
            });
            EventManager.listeners.clear();
        }
        catch (error) {
            console.error('Failed to remove all event listeners:', error);
        }
    }
}

export { EventManager };
//# sourceMappingURL=EventManager.js.map
