// File: types/data/dom.js

import { Color } from '../index.js';

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: Color;
}
