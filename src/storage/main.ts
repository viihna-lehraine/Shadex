// File: storage/main.js

export const storageManager = {
	clear(): void {
		localStorage.clear();
	},

	getItem<T>(key: string): T | null {
		const item = localStorage.getItem(key);

		return item ? JSON.parse(item) : null;
	},

	removeItem(key: string): void {
		localStorage.removeItem(key);
	},

	setItem<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}
};
