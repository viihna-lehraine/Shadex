// File: src/common/superUtils/dom.ts
import { IDBManager } from '../../idb/index.js';
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { utils } from '../utils/index.js';
const mode = data.mode;
const idb = IDBManager.getInstance();
async function genPaletteBox(items, numBoxes, tableId) {
    try {
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            if (mode.errorLogs)
                console.error('paletteRow is undefined.');
            return;
        }
        paletteRow.innerHTML = '';
        const fragment = document.createDocumentFragment();
        items.slice(0, numBoxes).forEach((item, i) => {
            const color = { value: item.colors.hsl, format: 'hsl' };
            const { colorStripe } = helpers.dom.makePaletteBox(color, i + 1);
            fragment.appendChild(colorStripe);
            utils.palette.populateOutputBox(color, i + 1);
        });
        paletteRow.appendChild(fragment);
        if (!mode.quiet)
            console.log('Palette boxes generated and rendered.');
        await idb.saveData('tables', tableId, { palette: items });
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error generating palette box: ${error}`);
    }
}
function getGenButtonArgs() {
    try {
        const paletteNumberOptions = data.consts.dom.paletteNumberOptions;
        const paletteTypeOptions = data.consts.dom.paletteTypeOptions;
        const customColorRaw = data.consts.dom.customColorElement?.value;
        const enableAlphaCheckbox = data.consts.dom.enableAlphaCheckbox;
        const limitDarknessCheckbox = data.consts.dom.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.limitLightnessCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitDarknessCheckbox === null ||
            limitGraynessCheckbox === null ||
            limitLightnessCheckbox === null) {
            if (mode.errorLogs)
                console.error('One or more elements are null');
            return null;
        }
        if (!mode.quiet)
            console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            customColor: customColorRaw
                ? core.base.parseCustomColor(customColorRaw)
                : null,
            enableAlpha: enableAlphaCheckbox.checked,
            limitDarkness: limitDarknessCheckbox.checked,
            limitGrayness: limitGraynessCheckbox.checked,
            limitLightness: limitLightnessCheckbox.checked
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to retrieve generateButton parameters: ${error}`);
        return null;
    }
}
function switchColorSpace(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        colorTextOutputBoxes.forEach(box => {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !core.validate.colorValues(colorValues)) {
                if (mode.errorLogs)
                    console.error('Invalid color values. Cannot display toast.');
                helpers.dom.showToast('Invalid color.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode.quiet)
                console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (mode.errorLogs)
                    console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                if (mode.errorLogs)
                    console.error('Cannot convert from XYZ to another color space.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (mode.errorLogs)
                    console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                if (mode.errorLogs)
                    console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            const newColor = core.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (mode.errorLogs)
                    console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        helpers.dom.showToast('Failed to convert colors.');
        if (!mode.quiet)
            console.log('Failed to convert colors.');
        else if (!mode.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (mode.errorLogs)
            console.error(`Failed to convert colors: ${error}`);
    }
}
export const dom = {
    genPaletteBox,
    getGenButtonArgs,
    switchColorSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFVckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUVyQyxLQUFLLFVBQVUsYUFBYSxDQUMzQixLQUFvQixFQUNwQixRQUFnQixFQUNoQixPQUFlO0lBRWYsSUFBSSxDQUFDO1FBQ0osTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUxRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakIsSUFBSSxJQUFJLENBQUMsU0FBUztnQkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFFOUQsT0FBTztRQUNSLENBQUM7UUFFRCxVQUFVLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUUxQixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUVuRCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUMsTUFBTSxLQUFLLEdBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxD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Q0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vc3VwZXJVdGlscy9kb20udHNcblxuaW1wb3J0IHtcblx0Q29sb3JJbnB1dEVsZW1lbnQsXG5cdENvbG9yU3BhY2UsXG5cdENvbW1vblN1cGVyVXRpbHNET00sXG5cdEdlbkJ1dHRvbkFyZ3MsXG5cdEhTTCxcblx0UGFsZXR0ZUl0ZW1cbn0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgSURCTWFuYWdlciB9IGZyb20gJy4uLy4uL2lkYi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9pbmRleC5qcyc7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gJy4uL3V0aWxzL2luZGV4LmpzJztcblxuY29uc3QgbW9kZSA9IGRhdGEubW9kZTtcbmNvbnN0IGlkYiA9IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuYXN5bmMgZnVuY3Rpb24gZ2VuUGFsZXR0ZUJveChcblx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdHRhYmxlSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZVJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWxldHRlLXJvdycpO1xuXG5cdFx0aWYgKCFwYWxldHRlUm93KSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoJ3BhbGV0dGVSb3cgaXMgdW5kZWZpbmVkLicpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJztcblxuXHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG5cdFx0aXRlbXMuc2xpY2UoMCwgbnVtQm94ZXMpLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdGNvbnN0IGNvbG9yOiBIU0wgPSB7IHZhbHVlOiBpdGVtLmNvbG9ycy5oc2wsIGZvcm1hdDogJ2hzbCcgfTtcblx0XHRcdGNvbnN0IHsgY29sb3JTdHJpcGUgfSA9IGhlbHBlcnMuZG9tLm1ha2VQYWxldHRlQm94KGNvbG9yLCBpICsgMSk7XG5cblx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGNvbG9yU3RyaXBlKTtcblxuXHRcdFx0dXRpbHMucGFsZXR0ZS5wb3B1bGF0ZU91dHB1dEJveChjb2xvciwgaSArIDEpO1xuXHRcdH0pO1xuXG5cdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdQYWxldHRlIGJveGVzIGdlbmVyYXRlZCBhbmQgcmVuZGVyZWQuJyk7XG5cblx0XHRhd2FpdCBpZGIuc2F2ZURhdGEoJ3RhYmxlcycsIHRhYmxlSWQsIHsgcGFsZXR0ZTogaXRlbXMgfSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyBwYWxldHRlIGJveDogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRHZW5CdXR0b25BcmdzKCk6IEdlbkJ1dHRvbkFyZ3MgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlTnVtYmVyT3B0aW9ucyA9IGRhdGEuY29uc3RzLmRvbS5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnMgPSBkYXRhLmNvbnN0cy5kb20ucGFsZXR0ZVR5cGVPcHRpb25zO1xuXHRcdGNvbnN0IGN1c3RvbUNvbG9yUmF3ID0gZGF0YS5jb25zdHMuZG9tLmN1c3RvbUNvbG9yRWxlbWVudD8udmFsdWU7XG5cdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9IGRhdGEuY29uc3RzLmRvbS5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGRhdGEuY29uc3RzLmRvbS5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID0gZGF0YS5jb25zdHMuZG9tLmxpbWl0R3JheW5lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID0gZGF0YS5jb25zdHMuZG9tLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRpZiAoXG5cdFx0XHRwYWxldHRlTnVtYmVyT3B0aW9ucyA9PT0gbnVsbCB8fFxuXHRcdFx0cGFsZXR0ZVR5cGVPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0R3JheW5lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCA9PT0gbnVsbFxuXHRcdCkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKCdPbmUgb3IgbW9yZSBlbGVtZW50cyBhcmUgbnVsbCcpO1xuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0YG51bUJveGVzOiAke3BhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCl9XFxucGFsZXR0ZVR5cGU6ICR7cGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCl9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRudW1Cb3hlczogcGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdHBhbGV0dGVUeXBlOiBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdGN1c3RvbUNvbG9yOiBjdXN0b21Db2xvclJhd1xuXHRcdFx0XHQ/IChjb3JlLmJhc2UucGFyc2VDdXN0b21Db2xvcihjdXN0b21Db2xvclJhdykgYXMgSFNMIHwgbnVsbClcblx0XHRcdFx0OiBudWxsLFxuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFya25lc3NDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRHcmF5bmVzczogbGltaXRHcmF5bmVzc0NoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogbGltaXRMaWdodG5lc3NDaGVja2JveC5jaGVja2VkXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIHJldHJpZXZlIGdlbmVyYXRlQnV0dG9uIHBhcmFtZXRlcnM6ICR7ZXJyb3J9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN3aXRjaENvbG9yU3BhY2UodGFyZ2V0Rm9ybWF0OiBDb2xvclNwYWNlKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ZXMgPVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHQpO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94ZXMuZm9yRWFjaChib3ggPT4ge1xuXHRcdFx0Y29uc3QgaW5wdXRCb3ggPSBib3ggYXMgQ29sb3JJbnB1dEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9IGlucHV0Qm94LmNvbG9yVmFsdWVzO1xuXG5cdFx0XHRpZiAoIWNvbG9yVmFsdWVzIHx8ICFjb3JlLnZhbGlkYXRlLmNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKSkge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4gQ2Fubm90IGRpc3BsYXkgdG9hc3QuJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VycmVudEZvcm1hdCA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZShcblx0XHRcdFx0J2RhdGEtZm9ybWF0J1xuXHRcdFx0KSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdGBDb252ZXJ0aW5nIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGNvbnZlcnRGbiA9IHV0aWxzLmNvbnZlcnNpb24uZ2V0Q29udmVyc2lvbkZuKFxuXHRcdFx0XHRjdXJyZW50Rm9ybWF0LFxuXHRcdFx0XHR0YXJnZXRGb3JtYXRcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbG9yVmFsdWVzLmZvcm1hdCA9PT0gJ3h5eicpIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBYWVogdG8gYW5vdGhlciBjb2xvciBzcGFjZS4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gdXRpbHMuY29sb3IubmFycm93VG9Db2xvcihjb2xvclZhbHVlcyk7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IWNsb25lZENvbG9yIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzU0xDb2xvcihjbG9uZWRDb2xvcikgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNTVkNvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1hZWihjbG9uZWRDb2xvcilcblx0XHRcdCkge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFNMLCBTViwgb3IgWFlaIGNvbG9yIHNwYWNlcy4gUGxlYXNlIGNvbnZlcnQgdG8gYSBzdXBwb3J0ZWQgZm9ybWF0IGZpcnN0Lidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbG9uZWRDb2xvcikge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmApO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBmYWlsZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdDb2xvciA9IGNvcmUuYmFzZS5jbG9uZShjb252ZXJ0Rm4oY2xvbmVkQ29sb3IpKTtcblxuXHRcdFx0aWYgKCFuZXdDb2xvcikge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmApO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBmYWlsZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnB1dEJveC52YWx1ZSA9IFN0cmluZyhuZXdDb2xvcik7XG5cblx0XHRcdGlucHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCB0YXJnZXRGb3JtYXQpO1xuXHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzLicpO1xuXG5cdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzLicpO1xuXHRcdGVsc2UgaWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY29udmVydCBjb2xvcnM6ICR7ZXJyb3IgYXMgRXJyb3J9YCk7XG5cdFx0ZWxzZSBpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY29udmVydCBjb2xvcnM6ICR7ZXJyb3IgYXMgRXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGRvbTogQ29tbW9uU3VwZXJVdGlsc0RPTSA9IHtcblx0Z2VuUGFsZXR0ZUJveCxcblx0Z2V0R2VuQnV0dG9uQXJncyxcblx0c3dpdGNoQ29sb3JTcGFjZVxufSBhcyBjb25zdDtcbiJdfQ==