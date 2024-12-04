// File: src/dom/index.ts

import { base } from './base';
import { buttons } from './buttons';
import { exportPalette } from './exportPalette';
import { history } from './history';

export const dom = {
	...base,
	buttons,
	exportPalette,
	history
};
