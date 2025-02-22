// File: events/EventManager.ts
class EventManager {
    static #instance = null;
    static #listeners = new Map();
    static #errors;
    static #log;
    constructor(services) {
        EventManager.#errors = services.errors;
        EventManager.#log = services.log;
    }
    static getInstance(services) {
        if (!EventManager.#instance) {
            EventManager.#instance = new EventManager(services);
        }
        return EventManager.#instance;
    }
    static add(element, eventType, handler) {
        return EventManager.#errors.handleSync(() => {
            element.addEventListener(eventType, handler);
            EventManager.#listeners.set(`${eventType}_${handler}`, {
                element,
                handler
            });
        }, `Failed to add event listener for ${eventType}`);
    }
    static async listAll() {
        return await EventManager.#errors.handleAsync(async () => {
            if (!EventManager.#listeners.size) {
                EventManager.#log('No active listeners found.', {
                    caller: '[EventManager.listAll]'
                });
                return;
            }
            console.groupCollapsed('🛠️ Active Listeners:');
            EventManager.#listeners.forEach(({ element, handler }, key) => {
                EventManager.#log(`🛠️ Event: ${key.split('_')[0]}`, {
                    caller: '[EventManager.listAll]'
                });
                console.log({ element, handler });
            });
            console.groupEnd();
        }, 'Failed to list all event listeners');
    }
    static async listByType(eventType) {
        return await EventManager.#errors.handleAsync(async () => {
            const listeners = Array.from(EventManager.#listeners.entries()).filter(([key]) => key.startsWith(`${eventType}_`));
            if (listeners.length === 0) {
                EventManager.#log(`No listeners found for event type "${eventType}".`, { caller: '[EventManager.listByType]', level: 'warn' });
                return;
            }
            console.groupCollapsed(`🛠️ Event Listeners for: ${eventType}`);
            listeners.forEach(([_, { element, handler }]) => {
                EventManager.#log(`Listener for ${eventType}`, {
                    caller: '[EventManager.listByType]',
                    level: 'debug'
                });
                console.log({ element, handler });
            });
            console.groupEnd();
        }, `Failed to list event listeners for ${eventType}`);
    }
    static async remove(element, eventType, handler) {
        return await EventManager.#errors.handleAsync(async () => {
            element.removeEventListener(eventType, handler);
            const listenerKey = `${eventType}_${handler}`;
            const wasRemoved = EventManager.#listeners.delete(listenerKey);
            if (wasRemoved) {
                EventManager.#log(`Removed listener for ${eventType}`, {
                    caller: '[EventManager.remove]',
                    level: 'info'
                });
            }
            else {
                EventManager.#log(`No matching listener found for ${eventType}`, {
                    caller: '[EventManager.remove]',
                    level: 'warn'
                });
            }
        }, `Failed to remove event listener for ${eventType}`);
    }
    static async removeAll() {
        return await EventManager.#errors.handleAsync(async () => {
            if (EventManager.#listeners.size === 0) {
                EventManager.#log('No active listeners to remove.', {
                    caller: '[EventManager.removeAll]'
                });
                return;
            }
            EventManager.#listeners.forEach(({ element, handler }, key) => {
                const [eventType] = key.split('_');
                element.removeEventListener(eventType, handler);
                EventManager.#log(`Removed listener: ${eventType}`, {
                    caller: '[EventManager.removeAll]',
                    level: 'debug'
                });
            });
            EventManager.#listeners.clear();
            EventManager.#log('All listeners have been removed.', {
                caller: '[EventManager.removeAll]'
            });
        }, 'Failed to remove all event listeners');
    }
}

export { EventManager };
//# sourceMappingURL=EventManager.js.map
