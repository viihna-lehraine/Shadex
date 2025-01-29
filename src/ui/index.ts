// File: ui/index.js

import { UIFn_MasterInterface } from '../types/index.js';
import { base } from './base.js';

export { UIManager } from './UIManager.js';

export const uiFn: UIFn_MasterInterface = {
	...base
};
