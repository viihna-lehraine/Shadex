// File: types/app/core.ts

export interface AppUtilsInterface {
	handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		caller: string,
		context?: Record<string, unknown>
	): Promise<T | null>;
	log(
		level: 'debug' | 'warn' | 'error',
		message: string,
		method: string,
		verbosityRequirement?: number
	): void;
}
