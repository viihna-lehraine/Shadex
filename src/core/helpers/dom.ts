// File: core/helpers/dom.ts

import { DOMHelpers } from '../../types/index.js';

export const domHelpersFactory = (): DOMHelpers =>
	({
		getAllElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
			return document.querySelectorAll(selector) as NodeListOf<T>;
		},
		getElement<T extends HTMLElement>(id: string): T | null {
			return document.getElementById(id) as T | null;
		}
	}) as const;
