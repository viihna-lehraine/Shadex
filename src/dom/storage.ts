import * as types from '../index';

const KEY: types.Key = 'AppStorage' as const;

export const storage: types.StorageInterface = {
	clearStorage(): void {
		localStorage.clear();
		document.cookie.split(';').forEach(cookie => {
			const name = cookie.split('=')[0].trim();
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
		});
	},

	getAppStorage(): types.AppStorage | null {
		try {
			const item = localStorage.getItem(String(KEY));
			return item ? (JSON.parse(item) as types.AppStorage) : null;
		} catch (error) {
			console.error(`Error reading from localStorage: ${error}`);
			return null;
		}
	},

	getCookie<T>(name: string): T | null {
		const match = document.cookie.match(`(?:^|;)\\s*${name}=([^;]*)`);

		if (!match) return null;

		try {
			const decodedValue = decodeURIComponent(match[1]);
			return JSON.parse(decodedValue) as T;
		} catch (error) {
			console.error(`Error reading from cookies: ${error}`);
			return null;
		}
	},

	setAppStorage(value: types.AppStorage): void {
		try {
			const serializedValue = JSON.stringify(value);
			localStorage.setItem(KEY, serializedValue);
		} catch (error) {
			console.error(`Error saving to localStorage: ${error}`);
		}
	},

	setCookie<T>(name: string, value: T, days: number): void {
		const date = new Date();

		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

		const serializedValue = encodeURIComponent(JSON.stringify(value));

		document.cookie = `${name}=${serializedValue}; expires=${date.toUTCString()}; path=/`;
	},

	updateAppStorage(updates: Partial<types.AppStorage>): void {
		try {
			const currentData = this.getAppStorage() || {};
			const newData = { ...currentData, ...updates };
			const serializedData = JSON.stringify(newData);

			localStorage.setItem(KEY, serializedData);
		} catch (error) {
			console.error(`Error updating appStorage: ${error}`);
		}
	}
};
