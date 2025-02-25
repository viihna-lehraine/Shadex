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
export const domConfig = {
    btnDebounce: 300,
    inputDebounce: 200,
    copyButtonTextTimeout: 1000,
    maxColumnSize: 70,
    minColumnSize: 5,
    toastTimer: 3000,
    tooltipFadeIn: 50,
    tooltipFadeOut: 50
};
export const domIndex = {
    classes,
    dynamicIDs,
    ids
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZy9wYXJ0aWFscy9kb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsc0JBQXNCO0FBSXRCLE1BQU0sT0FBTyxHQUFrQztJQUM5QyxZQUFZLEVBQUUsZUFBZTtJQUM3QixVQUFVLEVBQUUsYUFBYTtJQUN6QixhQUFhLEVBQUUsaUJBQWlCO0lBQ2hDLGVBQWUsRUFBRSxtQkFBbUI7SUFDcEMsV0FBVyxFQUFFLGNBQWM7SUFDM0IsV0FBVyxFQUFFLGNBQWM7SUFDM0IsVUFBVSxFQUFFLGFBQWE7SUFDekIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsT0FBTyxFQUFFLFVBQVU7SUFDbkIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsS0FBSyxFQUFFLE9BQU87SUFDZCxZQUFZLEVBQUUsZUFBZTtJQUM3QixhQUFhLEVBQUUsZ0JBQWdCO0lBQy9CLFlBQVksRUFBRSxlQUFlO0lBQzdCLGdCQUFnQixFQUFFLG1CQUFtQjtJQUNyQyxjQUFjLEVBQUUsaUJBQWlCO0NBQ3hCLENBQUM7QUFFWCxNQUFNLEdBQUcsR0FBOEI7SUFDdEMsSUFBSSxFQUFFO1FBQ0wsVUFBVSxFQUFFLGdCQUFnQjtRQUM1QixNQUFNLEVBQUUsWUFBWTtRQUNwQixRQUFRLEVBQUUsY0FBYztRQUN4QixRQUFRLEVBQUUsZUFBZTtRQUN6QixXQUFXLEVBQUUsa0JBQWtCO1FBQy9CLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7UUFDOUIsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixTQUFTLEVBQUUsaUJBQWlCO1FBQzVCLFNBQVMsRUFBRSxpQkFBaUI7UUFDNUIsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixTQUFTLEVBQUUsaUJBQWlCO0tBQzVCO0lBQ0QsSUFBSSxFQUFFO1FBQ0wsUUFBUSxFQUFFLFdBQVc7UUFDckIsV0FBVyxFQUFFLGNBQWM7UUFDM0IsZ0JBQWdCLEVBQUUsbUJBQW1CO1FBQ3JDLGNBQWMsRUFBRSxpQkFBaUI7S0FDakM7SUFDRCxNQUFNLEVBQUU7UUFDUCxXQUFXLEVBQUUsK0JBQStCO1FBQzVDLGNBQWMsRUFBRSxrQkFBa0I7UUFDbEMsY0FBYyxFQUFFLGtCQUFrQjtRQUNsQyxlQUFlLEVBQUUsbUJBQW1CO1FBQ3BDLGFBQWEsRUFBRSx5QkFBeUI7UUFDeEMsV0FBVyxFQUFFLHVCQUF1QjtLQUNwQztDQUNRLENBQUM7QUFFWCxNQUFNLFVBQVUsR0FBcUM7SUFDcEQsZ0JBQWdCLEVBQUUsZ0JBQWdCO0NBQ2xDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxTQUFTLEdBQWM7SUFDbkMsV0FBVyxFQUFFLEdBQUc7SUFDaEIsYUFBYSxFQUFFLEdBQUc7SUFDbEIscUJBQXFCLEVBQUUsSUFBSTtJQUMzQixhQUFhLEVBQUUsRUFBRTtJQUNqQixhQUFhLEVBQUUsQ0FBQztJQUNoQixVQUFVLEVBQUUsSUFBSTtJQUNoQixhQUFhLEVBQUUsRUFBRTtJQUNqQixjQUFjLEVBQUUsRUFBRTtDQUNsQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUF1QjtJQUMzQyxPQUFPO0lBQ1AsVUFBVTtJQUNWLEdBQUc7Q0FDTSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29uZmlnL2RvbS50c1xuXG5pbXBvcnQgeyBET01Db25maWcsIERPTUluZGV4IH0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuXG5jb25zdCBjbGFzc2VzOiBSZWFkb25seTxET01JbmRleD5bJ2NsYXNzZXMnXSA9IHtcblx0Y29sb3JEaXNwbGF5OiAnY29sb3ItZGlzcGxheScsXG5cdGNvbG9ySW5wdXQ6ICdjb2xvci1pbnB1dCcsXG5cdGNvbG9ySW5wdXRCdG46ICdjb2xvci1pbnB1dC1idG4nLFxuXHRjb2xvcklucHV0TW9kYWw6ICdjb2xvci1pbnB1dC1tb2RhbCcsXG5cdGNvbG9yU3RyaXBlOiAnY29sb3Itc3RyaXBlJyxcblx0Y29sb3JTd2F0Y2g6ICdjb2xvci1zd2F0Y2gnLFxuXHRkcmFnSGFuZGxlOiAnZHJhZy1oYW5kbGUnLFxuXHRoaWRkZW46ICdoaWRkZW4nLFxuXHRsb2NrQnRuOiAnbG9jay1idG4nLFxuXHRsb2NrZWQ6ICdsb2NrZWQnLFxuXHRtb2RhbDogJ21vZGFsJyxcblx0bW9kYWxUcmlnZ2VyOiAnbW9kYWwtdHJpZ2dlcicsXG5cdHBhbGV0dGVDb2x1bW46ICdwYWxldHRlLWNvbHVtbicsXG5cdHJlc2l6ZUhhbmRsZTogJ3Jlc2l6ZS1oYW5kbGUnLFxuXHR0b29sdGlwQ29udGFpbmVyOiAndG9vbHRpcC1jb250YWluZXInLFxuXHR0b29sdGlwVHJpZ2dlcjogJ3Rvb2x0aXAtdHJpZ2dlcidcbn0gYXMgY29uc3Q7XG5cbmNvbnN0IGlkczogUmVhZG9ubHk8RE9NSW5kZXg+WydpZHMnXSA9IHtcblx0YnRuczoge1xuXHRcdGRlc2F0dXJhdGU6ICdkZXNhdHVyYXRlLWJ0bicsXG5cdFx0ZXhwb3J0OiAnZXhwb3J0LWJ0bicsXG5cdFx0Z2VuZXJhdGU6ICdnZW5lcmF0ZS1idG4nLFxuXHRcdGhlbHBNZW51OiAnaGVscC1tZW51LWJ0bicsXG5cdFx0aGlzdG9yeU1lbnU6ICdoaXN0b3J5LW1lbnUtYnRuJyxcblx0XHRpbXBvcnQ6ICdpbXBvcnQtYnRuJyxcblx0XHRzYXR1cmF0ZTogJ3NhdHVyYXRlLWJ0bicsXG5cdFx0c2hvd0FzQ01ZSzogJ3Nob3ctYXMtY215ay1idG4nLFxuXHRcdHNob3dBc0hleDogJ3Nob3ctYXMtaGV4LWJ0bicsXG5cdFx0c2hvd0FzSFNMOiAnc2hvdy1hcy1oc2wtYnRuJyxcblx0XHRzaG93QXNIU1Y6ICdzaG93LWFzLWhzdi1idG4nLFxuXHRcdHNob3dBc0xBQjogJ3Nob3ctYXMtbGFiLWJ0bicsXG5cdFx0c2hvd0FzUkdCOiAnc2hvdy1hcy1yZ2ItYnRuJ1xuXHR9LFxuXHRkaXZzOiB7XG5cdFx0aGVscE1lbnU6ICdoZWxwLW1lbnUnLFxuXHRcdGhpc3RvcnlNZW51OiAnaGlzdG9yeS1tZW51Jyxcblx0XHRwYWxldHRlQ29udGFpbmVyOiAncGFsZXR0ZS1jb250YWluZXInLFxuXHRcdHBhbGV0dGVIaXN0b3J5OiAncGFsZXR0ZS1oaXN0b3J5J1xuXHR9LFxuXHRpbnB1dHM6IHtcblx0XHRjb2x1bW5Db3VudDogJ3BhbGV0dGUtY29sdW1uLWNvdW50LXNlbGVjdG9yJyxcblx0XHRsaW1pdERhcmtDaGtieDogJ2xpbWl0LWRhcmstY2hrYngnLFxuXHRcdGxpbWl0R3JheUNoa2J4OiAnbGltaXQtZ3JheS1jaGtieCcsXG5cdFx0bGltaXRMaWdodENoa2J4OiAnbGltaXQtbGlnaHQtY2hrYngnLFxuXHRcdHBhbGV0dGVDb2x1bW46ICdwYWxldHRlLWNvbHVtbi1zZWxlY3RvcicsXG5cdFx0cGFsZXR0ZVR5cGU6ICdwYWxldHRlLXR5cGUtc2VsZWN0b3InXG5cdH1cbn0gYXMgY29uc3Q7XG5cbmNvbnN0IGR5bmFtaWNJRHM6IFJlYWRvbmx5PERPTUluZGV4WydkeW5hbWljSURzJ10+ID0ge1xuXHRnbG9iYWxUb29sdGlwRGl2OiAnZ2xvYmFsLXRvb2x0aXAnXG59O1xuXG5leHBvcnQgY29uc3QgZG9tQ29uZmlnOiBET01Db25maWcgPSB7XG5cdGJ0bkRlYm91bmNlOiAzMDAsXG5cdGlucHV0RGVib3VuY2U6IDIwMCxcblx0Y29weUJ1dHRvblRleHRUaW1lb3V0OiAxMDAwLFxuXHRtYXhDb2x1bW5TaXplOiA3MCxcblx0bWluQ29sdW1uU2l6ZTogNSxcblx0dG9hc3RUaW1lcjogMzAwMCxcblx0dG9vbHRpcEZhZGVJbjogNTAsXG5cdHRvb2x0aXBGYWRlT3V0OiA1MFxufTtcblxuZXhwb3J0IGNvbnN0IGRvbUluZGV4OiBSZWFkb25seTxET01JbmRleD4gPSB7XG5cdGNsYXNzZXMsXG5cdGR5bmFtaWNJRHMsXG5cdGlkc1xufSBhcyBjb25zdDtcbiJdfQ==