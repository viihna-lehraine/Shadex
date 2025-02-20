import { config } from '../../config/index.js';

// File: common/utils/app.js
const defaultColors = config.defaults.colors;
function createAppUtils(services, utils) {
    return {
        generateRandomHSL() {
            const log = services.log;
            try {
                const hsl = {
                    value: {
                        hue: utils.sanitize.radial(Math.floor(Math.random() * 360)),
                        saturation: utils.sanitize.percentile(Math.floor(Math.random() * 101)),
                        lightness: utils.sanitize.percentile(Math.floor(Math.random() * 101))
                    },
                    format: 'hsl'
                };
                if (!utils.validate.colorValue(hsl)) {
                    log(`Invalid random HSL color value ${JSON.stringify(hsl)}`, 'error');
                    return defaultColors.hsl;
                }
                log(`Generated randomHSL: ${JSON.stringify(hsl)}`, 'debug');
                return hsl;
            }
            catch (error) {
                log(`Error generating random HSL color: ${error}`, 'warn');
                return defaultColors.hsl;
            }
        },
        generateRandomSL() {
            const log = services.log;
            try {
                const sl = {
                    value: {
                        saturation: utils.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100))),
                        lightness: utils.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100)))
                    },
                    format: 'sl'
                };
                if (!utils.validate.colorValue(sl)) {
                    log(`Invalid random SV color value ${JSON.stringify(sl)}`, 'error');
                    return defaultColors.sl;
                }
                log(`Generated randomSL: ${JSON.stringify(sl)}`, 'debug');
                return sl;
            }
            catch (error) {
                log(`Error generating random SL color: ${error}`, 'error');
                return defaultColors.sl;
            }
        },
        getFormattedTimestamp() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        async tracePromise(promise, label) {
            return promise
                .then(result => {
                console.log(`[TRACE SUCCESS] ${label}:`, result);
                return result;
            })
                .catch(error => {
                console.error(`[TRACE ERROR] ${label}:`, error);
                throw error;
            });
        }
    };
}

export { createAppUtils };
//# sourceMappingURL=app.js.map
