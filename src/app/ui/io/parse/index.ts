// File: app/ui/io/parse/index.js

import { IOFn_MasterInterface } from '../../../../types/index.js';
import { asColorValue } from './colorValue.js';
import { asColorString, asCSSColorString } from './color.js';
import { color } from './base.js';
import { json } from './json.js';

export const ioParseUtils: IOFn_MasterInterface['parse'] = {
	asColorValue,
	asColorString,
	asCSSColorString,
	color,
	json
};
