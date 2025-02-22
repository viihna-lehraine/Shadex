import { config } from '../../config/index.js';

// File: common/services/Semaphore.ts
const caller = 'Semaphore';
const maxLocks = config.env.semaphoreMaxLocks;
const timeout = config.env.semaphoreTimeout;
class Semaphore {
    #isLocked = false;
    #waitingQueue = [];
    #lockCount = 0;
    #errors;
    #log;
    constructor(errors, log) {
        log('Constructing Semaphore instance.', {
            caller: `${caller} constructor`
        });
        this.#errors = errors;
        this.#log = log;
    }
    async acquire() {
        return this.#errors.handleAndReturn(() => {
            this.#log('Semaphore acquiring lock.', {
                caller: `${caller}.acquire`,
                level: 'debug'
            });
            if (this.#lockCount >= maxLocks) {
                throw new Error(`Cannot acquire lock. Maximum number of locks (${maxLocks}) reached.`);
            }
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error(`Lock acquisition timed out after ${timeout} ms`)), timeout);
                const tryAcquire = () => {
                    if (!this.#isLocked) {
                        clearTimeout(timer);
                        this.#isLocked = true;
                        resolve();
                    }
                    else {
                        this.#waitingQueue.push(tryAcquire);
                    }
                };
                tryAcquire();
                this.#lockCount++;
            });
        }, 'Error acquiring semaphore lock.');
    }
    release() {
        return this.#errors.handleAndReturn(() => {
            this.#log('Semaphore releasing lock.', {
                caller: `${caller}.release`,
                level: 'debug'
            });
            if (!this.#isLocked) {
                throw new Error("Cannot release a lock that isn't acquired.");
            }
            this.#isLocked = false;
            const next = this.#waitingQueue.shift();
            this.#lockCount--;
            if (next) {
                next();
            }
        }, 'Error releasing semaphore lock.');
    }
}

export { Semaphore };
//# sourceMappingURL=Semaphore.js.map
