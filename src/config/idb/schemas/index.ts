// File: src/config/idb/zod/index.ts

import { ColorSchema } from './colors';
import { ColorValueSchema } from './colorValues';

export { ColorValueSchema };

export const schemas = {
	Color: ColorSchema,
	ColorValue: ColorValueSchema
} as const;
