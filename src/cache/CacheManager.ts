// File: src/cache/CacheManager.ts

import { CacheManagerInterface } from '../index/index.js';

export class CacheManager<T> implements CacheManagerInterface<T> {
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
