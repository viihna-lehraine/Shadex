const math = {
    epsilon: 0.00001,
    maxXYZ_X: 95.047,
    maxXYZ_Y: 100,
    maxXYZ_Z: 108.883};
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
    math,
    mode,
    storage
};

export { config };
//# sourceMappingURL=base.js.map
