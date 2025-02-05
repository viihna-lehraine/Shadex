// File: app/ui/io/index.js

import { IOFn_MasterInterface } from '../../../types/index.js';
import { file, exportPalette, importPalette } from './base.js';
import { deserialize } from './deserialize.js';
import { ioParseUtils } from './parse/index.js';
import { serialize } from './serialize.js';

export const ioFn: IOFn_MasterInterface = {
	deserialize,
	exportPalette,
	file,
	importPalette,
	parse: ioParseUtils,
	serialize
};
