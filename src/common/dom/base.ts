// File: src/common/dom/base.ts

import { CommonDOMBase } from '../../index/index.js';

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

export const base: CommonDOMBase = {
	getElement
} as const;
