// File: src/dom/base.js
import { core, helpers, utils } from '../common/index.js';
import { data } from '../data/index.js';
const mode = data.mode;
function applyFirstColorToUI(color) {
    try {
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            if (mode.errorLogs)
                console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = core.convert.toCSSColorString(color);
        if (!formatColorString) {
            if (mode.errorLogs)
                console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        utils.palette.populateOutputBox(color, 1);
        return color;
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to apply first color to UI: ${error}`);
        return utils.random.hsl(false);
    }
}
function copyToClipboard(text, tooltipElement) {
    try {
        const colorValue = text.replace('Copied to clipboard!', '').trim();
        navigator.clipboard
            .writeText(colorValue)
            .then(() => {
            helpers.dom.showTooltip(tooltipElement);
            if (!mode.quiet)
                console.log(`Copied color value: ${colorValue}`);
            setTimeout(() => tooltipElement.classList.remove('show'), data.consts.timeouts.tooltip || 1000);
        })
            .catch(err => {
            if (mode.errorLogs)
                console.error('Error copying to clipboard:', err);
        });
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to copy to clipboard: ${error}`);
        else if (!mode.quiet)
            console.error('Failed to copy to clipboard');
    }
}
function defineUIElements() {
    try {
        const advancedMenuButton = data.consts.dom.elements.advancedMenuButton;
        const applyCustomColorButton = data.consts.dom.elements.applyCustomColorButton;
        const clearCustomColorButton = data.consts.dom.elements.clearCustomColorButton;
        const closeCustomColorMenuButton = data.consts.dom.elements.closeCustomColorMenuButton;
        const closeHelpMenuButton = data.consts.dom.elements.closeHelpMenuButton;
        const closeHistoryMenuButton = data.consts.dom.elements.closeHistoryMenuButton;
        const desaturateButton = data.consts.dom.elements.desaturateButton;
        const enableAlphaCheckbox = data.consts.dom.elements.enableAlphaCheckbox;
        const generateButton = data.consts.dom.elements.generateButton;
        const helpMenuButton = data.consts.dom.elements.helpMenuButton;
        const historyMenuButton = data.consts.dom.elements.historyMenuButton;
        const limitDarknessCheckbox = data.consts.dom.elements.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.elements.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.elements.limitLightnessCheckbox;
        const saturateButton = data.consts.dom.elements.saturateButton;
        const selectedColorOption = data.consts.dom.elements.selectedColorOption;
        const showAsCMYKButton = data.consts.dom.elements.showAsCMYKButton;
        const showAsHexButton = data.consts.dom.elements.showAsHexButton;
        const showAsHSLButton = data.consts.dom.elements.showAsHSLButton;
        const showAsHSVButton = data.consts.dom.elements.showAsHSVButton;
        const showAsLABButton = data.consts.dom.elements.showAsLABButton;
        const showAsRGBButton = data.consts.dom.elements.showAsRGBButton;
        const selectedColor = selectedColorOption
            ? parseInt(selectedColorOption.value, 10)
            : 0;
        return {
            advancedMenuButton,
            applyCustomColorButton,
            clearCustomColorButton,
            closeCustomColorMenuButton,
            closeHelpMenuButton,
            closeHistoryMenuButton,
            desaturateButton,
            enableAlphaCheckbox,
            generateButton,
            helpMenuButton,
            historyMenuButton,
            limitDarknessCheckbox,
            limitGraynessCheckbox,
            limitLightnessCheckbox,
            saturateButton,
            selectedColor,
            showAsCMYKButton,
            showAsHexButton,
            showAsHSLButton,
            showAsHSVButton,
            showAsLABButton,
            showAsRGBButton
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to define UI buttons: ${error}.`);
        if (!mode.quiet)
            console.error('Failed to define UI buttons.');
        return {
            advancedMenuButton: null,
            applyCustomColorButton: null,
            clearCustomColorButton: null,
            closeCustomColorMenuButton: null,
            closeHelpMenuButton: null,
            closeHistoryMenuButton: null,
            desaturateButton: null,
            enableAlphaCheckbox: null,
            generateButton: null,
            helpMenuButton: null,
            historyMenuButton: null,
            limitDarknessCheckbox: null,
            limitLightnessCheckbox: null,
            limitGraynessCheckbox: null,
            saturateButton: null,
            selectedColor: 0,
            showAsCMYKButton: null,
            showAsHexButton: null,
            showAsHSLButton: null,
            showAsHSVButton: null,
            showAsLABButton: null,
            showAsRGBButton: null
        };
    }
}
async function initializeUI() {
    console.log('Initializing UI with dynamically loaded elements');
    const buttons = defineUIElements();
    if (!buttons) {
        console.error('Failed to initialize UI buttons');
        return;
    }
    buttons.applyCustomColorButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('applyCustomColorButton clicked');
        // *DEV-NOTE* add logic here...
    });
}
export const base = {
    applyFirstColorToUI,
    copyToClipboard,
    defineUIElements,
    initializeUI
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFHeEIsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXhDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFdkIsU0FBUyxtQkFBbUIsQ0FBQyxLQUFVO0lBQ3RDLElBQUksQ0FBQztRQUNKLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFekQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRXpELE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN4QixJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7WUFFMUQsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBRUQsU0FBUyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUM7UUFFcEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFMUMsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQ2pCLE9B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O1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1NBQ3JCLENBQUM7SUFDSCxDQUFDO0FBQ0YsQ0FBQztBQUVELEtBQUssVUFBVSxZQUFZO0lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0RBQWtELENBQUMsQ0FBQztJQUNoRSxNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO0lBRW5DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNqRCxPQUFPO0lBQ1IsQ0FBQztJQUVELE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO1FBQ25FLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDOUMsK0JBQStCO0lBQ2hDLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBdUI7SUFDdkMsbUJBQW1CO0lBQ25CLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsWUFBWTtDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZG9tL2Jhc2UuanNcblxuaW1wb3J0IHsgRE9NQmFzZUZuSW50ZXJmYWNlLCBIU0wsIFVJRWxlbWVudHMgfSBmcm9tICcuLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlLCBoZWxwZXJzLCB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YS9pbmRleC5qcyc7XG5cbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmZ1bmN0aW9uIGFwcGx5Rmlyc3RDb2xvclRvVUkoY29sb3I6IEhTTCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JCb3gxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLWJveC0xJyk7XG5cblx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKCdjb2xvci1ib3gtMSBpcyBudWxsJyk7XG5cblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtYXRDb2xvclN0cmluZyA9IGNvcmUuY29udmVydC50b0NTU0NvbG9yU3RyaW5nKGNvbG9yKTtcblxuXHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyk7XG5cblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb2xvckJveDEuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZm9ybWF0Q29sb3JTdHJpbmc7XG5cblx0XHR1dGlscy5wYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KGNvbG9yLCAxKTtcblxuXHRcdHJldHVybiBjb2xvcjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gYXBwbHkgZmlyc3QgY29sb3IgdG8gVUk6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gdXRpbHMucmFuZG9tLmhzbChmYWxzZSkgYXMgSFNMO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvcHlUb0NsaXBib2FyZCh0ZXh0OiBzdHJpbmcsIHRvb2x0aXBFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yVmFsdWUgPSB0ZXh0LnJlcGxhY2UoJ0NvcGllZCB0byBjbGlwYm9hcmQhJywgJycpLnRyaW0oKTtcblxuXHRcdG5hdmlnYXRvci5jbGlwYm9hcmRcblx0XHRcdC53cml0ZVRleHQoY29sb3JWYWx1ZSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1Rvb2x0aXAodG9vbHRpcEVsZW1lbnQpO1xuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYENvcGllZCBjb2xvciB2YWx1ZTogJHtjb2xvclZhbHVlfWApO1xuXG5cdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0KCkgPT4gdG9vbHRpcEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0XHRcdGRhdGEuY29uc3RzLnRpbWVvdXRzLnRvb2x0aXAgfHwgMTAwMFxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6JywgZXJyKTtcblx0XHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gKTtcblx0XHRlbHNlIGlmICghbW9kZS5xdWlldCkgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lVUlFbGVtZW50cygpOiBVSUVsZW1lbnRzIHtcblx0dHJ5IHtcblx0XHRjb25zdCBhZHZhbmNlZE1lbnVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuYWR2YW5jZWRNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmFwcGx5Q3VzdG9tQ29sb3JCdXR0b247XG5cdFx0Y29uc3QgY2xlYXJDdXN0b21Db2xvckJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY2xlYXJDdXN0b21Db2xvckJ1dHRvbjtcblx0XHRjb25zdCBjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b247XG5cdFx0Y29uc3QgY2xvc2VIZWxwTWVudUJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY2xvc2VIZWxwTWVudUJ1dHRvbjtcblx0XHRjb25zdCBjbG9zZUhpc3RvcnlNZW51QnV0dG9uID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5jbG9zZUhpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGRlc2F0dXJhdGVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuZGVzYXR1cmF0ZUJ1dHRvbjtcblx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGdlbmVyYXRlQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmdlbmVyYXRlQnV0dG9uO1xuXHRcdGNvbnN0IGhlbHBNZW51QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmhlbHBNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGhpc3RvcnlNZW51QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmhpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXREYXJrbmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0R3JheW5lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3Qgc2F0dXJhdGVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2F0dXJhdGVCdXR0b247XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvck9wdGlvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvbjtcblx0XHRjb25zdCBzaG93QXNDTVlLQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0NNWUtCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzSGV4QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0hleEJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNIU0xCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzSFNMQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0hTVkJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zaG93QXNIU1ZCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzTEFCQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0xBQkJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNSR0JCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzUkdCQnV0dG9uO1xuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHRcdD8gcGFyc2VJbnQoc2VsZWN0ZWRDb2xvck9wdGlvbi52YWx1ZSwgMTApXG5cdFx0XHQ6IDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YWR2YW5jZWRNZW51QnV0dG9uLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbixcblx0XHRcdGNsb3NlSGVscE1lbnVCdXR0b24sXG5cdFx0XHRjbG9zZUhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbixcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3gsXG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbixcblx0XHRcdGhlbHBNZW51QnV0dG9uLFxuXHRcdFx0aGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3gsXG5cdFx0XHRsaW1pdEdyYXluZXNzQ2hlY2tib3gsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94LFxuXHRcdFx0c2F0dXJhdGVCdXR0b24sXG5cdFx0XHRzZWxlY3RlZENvbG9yLFxuXHRcdFx0c2hvd0FzQ01ZS0J1dHRvbixcblx0XHRcdHNob3dBc0hleEJ1dHRvbixcblx0XHRcdHNob3dBc0hTTEJ1dHRvbixcblx0XHRcdHNob3dBc0hTVkJ1dHRvbixcblx0XHRcdHNob3dBc0xBQkJ1dHRvbixcblx0XHRcdHNob3dBc1JHQkJ1dHRvblxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlZmluZSBVSSBidXR0b25zOiAke2Vycm9yfS5gKTtcblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBkZWZpbmUgVUkgYnV0dG9ucy4nKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRhZHZhbmNlZE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xvc2VIZWxwTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlSGlzdG9yeU1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRkZXNhdHVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0ZW5hYmxlQWxwaGFDaGVja2JveDogbnVsbCxcblx0XHRcdGdlbmVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0aGVscE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRoaXN0b3J5TWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGxpbWl0RGFya25lc3NDaGVja2JveDogbnVsbCxcblx0XHRcdGxpbWl0TGlnaHRuZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRsaW1pdEdyYXluZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3I6IDAsXG5cdFx0XHRzaG93QXNDTVlLQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSGV4QnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSFNMQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSFNWQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzTEFCQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzUkdCQnV0dG9uOiBudWxsXG5cdFx0fTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplVUkoKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcgVUkgd2l0aCBkeW5hbWljYWxseSBsb2FkZWQgZWxlbWVudHMnKTtcblx0Y29uc3QgYnV0dG9ucyA9IGRlZmluZVVJRWxlbWVudHMoKTtcblxuXHRpZiAoIWJ1dHRvbnMpIHtcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBVSSBidXR0b25zJyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9ucy5hcHBseUN1c3RvbUNvbG9yQnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGUgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRjb25zb2xlLmxvZygnYXBwbHlDdXN0b21Db2xvckJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0Ly8gKkRFVi1OT1RFKiBhZGQgbG9naWMgaGVyZS4uLlxuXHR9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IERPTUJhc2VGbkludGVyZmFjZSA9IHtcblx0YXBwbHlGaXJzdENvbG9yVG9VSSxcblx0Y29weVRvQ2xpcGJvYXJkLFxuXHRkZWZpbmVVSUVsZW1lbnRzLFxuXHRpbml0aWFsaXplVUlcbn0gYXMgY29uc3Q7XG4iXX0=