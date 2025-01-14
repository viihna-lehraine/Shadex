// File: types/global.d.ts

export {};

declare global {
	interface Window {
		idbManager: IDBManager;
	}
}
