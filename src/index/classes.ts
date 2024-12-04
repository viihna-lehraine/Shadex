// File: src/index/classes.ts

import { HSL } from '../index';

export interface IndexedDBInterface {
	createMutationLogger<T extends object>(obj: T, key: string): T;
	getCustomColor(): Promise<HSL | null>;
}
