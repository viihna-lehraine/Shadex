// File: common/services/Mutex.ts

import {
	Helpers,
	LockQueueEntry,
	MutexInterface,
	Services
} from '../../types/index.js';
import { env } from '../../config/index.js';

const caller = 'Mutex';

export class Mutex implements MutexInterface {
	#contentionCount: number = 0;
	#contentionHistory: number[] = [];
	#isLocked: boolean = false;
	#lockAttempts: number = 0;
	#lockQueue: LockQueueEntry[] = [];
	#readers: number = 0;
	#timeout: number;

	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];

	constructor(
		errors: Services['errors'],
		helpers: Helpers,
		log: Services['log']
	) {
		try {
			log('Constructing Mutex instance.', {
				caller: `${caller} constructor`
			});

			this.#errors = errors;
			this.#helpers = helpers;
			this.#log = log;
			this.#timeout = env.mutex.timeout;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	get isLocked(): boolean {
		return this.#errors.handleSync(
			() => this.#helpers.data.clone(this.#isLocked),
			`[${caller}]: Error getting lock status.`
		);
	}

	async acquireRead(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			this.#lockAttempts++;

			return await this.#acquireLock(false);
		}, `[${caller}]: Error acquiring read lock.`);
	}

	async acquireReadWithTimeout(
		timeout: number = this.#timeout
	): Promise<boolean> {
		return this.#errors.handleAsync(async () => {
			try {
				await Promise.race([
					this.acquireRead(),
					this.#timeoutPromise(
						timeout,
						'Read lock acquisition timed out.'
					)
				]);

				return true;
			} catch (err) {
				this.#log((err as Error).message, {
					caller: `${caller}.acquireReadWithTimeout`,
					level: 'warn'
				});

				return false;
			}
		}, 'Error acquiring read lock with timeout.');
	}

	async acquireWrite(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			this.#lockAttempts++;

			return await this.#acquireLock(true);
		}, `[${caller}]: Error acquiring write lock.`);
	}

	async acquireWriteWithTimeout(
		timeout: number = this.#timeout
	): Promise<boolean> {
		return this.#errors.handleAsync(async () => {
			try {
				await Promise.race([
					this.acquireWrite(),
					this.#timeoutPromise(
						timeout,
						'Write lock acquisition timed out.'
					)
				]);

				return true;
			} catch (err) {
				this.#log((err as Error).message, {
					caller: `${caller}.acquireWriteWithTimeout`,
					level: 'warn'
				});

				return false;
			}
		}, `[${caller}]: Error acquiring write lock with timeout.`);
	}

	getContentionCount(): number {
		return this.#errors.handleSync(() => {
			return this.#contentionCount;
		}, `[${caller}]: Error getting contention count.`);
	}

	getContentionRate(): string {
		return this.#errors.handleSync(() => {
			if (this.#lockAttempts === 0) return '0';

			return ((this.#contentionCount / this.#lockAttempts) * 100).toFixed(
				2
			);
		}, `[${caller}]: Error getting contention rate.`);
	}

	logContentionSnapShot(): void {
		this.#errors.handleSync(() => {
			const rate = Number(this.getContentionRate());

			this.#contentionHistory.push(rate);

			if (
				this.#contentionHistory.length >
				env.mutex.contentionHistoryLimit
			) {
				this.#contentionHistory.shift();
			}

			this.#log(`Contention snapshot recorded: ${rate}%`, {
				caller: `${caller}.logContentionSnapShot`,
				level: 'debug'
			});
		}, `[${caller}]: Error logging contention snapshot.`);
	}

	async read<T>(callback: () => T): Promise<T> {
		return this.#errors.handleAsync(async () => {
			await this.acquireRead();

			try {
				this.#log('Executing read operation.', {
					caller: `${caller}.read`,
					level: 'debug'
				});

				return callback();
			} finally {
				this.release();
			}
		}, `[${caller}]: Error reading from mutex.`);
	}

	async release(): Promise<void> {
		return this.#errors.handleAndReturn(() => {
			this.#log('Releasing lock.', {
				caller: `${caller}.release`,
				level: 'debug'
			});

			if (this.#readers > 0) {
				this.#readers--;

				this.#log(
					`Released read lock. Active readers: ${this.#readers}`,
					{
						caller: `${caller}.release`,
						level: 'debug'
					}
				);

				if (this.#readers === 0) this.#processQueue();
			} else if (this.#isLocked) {
				this.#isLocked = false;

				this.#log('Released write lock.', {
					caller: `${caller}.release`,
					level: 'debug'
				});

				this.#processQueue();
			} else {
				this.#log('No lock to release.', {
					caller: `${caller}.release`,
					level: 'warn'
				});
			}
		}, `[${caller}]: Error releasing lock.`) as void;
	}

	resetContentionCount(): void {
		return this.#errors.handleSync(() => {
			this.#log(
				`Resetting contention count to 0 from ${this.#contentionCount}.`,
				{
					caller: `${caller}.resetContentionCount`,
					level: 'debug'
				}
			);

			this.#contentionCount = 0;
		}, `[${caller}]: Error resetting contention count.`);
	}

	async runExclusive<T>(callback: () => Promise<T> | T): Promise<T> {
		return this.#errors.handleAsync(async () => {
			await this.acquireWrite();

			try {
				this.#log('Running exclusive write operation.', {
					caller: `${caller}.runExclusive`,
					level: 'debug'
				});

				const result = await callback();

				this.#log('Exclusive operation completed.', {
					caller: `${caller}.runExclusive`,
					level: 'debug'
				});

				return result;
			} finally {
				this.release();
			}
		}, `[${caller}]: Error running exclusive operation.`);
	}

	async upgradeToWriteLock(): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			await this.release();
			await this.acquireWrite();
		}, `[${caller}]: Error upgrading to write lock.`);
	}

	async #acquireLock(isWrite: boolean): Promise<void> {
		return this.#errors.handleAndReturn(() => {
			this.#log(
				`Attempting to acquire ${isWrite ? 'write' : 'read'} lock.`,
				{
					caller: `${caller}.acquireLock`,
					level: 'debug'
				}
			);

			return new Promise<void>((resolve, reject) => {
				const cleared = { value: false };

				const safeResolve = () => {
					if (!cleared.value) {
						clearTimeout(timer);

						cleared.value = true;

						resolve();
					}
				};

				const timer = setTimeout(() => {
					if (!cleared.value) {
						this.#log(
							`Lock acquisition timed out after ${this.#timeout} ms.`,
							{
								caller: `${caller}.acquireLock`,
								level: 'warn'
							}
						);

						cleared.value = true;

						reject(
							new Error(
								`Lock acquisition timed out after ${this.#timeout} ms.`
							)
						);
					}
				}, this.#timeout);

				const canAcquire = isWrite
					? !this.#isLocked && this.#readers === 0
					: !this.#isLocked;

				if (canAcquire) {
					isWrite ? (this.#isLocked = true) : this.#readers++;

					this.#log(`${isWrite ? 'Write' : 'Read'} lock acquired.`, {
						caller: `${caller}.acquireLock`,
						level: 'debug'
					});

					safeResolve();
				} else {
					this.#contentionCount++;

					this.#log(
						`Lock contention detected. Queuing ${isWrite ? 'write' : 'read'} request.`,
						{
							caller: `${caller}.acquireLock`,
							level: 'debug'
						}
					);

					this.#lockQueue.push({ isWrite, resolve: safeResolve });

					this.#processQueue();
				}
			});
		}, `[${caller}]: Error acquiring lock.`);
	}

	#processQueue(): void {
		this.#log('Processing lock queue.', {
			caller: `${caller}.processQueue`,
			level: 'debug'
		});

		if (this.#lockQueue.length === 0) {
			this.#log('No queued lock requests to process.', {
				caller: `${caller}.processQueue`,
				level: 'debug'
			});

			return;
		}

		const nextWriterIndex = this.#lockQueue.findIndex(
			entry => entry.isWrite
		);

		// if next queued lock is a writer and no readers are active, grant it
		if (nextWriterIndex === 0 && this.#readers === 0 && !this.#isLocked) {
			const { resolve } = this.#lockQueue.shift()!;

			this.#isLocked = true;

			this.#log('Granted write lock to queued writer.', {
				caller: `${caller}.processQueue`,
				level: 'debug'
			});

			resolve();

			return;
		}

		// if no writers are queued, grant read locks to all queued readers
		if (nextWriterIndex === -1) {
			const readers = this.#lockQueue.filter(entry => !entry.isWrite);

			// retain writers in queue
			this.#lockQueue = this.#lockQueue.filter(entry => entry.isWrite);

			readers.forEach(({ resolve }) => {
				this.#readers++;

				this.#log(
					`Granted read lock. Active readers: ${this.#readers}`,
					{
						caller: `${caller}.processQueue`,
						level: 'debug'
					}
				);

				resolve();
			});

			return;
		}

		// writers exist but can't acquire lock yet; wait until readers finish
		if (nextWriterIndex > 0) {
			this.#log(
				'Waiting for active readers to clear before granting writer.',
				{
					caller: `${caller}.processQueue`,
					level: 'debug'
				}
			);
		}
	}

	#timeoutPromise(ms: number, message: string): Promise<never> {
		return this.#errors.handleAsync(async () => {
			return new Promise((_, reject) => {
				setTimeout(() => reject(new Error(message)), ms);
			});
		}, `[${caller}]: Error creating timeout promise.`);
	}
}
