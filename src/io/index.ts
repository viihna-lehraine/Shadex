// File: src/io/index.ts

import { IO_Fn_MasterInterface } from '../index/index.js';
import { file, exportPalette, importPalette } from './base.js';
import { deserialize } from './deserialize.js';
import { parse } from './parse/index.js';
import { serialize } from './serialize.js';

export const io: IO_Fn_MasterInterface = {
	deserialize,
	exportPalette,
	file,
	importPalette,
	parse,
	serialize
};
