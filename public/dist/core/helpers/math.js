import '../../config/partials/defaults.js';
import '../../config/partials/regex.js';
import { sets } from '../../config/partials/sets.js';

// File: File: core/helpers/math.ts
const mathHelpersFactory = () => ({
    clampToRange(value, rangeKey) {
        const [min, max] = sets[rangeKey];
        return Math.min(Math.max(value, min), max);
    }
});

export { mathHelpersFactory };
//# sourceMappingURL=math.js.map
