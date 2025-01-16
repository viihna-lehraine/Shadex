// File: src/classes/logger/factory.ts

import { MutationLog } from '../../index/index.js';
import { AppLogger } from './AppLogger.js';
import { data } from '../../data/index.js';

const debugLevel = data.mode.debugLevel;

const appLogger = AppLogger.getInstance(data.mode);

// Synchronous Log Functions

function logDebug(message: string): void {
	appLogger.log(message, 'debug', debugLevel);
}

function logInfo(message: string): void {
	appLogger.log(message, 'info', debugLevel);
}

function logWarning(message: string): void {
	appLogger.log(message, 'warn', debugLevel);
}

function logError(message: string): void {
	appLogger.log(message, 'error', debugLevel);
}

function logMutation(
	data: MutationLog,
	logCallback: (data: MutationLog) => void = () => {}
): void {
	appLogger.logMutation(data, logCallback);
}

// Async Log Functions

async function logAsyncDebug(message: string): Promise<void> {
	appLogger.logAsync(message, 'debug', debugLevel);
}

async function logAsyncInfo(message: string): Promise<void> {
	appLogger.logAsync(message, 'info', debugLevel);
}

async function logAsyncWarning(message: string): Promise<void> {
	appLogger.logAsync(message, 'warn', debugLevel);
}

async function logAsyncError(message: string): Promise<void> {
	appLogger.logAsync(message, 'error', debugLevel);
}

export const log = {
	debug: logDebug,
	info: logInfo,
	warn: logWarning,
	error: logError,
	mutation: logMutation
};

export const logAsync = {
	debug: logAsyncDebug,
	info: logAsyncInfo,
	warn: logAsyncWarning,
	error: logAsyncError
};
