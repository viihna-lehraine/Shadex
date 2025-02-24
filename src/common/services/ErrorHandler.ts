// File: common/services/ErrorHandler.ts

import {
	ErrorHandlerInterface,
	ErrorHandlerOptions,
	Helpers
} from '../../types/index.js';
import { UserFacingError } from './ErrorClasses.js';
import { Logger } from './Logger.js';
import { config } from '../../config/index.js';

const caller = 'ErrorHandler';
const mode = config.mode;

export class ErrorHandler implements ErrorHandlerInterface {
	static #instance: ErrorHandler | null = null;
	#getCallerInfo: Helpers['data']['getCallerInfo'];
	#logger: Logger;

	private constructor(helpers: Helpers, logger: Logger) {
		try {
			console.log(`[${caller}]: Constructing ErrorHandler instance`);

			this.#getCallerInfo = helpers.data.getCallerInfo;

			this.#logger = logger;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(helpers: Helpers, logger: Logger): ErrorHandler {
		try {
			if (!ErrorHandler.#instance) {
				console.debug(
					`[${caller}] No ErrorHandler instance exists yet. Creating new instance.`
				);
				ErrorHandler.#instance = new ErrorHandler(helpers, logger);
			}

			console.debug(
				`[${caller}] Returning existing ErrorHandler instance.`
			);

			return ErrorHandler.#instance;
		} catch (error) {
			throw new Error(
				`[${caller}.getInstance]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	handleAndReturn<T>(
		action: () => T | Promise<T>,
		errorMessage: string,
		options: ErrorHandlerOptions = {}
	): T | Promise<T> {
		try {
			const result = action();

			if (result instanceof Promise) {
				return result.catch(error => {
					this.#handle(error, errorMessage, options);

					return (options.fallback as T) ?? Promise.reject(error);
				});
			}

			return result;
		} catch (error) {
			this.#handle(error, errorMessage, options);

			return options.fallback as T;
		}
	}

	async handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		options: ErrorHandlerOptions = {}
	): Promise<T> {
		try {
			return await action();
		} catch (error) {
			this.#handle(error, errorMessage, options);

			throw error;
		}
	}

	handleSync<T>(
		action: () => T,
		errorMessage: string,
		options: ErrorHandlerOptions = {}
	): T {
		try {
			return action();
		} catch (error) {
			this.#handle(error, errorMessage, options);

			throw error;
		}
	}

	#formatError(
		error: unknown,
		message: string,
		context: Record<string, unknown>
	): string {
		try {
			return error instanceof Error
				? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
				: `${message}: ${error}. Context: ${JSON.stringify(context)}`;
		} catch (error) {
			throw new Error(
				`[${caller}]: Error formatting error message: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	#getStackTrace(error?: Error): string {
		try {
			return (
				error?.stack ??
				new Error().stack ??
				`[${caller}]: No stack trace available.`
			);
		} catch (error) {
			throw new Error(
				`[${caller}]: Error getting stack trace: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	#handle(
		error: unknown,
		errorMessage: string,
		options: ErrorHandlerOptions = {}
	): void {
		try {
			const caller = this.#getCallerInfo();
			const formattedError = this.#formatError(
				error,
				errorMessage,
				options.context ?? {}
			);

			this.#logger.log(formattedError, 'error', caller);

			if (mode.stackTrace) {
				this.#logger.log(
					`Stack trace:\n${this.#getStackTrace(error instanceof Error ? error : undefined)}`,
					'debug',
					`[${caller}]`
				);
			}

			const userMessage =
				options.userMessage ??
				(error instanceof UserFacingError
					? error.userMessage
					: undefined);

			if (userMessage) {
				alert(userMessage);
			}
		} catch (error) {
			throw new Error(
				`[${caller}]: Error handling error: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}
}
