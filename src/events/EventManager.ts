// File: events/EventManager.js

export class EventManager {
	private static instance: EventManager | null = null;
	private static listeners: Map<
		string,
		{
			element: Element | Document;
			handler: EventListenerOrEventListenerObject;
		}
	> = new Map();

	private constructor() {}

	public static getInstance(): EventManager {
		if (!EventManager.instance) {
			EventManager.instance = new EventManager();
		}

		return EventManager.instance;
	}

	public static add(
		element: Element | Document,
		eventType: string,
		handler: EventListenerOrEventListenerObject
	): void {
		try {
			element.addEventListener(eventType, handler);
			EventManager.listeners.set(`${eventType}_${handler}`, {
				element,
				handler
			});
		} catch (error) {
			console.error(
				`Failed to add event listener for ${eventType}:`,
				error
			);
		}
	}

	public static listAll(): void {
		try {
			console.groupCollapsed(`Active Listeners.`);
			EventManager.listeners.forEach(({ element, handler }, key) => {
				console.log(`🛠️ Event: ${key.split('_')[0]}`, {
					element,
					handler
				});
			});
			console.groupEnd();
		} catch (error) {
			console.error('Failed to list all event listeners:', error);
		}
	}

	public static listByType(eventType: string): void {
		try {
			console.groupCollapsed(`Event Listeners for: ${eventType}`);
			EventManager.listeners.forEach(({ element, handler }, key) => {
				if (key.startsWith(`${eventType}_`)) {
					console.log({ element, handler });
				}
			});
			console.groupEnd();
		} catch (error) {
			console.error(
				`Failed to list event listeners for ${eventType}:`,
				error
			);
		}
	}

	public static remove(
		element: Element | Document,
		eventType: string,
		handler: EventListenerOrEventListenerObject
	): void {
		try {
			element.removeEventListener(eventType, handler);
			EventManager.listeners.delete(`${eventType}_${handler}`);
		} catch (error) {
			console.error(
				`Failed to remove event listener for ${eventType}:`,
				error
			);
		}
	}

	public static removeAll(): void {
		try {
			EventManager.listeners.forEach(({ element, handler }, key) => {
				const [eventType] = key.split('_');
				element.removeEventListener(eventType, handler);
			});
			EventManager.listeners.clear();
		} catch (error) {
			console.error('Failed to remove all event listeners:', error);
		}
	}
}
