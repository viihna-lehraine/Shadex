// File: src/ui/index.ts

import { UIFnMasterInterface } from '../types/index.js';
import { base } from './base.js';

export { UIManager } from './UIManager.js';

export const ui: UIFnMasterInterface = {
	...base
};
