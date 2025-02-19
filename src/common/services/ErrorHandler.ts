// File: common/services/ErrorHandler.ts

import { ErrorHandlerInterface } from '../../types/app.js';
import { AppLogger } from './AppLogger.js';
import { config } from '../../config/index.js';

const mode = config.mode;

export class ErrorHandler implements ErrorHandlerInterface {
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
		context: Record<string, unknown> = {}
	): void {
		const caller = this.getCallerInfo();
		const formattedError = this.formatError(error, errorMessage, context);

		this.logger.log(formattedError, 'error', caller);

		if (mode.stackTrace) {
			this.logger.log(
				`Stack trace:\n${this.getStackTrace(error instanceof Error ? error : undefined)}`,
				'debug',
				'[ErrorHandler]'
			);
		}
	}

	public async handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		context: Record<string, unknown> = {}
	): Promise<T> {
		try {
			return await action();
		} catch (error) {
			this.handle(error, errorMessage, context);
			throw error;
		}
	}

	private formatError(
		error: unknown,
		message: string,
		context: Record<string, unknown>
	): string {
		return error instanceof Error
			? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
			: `${message}: ${error}. Context: ${JSON.stringify(context)}`;
	}

	private getStackTrace(error?: Error): string {
		return error?.stack ?? new Error().stack ?? 'No stack trace available';
	}

	private getCallerInfo(): string {
		const stack = new Error().stack;
		if (stack) {
			const stackLines = stack.split('\n');
			for (const line of stackLines) {
				if (
					!line.includes('AppLogger') &&
					!line.includes('ErrorHandler') &&
					line.includes('at ')
				) {
					const match =
						line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
						line.match(/at\s+(.*):(\d+):(\d+)/);
					if (match) {
						return match[1]
							? `${match[1]} (${match[2]}:${match[3]})`
							: `${match[2]}:${match[3]}`;
					}
				}
			}
		}
		return 'Unknown caller';
	}
}
