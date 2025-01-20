// File: src/io/index.ts

import { IO_Interface } from '../types/index.js';
import { file, exportPalette, importPalette } from './base.js';
import { deserialize } from './deserialize.js';
import { parse } from './parse/index.js';
import { serialize } from './serialize.js';

export const io: IO_Interface = {
	deserialize,
	exportPalette,
	file,
	importPalette,
	parse,
	serialize
};
