// File: core/utilities/sanitize.ts
function sanitationUtilitiesFactory(brand, services, validate) {
    const { errors } = services;
    function getSafeQueryParam(param) {
        return errors.handleSync(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const rawValue = urlParams.get(param);
            return rawValue ? sanitizeInput(rawValue) : null;
        }, 'Error occurred while getting safe query parameter');
    }
    function toColorValueRange(value, rangeKey) {
        return errors.handleSync(() => {
            validate.range(value, rangeKey);
            return rangeKey === 'HexSet'
                ? brand.asHexSet(value)
                : brand.asBranded(value, rangeKey);
        }, 'Error occurred while validating color value range.', { context: { rangeKey } });
    }
    function lab(value, output) {
        return errors.handleSync(() => {
            if (output === 'l') {
                return brand.asLAB_L(Math.round(Math.min(Math.max(value, 0), 100)));
            }
            else if (output === 'a') {
                return brand.asLAB_A(Math.round(Math.min(Math.max(value, -125), 125)));
            }
            else if (output === 'b') {
                return brand.asLAB_B(Math.round(Math.min(Math.max(value, -125), 125)));
            }
            else
                throw new Error('Unable to return LAB value');
        }, 'Error occurred while sanitizing LAB value');
    }
    function percentile(value) {
        return errors.handleSync(() => {
            const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));
            return brand.asPercentile(rawPercentile);
        }, 'Error occurred while sanitizing percentile value');
    }
    function radial(value) {
        return errors.handleSync(() => {
            const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;
            return brand.asRadial(rawRadial);
        }, 'Error occurred while sanitizing radial value');
    }
    function rgb(value) {
        return errors.handleSync(() => {
            const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));
            return toColorValueRange(rawByteRange, 'ByteRange');
        }, 'Error occurred while sanitizing RGB value');
    }
    function sanitizeInput(str) {
        return errors.handleSync(() => {
            return str.replace(/[&<>"'`/=():]/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
                '`': '&#x60;',
                '/': '&#x2F;',
                '=': '&#x3D;',
                '(': '&#40;',
                ')': '&#41;',
                ':': '&#58;'
            })[char] || char);
        }, 'Error occurred while sanitizing input');
    }
    const sanitationUtilities = {
        getSafeQueryParam,
        lab,
        percentile,
        radial,
        rgb,
        sanitizeInput,
        toColorValueRange
    };
    return errors.handleSync(() => sanitationUtilities, 'Error creating sanitation utilities group.');
}

export { sanitationUtilitiesFactory };
//# sourceMappingURL=sanitize.js.map
