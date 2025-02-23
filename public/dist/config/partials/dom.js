// File: config/dom.ts
const classes = {
    colorDisplay: 'color-display',
    colorInput: 'color-input',
    colorInputBtn: 'color-input-btn',
    colorInputModal: 'color-input-modal',
    colorStripe: 'color-stripe',
    colorSwatch: 'color-swatch',
    dragHandle: 'drag-handle',
    hidden: 'hidden',
    lockBtn: 'lock-btn',
    locked: 'locked',
    modal: 'modal',
    modalTrigger: 'modal-trigger',
    paletteColumn: 'palette-column',
    resizeHandle: 'resize-handle',
    tooltipContainer: 'tooltip-container',
    tooltipTrigger: 'tooltip-trigger'
};
const ids = {
    btns: {
        desaturate: 'desaturate-btn',
        export: 'export-btn',
        generate: 'generate-btn',
        helpMenu: 'help-menu-btn',
        historyMenu: 'history-menu-btn',
        import: 'import-btn',
        saturate: 'saturate-btn',
        showAsCMYK: 'show-as-cmyk-btn',
        showAsHex: 'show-as-hex-btn',
        showAsHSL: 'show-as-hsl-btn',
        showAsHSV: 'show-as-hsv-btn',
        showAsLAB: 'show-as-lab-btn',
        showAsRGB: 'show-as-rgb-btn'
    },
    divs: {
        helpMenu: 'help-menu',
        historyMenu: 'history-menu',
        paletteContainer: 'palette-container',
        paletteHistory: 'palette-history'
    },
    inputs: {
        columnCount: 'palette-column-count-selector',
        limitDarkChkbx: 'limit-dark-chkbx',
        limitGrayChkbx: 'limit-gray-chkbx',
        limitLightChkbx: 'limit-light-chkbx',
        paletteColumn: 'palette-column-selector',
        paletteType: 'palette-type-selector'
    }
};
const dynamicIDs = {
    globalTooltipDiv: 'global-tooltip'
};
const domConfig = {
    btnDebounce: 300,
    inputDebounce: 200,
    copyButtonTextTimeout: 1000,
    maxColumnSize: 70,
    minColumnSize: 5,
    toastTimer: 3000,
    tooltipFadeIn: 50,
    tooltipFadeOut: 50
};
const domIndex = {
    classes,
    dynamicIDs,
    ids
};

export { domConfig, domIndex };
//# sourceMappingURL=dom.js.map
