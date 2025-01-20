// File: src/logger/factory.ts

import {
	AsyncLoggerFactory,
	MutationLog,
	SyncLoggerFactory
} from '../types/index.js';
import { AppLogger } from './AppLogger.js';
import { data } from '../data/index.js';

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

async function logAsyncMutation(
	data: MutationLog,
	logCallback: (data: MutationLog) => void = () => {}
): Promise<void> {
	appLogger.logMutation(data, logCallback);
}

export const logger: SyncLoggerFactory = {
	debug: logDebug,
	info: logInfo,
	warning: logWarning,
	error: logError,
	mutation: logMutation
};

export const asyncLogger: AsyncLoggerFactory = {
	debug: logAsyncDebug,
	info: logAsyncInfo,
	warning: logAsyncWarning,
	error: logAsyncError,
	mutation: logAsyncMutation
};
