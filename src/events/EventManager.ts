// File: events/EventManager.js

import { ServicesInterface } from '../types/index.js';

export class EventManager {
	private static listeners: Map<
		string,
		{
			element: Element | Document;
			handler: EventListenerOrEventListenerObject;
		}
	> = new Map();
	private static services: ServicesInterface;

	constructor(services: ServicesInterface) {
		EventManager.services = services;
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
		EventManager.services.app.log(
			'debug',
			`Active Event Listeners: ${[...EventManager.listeners.keys()]}`,
			'EventManager.listAll()',
			3
		);
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
