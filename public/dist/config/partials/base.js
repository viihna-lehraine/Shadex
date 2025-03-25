const mode = {
    env: 'dev',
    debugLevel: 3,
    exposeClasses: true,
    log: {
        debug: true,
        info: true,
        error: true,
        verbosity: 3,
        warn: true
    },
    logExecution: {
        deepClone: true
    },
    showAlerts: false,
    stackTrace: true
};
const storage = {
    idbDBName: 'IndexedDB',
    idbDefaultVersion: 1,
    idbStoreName: 'AppStorage'
};
const config = {
    mode,
    storage
};

export { config };
//# sourceMappingURL=base.js.map
