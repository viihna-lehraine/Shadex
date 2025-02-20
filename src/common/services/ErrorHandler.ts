// File: common/services/ErrorHandler.ts

import { ErrorHandlerInterface, Helpers } from '../../types/app.js';
import { Logger } from './Logger.js';
import { config } from '../../config/index.js';

const mode = config.mode;

export class ErrorHandler implements ErrorHandlerInterface {
	static #instance: ErrorHandler | null = null;
	#getCallerInfo: Helpers['data']['getCallerInfo'];
	#logger: Logger;

	private constructor(helpers: Helpers, logger: Logger) {
		this.#getCallerInfo = helpers.data.getCallerInfo;
		this.#logger = logger;
	}

	static getInstance(helpers: Helpers, logger: Logger): ErrorHandler {
		if (!ErrorHandler.#instance) {
			console.debug(
				'[ErrorHandler] No ErrorHandler instance exists yet. Creating new instance.'
			);
			ErrorHandler.#instance = new ErrorHandler(helpers, logger);
		}

		console.debug(
			'[ErrorHandler] Returning existing ErrorHandler instance.'
		);

		return ErrorHandler.#instance;
	}

	async handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		context: Record<string, unknown> = {}
	): Promise<T> {
		try {
			return await action();
		} catch (error) {
			this.#handle(error, errorMessage, context);
			throw error;
		}
	}

	handleSync<T>(
		action: () => T,
		errorMessage: string,
		context: Record<string, unknown> = {}
	): T {
		try {
			return action();
		} catch (error) {
			this.#handle(error, errorMessage, context);
			throw error;
		}
	}

	#formatError(
		error: unknown,
		message: string,
		context: Record<string, unknown>
	): string {
		return error instanceof Error
			? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
			: `${message}: ${error}. Context: ${JSON.stringify(context)}`;
	}

	#getStackTrace(error?: Error): string {
		return error?.stack ?? new Error().stack ?? 'No stack trace available';
	}

	#handle(
		error: unknown,
		errorMessage: string,
		context: Record<string, unknown> = {}
	): void {
		const caller = this.#getCallerInfo();
		const formattedError = this.#formatError(error, errorMessage, context);

		this.#logger.log(formattedError, 'error', caller);

		if (mode.stackTrace) {
			this.#logger.log(
				`Stack trace:\n${this.#getStackTrace(error instanceof Error ? error : undefined)}`,
				'debug',
				'[ErrorHandler]'
			);
		}
	}
}
