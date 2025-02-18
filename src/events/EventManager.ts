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
		element.addEventListener(eventType, handler);
		EventManager.listeners.set(`${eventType}_${handler}`, {
			element,
			handler
		});
	}

	public static listAll(): void {
		console.groupCollapsed(`Active Listeners.`);
		EventManager.listeners.forEach(({ element, handler }, key) => {
			console.log(`🛠️ Event: ${key.split('_')[0]}`, { element, handler });
		});
		console.groupEnd();
	}

	public static listByType(eventType: string): void {
		console.groupCollapsed(`Event Listeners for: ${eventType}`);
		EventManager.listeners.forEach(({ element, handler }, key) => {
			if (key.startsWith(`${eventType}_`)) {
				console.log({ element, handler });
			}
		});
		console.groupEnd();
	}

	public static remove(
		element: Element | Document,
		eventType: string,
		handler: EventListenerOrEventListenerObject
	): void {
		element.removeEventListener(eventType, handler);
		EventManager.listeners.delete(`${eventType}_${handler}`);
	}

	public static removeAll(): void {
		EventManager.listeners.forEach(({ element, handler }, key) => {
			const [eventType] = key.split('_');
			element.removeEventListener(eventType, handler);
		});

		EventManager.listeners.clear();
	}
}
