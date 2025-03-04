const colorHelpersFactory = (helpers) => ({
    getConversionFn(from, to) {
        try {
            const fnName = `${from}To${to[0].toUpperCase() + to.slice(1)}`;
            if (!(fnName in helpers.color))
                return undefined;
            const conversionFn = helpers.color[fnName];
            return (value) => structuredClone(conversionFn(value));
        }
        catch (error) {
            throw new Error(`Error getting conversion function: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    hueToRGB(p, q, t) {
        try {
            const clonedP = helpers.data.deepClone(p);
            const clonedQ = helpers.data.deepClone(q);
            let clonedT = helpers.data.deepClone(t);
            if (clonedT < 0)
                clonedT += 1;
            if (clonedT > 1)
                clonedT -= 1;
            if (clonedT < 1 / 6)
                return clonedP + (clonedQ - clonedP) * 6 * clonedT;
            if (clonedT < 1 / 2)
                return clonedQ;
            if (clonedT < 2 / 3)
                return (clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6);
            return clonedP;
        }
        catch (error) {
            throw new Error(`Error converting hue to RGB: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
});

export { colorHelpersFactory };
//# sourceMappingURL=color.js.map
