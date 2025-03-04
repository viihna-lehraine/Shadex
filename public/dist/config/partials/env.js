const env = {
    app: {
        historyLimit: 100,
        maxColumns: 5,
        paletteHistoryLimit: 20
    },
    idb: {
        maxReadyAttempts: 10,
        retryDelay: 50
    },
    state: {
        maxReadyAttempts: 20,
        maxSaveRetries: 10,
        readyTimeout: 50,
        saveThrottleDelay: 30
    }};

export { env };
//# sourceMappingURL=env.js.map
