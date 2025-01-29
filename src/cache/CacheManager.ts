// File: cache/CacheManager.js

import { CacheManager_ClassInterface } from '../types/index.js';

export class CacheManager<T> implements CacheManager_ClassInterface<T> {
	private cache: Map<string, T> = new Map();

	get(key: string): T | undefined {
		return this.cache.get(key);
	}

	set(key: string, value: T): void {
		this.cache.set(key, value);
	}

	clear(): void {
		this.cache.clear();
	}
}
