// File: src/palette/io/index.ts

import { PaletteFnIOInterface } from '../../index/index.js';
import { deserialize } from './deserialize.js';
import { serialize } from './serialize.js';

export const io: PaletteFnIOInterface = {
	deserialize,
	serialize
};
