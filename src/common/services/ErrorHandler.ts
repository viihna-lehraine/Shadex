// File: common/services/ErrorHandler.js

import { ErrorHandlerClassInterface } from '../../types/app.js';
import { AppLogger } from './AppLogger.js';
import { data } from '../../data/index.js';

const mode = data.mode;
const debugLevel = mode.debugLevel;

export class ErrorHandler implements ErrorHandlerClassInterface {
	private static instance: ErrorHandler | null = null;
	private logger: AppLogger;

	private constructor(logger: AppLogger) {
		this.logger = logger;
	}

	public static getInstance(logger: AppLogger): ErrorHandler {
		if (!ErrorHandler.instance) {
			ErrorHandler.instance = new ErrorHandler(logger);
		}

		return ErrorHandler.instance;
	}

	public handle(
		error: unknown,
		errorMessage: string,
		caller: string,
		context: Record<string, unknown> = {},
		severity: 'warn' | 'error' = 'error'
	): void {
		const formattedError = this.formatError(error, errorMessage, context);

		this.logger.log(formattedError, severity, debugLevel, caller);

		if (mode.stackTrace) {
			this.logger.log(
				`Stack trace:\N${this.getStackTrace()}`,
				'debug',
				3,
				'[ErrorHandler]'
			);
		}
	}

	public async handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		caller: string = 'Unknown caller',
		context?: Record<string, unknown>
	): Promise<T | null> {
		try {
			return await action();
		} catch (error) {
			this.handle(error, errorMessage, caller, context);
			return null;
		}
	}

	private formatError(
		error: unknown,
		message: string,
		context?: Record<string, unknown>
	): string {
		return error instanceof Error
			? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
			: `${message}: ${error}. Context: ${JSON.stringify(context)}`;
	}

	private getStackTrace(): string {
		try {
			throw new Error();
		} catch (e) {
			return (e as Error).stack ?? 'No stack trace available';
		}
	}
}
