// File: state/PaletteState.ts
class PaletteState {
    stateManager;
    errors;
    utils;
    constructor(stateManager, services, utils) {
        this.stateManager = stateManager;
        this.errors = services.errors;
        this.utils = utils;
    }
    updatePaletteItemColor(columnID, newColor) {
        this.errors.handle(() => {
            const currentState = this.stateManager.getState();
            const latestPalette = currentState.paletteHistory[0];
            if (!latestPalette)
                return;
            // find the PaletteItem corresponding to this column
            const updatedItems = latestPalette.items.map(item => {
                if (item.itemID !== columnID)
                    return item;
                const parsedNewColor = this.utils.color.convertCSSToColor(newColor);
                if (!parsedNewColor)
                    throw new Error('Invalid color value');
                // ensure color is in HSL format
                const hslColor = parsedNewColor.format === 'hsl'
                    ? parsedNewColor
                    : this.utils.color.convertToHSL(parsedNewColor);
                // generate all color representations (ensuring correct branded types)
                const allColors = this.utils.palette.generateAllColorValues(hslColor);
                // ensure CSS representations match expected format
                const structuredCSS = {
                    cmyk: this.utils.color.convertColorToCSS(allColors.cmyk),
                    hex: this.utils.color.convertColorToCSS(allColors.hex),
                    hsl: this.utils.color.convertColorToCSS(allColors.hsl),
                    hsv: this.utils.color.convertColorToCSS(allColors.hsv),
                    lab: this.utils.color.convertColorToCSS(allColors.lab),
                    rgb: this.utils.color.convertColorToCSS(allColors.rgb),
                    xyz: this.utils.color.convertColorToCSS(allColors.xyz)
                };
                return {
                    ...item,
                    colors: allColors,
                    css: structuredCSS
                };
            });
            // ensure column state is updated
            const updatedColumns = updatedItems.map((item, index) => ({
                id: item.itemID,
                isLocked: currentState.paletteContainer.columns[index].isLocked,
                position: index + 1,
                size: currentState.paletteContainer.columns[index].size
            }));
            // update state history with type assertions
            this.stateManager.updatePaletteColumns(updatedColumns, true, 3);
            this.stateManager.updatePaletteHistory([
                { ...latestPalette, items: updatedItems },
                ...currentState.paletteHistory.slice(1)
            ]);
        }, 'Failed to update palette item color', 'PaletteState.updatePaletteItemColor()', { columnID, newColor });
    }
}

export { PaletteState };
//# sourceMappingURL=PaletteState.js.map
