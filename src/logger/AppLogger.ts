// File: src/logger/AppLogger.ts

import { AppLoggerInterface, ModeData, MutationLog } from '../types/index.js';

export class AppLogger implements AppLoggerInterface {
	private static instance: AppLogger | null = null;
	private mode: ModeData;

	private constructor(mode: ModeData) {
		this.mode = mode;
	}

	public static getInstance(mode: ModeData): AppLogger {
		if (!AppLogger.instance) {
			AppLogger.instance = new AppLogger(mode);
		}

		return AppLogger.instance;
	}

	public log(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error' = 'info',
		debugLevel: number = 0
	): void {
		if (level === 'info' && this.mode.quiet) return;

		const formattedMessage = this.formatLog(level.toUpperCase(), {
			message
		});

		try {
			console[level](formattedMessage);
		} catch (error) {
			console.error(
				`AppLogger encountered an unexpected error:, ${error}`
			);

			if (debugLevel > 1) console.trace('Trace:');
		}

		if (debugLevel > 1) console.trace('Trace:');
	}

	public async logAsync(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error' = 'info',
		debugLevel: number = 0
	): Promise<void> {
		if (level === 'info' && this.mode.quiet) return;

		const formattedMessage = this.formatLog(level.toUpperCase(), {
			message
		});

		try {
			console[level](formattedMessage);
		} catch (error) {
			console.error(
				`AppLogger encountered an unexpected error:, ${error}`
			);

			if (debugLevel > 1) console.trace('Trace:');
		}

		if (debugLevel > 1) console.trace('Trace:');
	}

	public logMutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void = () => {}
	): void {
		this.log(this.formatMutationLog(data), 'info');

		logCallback(data);
	}

	private formatLog(action: string, details: Record<string, unknown>) {
		return JSON.stringify({
			timestamp: new Date().toISOString(),
			action,
			details
		});
	}

	private formatMutationLog(data: MutationLog): string {
		return `Mutation logged: ${JSON.stringify(data)}`;
	}
}
