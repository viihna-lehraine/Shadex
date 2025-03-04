import { DOMHelpers } from '../../types/index.js';

export const domHelpersFactory = (): DOMHelpers =>
	({
		getAllElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
			console.log(
				`[domHelpers > getAllElements]: Looking for elements with selector: ${selector}.`
			);

			const elements = document.querySelectorAll<T>(selector);

			console.log(`[getAllElements]: Found ${elements.length} elements.`);

			return elements;
		},
		getElement<T extends HTMLElement>(id: string): T | null {
			return document.getElementById(id) as T | null;
		}
	}) as const;
