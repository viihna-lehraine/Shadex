// File: types/app/services.js

export interface AppServicesInterface {
	handleAsyncErrors<T>(
		action: () => Promise<T>,
		errorMessage: string,
		caller: string,
		context?: Record<string, unknown>
	): Promise<T | null>;
	log(
		level: 'debug' | 'info' | 'warn' | 'error',
		message: string,
		method: string,
		verbosityRequirement?: number
	): void;
}

export interface ServicesInterface {
	app: AppServicesInterface;
}
