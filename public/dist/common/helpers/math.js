import { config } from '../../config/index.js';

// File: File: common/helpers/math.ts
const sets = config.sets;
const mathHelpersFactory = () => ({
    clampToRange(value, rangeKey) {
        const [min, max] = sets[rangeKey];
        return Math.min(Math.max(value, min), max);
    }
});

export { mathHelpersFactory };
//# sourceMappingURL=math.js.map
