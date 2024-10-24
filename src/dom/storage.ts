import * as interfaces from '../index/interfaces';
import * as types from '../index/types';

const KEY: types.Key = 'AppStorage' as const;

export const storage: interfaces.StorageInterface = {
	clearStorage(): void {
		try {
			localStorage.clear();
			document.cookie.split(';').forEach(cookie => {
				const name = cookie.split('=')[0].trim();
				document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
			});
		} catch (error) {
			console.error(`Error clearing storage: ${error}`);
		}
	},

	getAppStorage(): interfaces.AppStorage | null {
		try {
			const item = localStorage.getItem(String(KEY));
			return item ? (JSON.parse(item) as interfaces.AppStorage) : null;
		} catch (error) {
			console.error(`Error reading from localStorage: ${error}`);
			return null;
		}
	},

	getCookie<T>(name: string): T | null {
		try {
			const match = document.cookie.match(`(?:^|;)\\s*${name}=([^;]*)`);

			if (!match) return null;

			const decodedValue = decodeURIComponent(match[1]);

			return JSON.parse(decodedValue) as T;
		} catch (error) {
			console.error(`Error reading from cookies: ${error}`);
			return null;
		}
	},

	setAppStorage(value: interfaces.AppStorage): void {
		try {
			const serializedValue = JSON.stringify(value);

			localStorage.setItem(KEY, serializedValue);
		} catch (error) {
			console.error(`Error saving to localStorage: ${error}`);
		}
	},

	setCookie<T>(name: string, value: T, days: number): void {
		try {
			const date = new Date();

			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

			const serializedValue = encodeURIComponent(JSON.stringify(value));

			document.cookie = `${name}=${serializedValue}; expires=${date.toUTCString()}; path=/`;
		} catch (error) {
			console.error(`Error saving to cookies: ${error}`);
		}
	},

	updateAppStorage(updates: Partial<interfaces.AppStorage>): void {
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
