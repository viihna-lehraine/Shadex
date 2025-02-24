// File: events/EventManager.ts

import { Services } from '../types/index.js';

const caller = 'EventManager';

export class EventManager {
	static #instance: EventManager | null = null;

	static #listeners: Map<
		string,
		{
			element: Element | Document;
			handler: EventListenerOrEventListenerObject;
		}
	> = new Map();

	static #errors: Services['errors'];
	static #log: Services['log'];

	private constructor(services: Services) {
		try {
			services.log(`Constructing EventManager instance`, {
				caller: `${caller} constructor`
			});

			EventManager.#errors = services.errors;

			EventManager.#log = services.log;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(services: Services): EventManager {
		return services.errors.handleSync(() => {
			if (!EventManager.#instance) {
				EventManager.#instance = new EventManager(services);
			}

			return EventManager.#instance;
		}, `[${caller}.getInstance]: Failed to create EventManager instance.`);
	}

	static add(
		element: Element | Document,
		eventType: string,
		handler: EventListenerOrEventListenerObject
	): void {
		return EventManager.#errors.handleSync(() => {
			element.addEventListener(eventType, handler);

			EventManager.#listeners.set(`${eventType}_${handler}`, {
				element,
				handler
			});
		}, `[${caller}]: Failed to add event listener for ${eventType}.`);
	}

	static async listAll(): Promise<void> {
		return await EventManager.#errors.handleAsync(async () => {
			if (!EventManager.#listeners.size) {
				EventManager.#log('No active listeners found.', {
					caller: `${caller}.listAll`
				});

				return;
			}

			console.groupCollapsed('Active Listeners:');

			EventManager.#listeners.forEach(({ element, handler }, key) => {
				EventManager.#log(`Event: ${key.split('_')[0]}`, {
					caller: `${caller}.listAll`
				});

				console.log({ element, handler });
			});
			console.groupEnd();
		}, `[${caller}]: Failed to list all event listeners.`);
	}

	static async listByType(eventType: string): Promise<void> {
		return await EventManager.#errors.handleAsync(async () => {
			const listeners = Array.from(
				EventManager.#listeners.entries()
			).filter(([key]) => key.startsWith(`${eventType}_`));

			if (listeners.length === 0) {
				EventManager.#log(
					`No listeners found for event type "${eventType}".`,
					{ caller: `${caller}.listByType`, level: 'warn' }
				);

				return;
			}

			console.groupCollapsed(`🛠️ Event Listeners for: ${eventType}`);

			listeners.forEach(([_, { element, handler }]) => {
				EventManager.#log(`Listener for ${eventType}`, {
					caller: `${caller}.listByType`,
					level: 'debug'
				});

				console.log({ element, handler });
			});
			console.groupEnd();
		}, `[${caller}]: Failed to list event listeners for ${eventType}.`);
	}

	static async remove(
		element: Element | Document,
		eventType: string,
		handler: EventListenerOrEventListenerObject
	): Promise<void> {
		return await EventManager.#errors.handleAsync(async () => {
			element.removeEventListener(eventType, handler);

			const listenerKey = `${eventType}_${handler}`;
			const wasRemoved = EventManager.#listeners.delete(listenerKey);

			if (wasRemoved) {
				EventManager.#log(`Removed listener for ${eventType}`, {
					caller: `${caller}.remove`
				});
			} else {
				EventManager.#log(
					`No matching listener found for ${eventType}`,
					{
						caller: `${caller}.remove`,
						level: 'warn'
					}
				);
			}
		}, `[${caller}]: Failed to remove event listener for ${eventType}.`);
	}

	static async removeAll(): Promise<void> {
		return await EventManager.#errors.handleAsync(async () => {
			if (EventManager.#listeners.size === 0) {
				EventManager.#log('No active listeners to remove.', {
					caller: `${caller}.removeAll`
				});

				return;
			}

			EventManager.#listeners.forEach(({ element, handler }, key) => {
				const [eventType] = key.split('_');

				element.removeEventListener(eventType, handler);

				EventManager.#log(`Removed listener: ${eventType}`, {
					caller: `${caller}.removeAll`,
					level: 'debug'
				});
			});

			EventManager.#listeners.clear();

			EventManager.#log('All listeners have been removed.', {
				caller: `${caller}.removeAll`
			});
		}, `[${caller}]: Failed to remove all event listeners.`);
	}
}
