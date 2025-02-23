import { env } from '../../config/partials/env.js';
import '../../config/partials/defaults.js';
import '../../config/partials/regex.js';

// File: common/services/Mutex.ts
const caller = 'Mutex';
class Mutex {
    #contentionCount = 0;
    #contentionHistory = [];
    #isLocked = false;
    #lockAttempts = 0;
    #lockQueue = [];
    #readers = 0;
    #timeout;
    #errors;
    #log;
    constructor(errors, log) {
        this.#errors = errors;
        this.#log = log;
        this.#timeout = env.mutex.timeout;
        log('Constructing Mutex instance.', {
            caller: `${caller} constructor`
        });
    }
    async acquireRead() {
        return this.#errors.handleAsync(async () => {
            this.#lockAttempts++;
            return await this.#acquireLock(false);
        }, 'Error acquiring read lock.');
    }
    async acquireReadWithTimeout(timeout = this.#timeout) {
        return this.#errors.handleAsync(async () => {
            try {
                await Promise.race([
                    this.acquireRead(),
                    this.#timeoutPromise(timeout, 'Read lock acquisition timed out.')
                ]);
                return true;
            }
            catch (err) {
                this.#log(err.message, {
                    caller: '[Mutex.acquireReadWithTimeout]',
                    level: 'warn'
                });
                return false;
            }
        }, 'Error acquiring read lock with timeout.');
    }
    async acquireWrite() {
        return this.#errors.handleAsync(async () => {
            this.#lockAttempts++;
            return await this.#acquireLock(true);
        }, 'Error acquiring write lock.');
    }
    async acquireWriteWithTimeout(timeout = this.#timeout) {
        return this.#errors.handleAsync(async () => {
            try {
                await Promise.race([
                    this.acquireWrite(),
                    this.#timeoutPromise(timeout, 'Write lock acquisition timed out.')
                ]);
                return true;
            }
            catch (err) {
                this.#log(err.message, {
                    caller: '[Mutex.acquireWriteWithTimeout]',
                    level: 'warn'
                });
                return false;
            }
        }, 'Error acquiring write lock with timeout.');
    }
    getContentionCount() {
        return this.#contentionCount;
    }
    getContentionRate() {
        return this.#errors.handleSync(() => {
            if (this.#lockAttempts === 0)
                return '0';
            return ((this.#contentionCount / this.#lockAttempts) * 100).toFixed(2);
        }, 'Error getting contention rate.');
    }
    logContentionSnapShot() {
        this.#errors.handleSync(() => {
            const rate = Number(this.getContentionRate());
            this.#contentionHistory.push(rate);
            if (this.#contentionHistory.length >
                env.mutex.contentionHistoryLimit) {
                this.#contentionHistory.shift();
            }
            this.#log(`Contention snapshot recorded: ${rate}%`, {
                caller: `${caller}.logContentionSnapShot`,
                level: 'debug'
            });
        }, 'Error logging contention snapshot.');
    }
    async read(callback) {
        return this.#errors.handleAsync(async () => {
            await this.acquireRead();
            try {
                this.#log('Executing read operation.', {
                    caller: `${caller}.read`,
                    level: 'debug'
                });
                return callback();
            }
            finally {
                this.release();
            }
        }, 'Error reading from mutex.');
    }
    async release() {
        return this.#errors.handleAndReturn(() => {
            this.#log('Releasing lock.', {
                caller: `${caller}.release`,
                level: 'debug'
            });
            if (this.#readers > 0) {
                this.#readers--;
                this.#log(`Released read lock. Active readers: ${this.#readers}`, {
                    caller: `${caller}.release`,
                    level: 'debug'
                });
                if (this.#readers === 0)
                    this.#processQueue();
            }
            else if (this.#isLocked) {
                this.#isLocked = false;
                this.#log('Released write lock.', {
                    caller: `${caller}.release`,
                    level: 'debug'
                });
                this.#processQueue();
            }
            else {
                this.#log('No lock to release.', {
                    caller: `${caller}.release`,
                    level: 'warn'
                });
            }
        }, 'Error releasing lock.');
    }
    resetContentionCount() {
        this.#log(`Resetting contention count to 0 from ${this.#contentionCount}.`, {
            caller: `${caller}.resetContentionCount`,
            level: 'debug'
        });
        this.#contentionCount = 0;
    }
    async runExclusive(callback) {
        return this.#errors.handleAsync(async () => {
            await this.acquireWrite();
            try {
                this.#log('Running exclusive (write) operation.', {
                    caller: `${caller}.runExclusive`,
                    level: 'debug'
                });
                const result = await callback();
                this.#log('Exclusive operation completed.', {
                    caller: `${caller}.runExclusive`,
                    level: 'debug'
                });
                return result;
            }
            finally {
                this.release();
            }
        }, 'Error running exclusive operation.');
    }
    async upgradeToWriteLock() {
        return await this.#errors.handleAsync(async () => {
            await this.release();
            await this.acquireWrite();
        }, 'Error upgrading to write lock.');
    }
    async #acquireLock(isWrite) {
        return this.#errors.handleAndReturn(() => {
            this.#log(`Attempting to acquire ${isWrite ? 'write' : 'read'} lock.`, {
                caller: `${caller}.acquireLock`,
                level: 'debug'
            });
            return new Promise((resolve, reject) => {
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
                        this.#log(`Lock acquisition timed out after ${this.#timeout} ms.`, {
                            caller: `${caller}.acquireLock`,
                            level: 'warn'
                        });
                        cleared.value = true;
                        reject(new Error(`Lock acquisition timed out after ${this.#timeout} ms.`));
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
                }
                else {
                    this.#contentionCount++;
                    this.#log(`Lock contention detected. Queuing ${isWrite ? 'write' : 'read'} request.`, {
                        caller: `${caller}.acquireLock`,
                        level: 'debug'
                    });
                    this.#lockQueue.push({ isWrite, resolve: safeResolve });
                    this.#processQueue();
                }
            });
        }, 'Error acquiring lock.');
    }
    #processQueue() {
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
        const nextWriterIndex = this.#lockQueue.findIndex(entry => entry.isWrite);
        // if next queued lock is a writer and no readers are active, grant it
        if (nextWriterIndex === 0 && this.#readers === 0 && !this.#isLocked) {
            const { resolve } = this.#lockQueue.shift();
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
            this.#lockQueue = this.#lockQueue.filter(entry => entry.isWrite); // Retain writers
            readers.forEach(({ resolve }) => {
                this.#readers++;
                this.#log(`Granted read lock. Active readers: ${this.#readers}`, {
                    caller: `${caller}.processQueue`,
                    level: 'debug'
                });
                resolve();
            });
            return;
        }
        // writers exist but can't acquire lock yet; wait until readers finish
        if (nextWriterIndex > 0) {
            this.#log('Waiting for active readers to clear before granting writer.', {
                caller: `${caller}.processQueue`,
                level: 'debug'
            });
        }
    }
    #timeoutPromise(ms, message) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), ms);
        });
    }
}

export { Mutex };
//# sourceMappingURL=Mutex.js.map
