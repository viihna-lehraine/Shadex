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
		context?: Record<string, unknown>,
		severity?: 'warn' | 'error'
	): void {
		if (!context) context = {};
		if (!severity) severity = 'warn';

		const formattedError = this.formatError(error, errorMessage, context);

		this.logger.log(formattedError, severity, debugLevel, caller);

		if (mode.stackTrace) {
			this.logger.log(
				`Stack trace:\n${this.getStackTrace(error instanceof Error ? error : undefined)}`,
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
		context?: Record<string, unknown>,
		severity?: 'warn' | 'error'
	): Promise<T> {
		if (!context) context = {};
		if (!severity) severity = 'warn';
		try {
			return await action();
		} catch (error) {
			this.handle(error, errorMessage, caller, context, severity);
			throw error;
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

	private getStackTrace(error?: Error): string {
		return error?.stack ?? new Error().stack ?? 'No stack trace available';
	}
}
