// File: src/common/superUtils/dom.ts
import { config } from '../../config';
import { core } from '../core';
import { helpers } from '../helpers';
import { idb } from '../../idb';
import { utils } from '../utils';
const mode = config.mode;
async function genPaletteBox(items, numBoxes, tableId) {
    try {
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            if (mode.logErrors)
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
        if (mode.logErrors)
            console.error(`Error generating palette box: ${error}`);
    }
}
function getGenButtonParams() {
    try {
        const paletteNumberOptions = config.consts.dom.paletteNumberOptions;
        const paletteTypeOptions = config.consts.dom.paletteTypeOptions;
        const customColorRaw = config.consts.dom.customColorElement?.value;
        const enableAlphaCheckbox = config.consts.dom.enableAlphaCheckbox;
        const limitDarknessCheckbox = config.consts.dom.limitDarknessCheckbox;
        const limitGraynessCheckbox = config.consts.dom.limitGraynessCheckbox;
        const limitLightnessCheckbox = config.consts.dom.limitLightnessCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitDarknessCheckbox === null ||
            limitGraynessCheckbox === null ||
            limitLightnessCheckbox === null) {
            if (mode.logErrors)
                console.error('One or more elements are null');
            return null;
        }
        if (!mode.quiet)
            console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            customColor: customColorRaw
                ? core.parseCustomColor(customColorRaw)
                : null,
            enableAlpha: enableAlphaCheckbox.checked,
            limitDarkness: limitDarknessCheckbox.checked,
            limitGrayness: limitGraynessCheckbox.checked,
            limitLightness: limitLightnessCheckbox.checked
        };
    }
    catch (error) {
        if (mode.logErrors)
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
            if (!colorValues || !core.validateColorValues(colorValues)) {
                if (mode.logErrors)
                    console.error('Invalid color values. Cannot display toast.');
                helpers.dom.showToast('Invalid color.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode.quiet)
                console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (mode.logErrors)
                    console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                if (mode.logErrors)
                    console.error('Cannot convert from XYZ to another color space.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (mode.logErrors)
                    console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                if (mode.logErrors)
                    console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            const newColor = core.clone(convertFn(clonedColor));
            if (!newColor) {
                if (mode.logErrors)
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
        else if (mode.logErrors)
            console.error(`Failed to convert colors: ${error}`);
    }
}
export const dom = {
    genPaletteBox,
    getGenButtonParams,
    switchColorSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFTckMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNoQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWpDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFFekIsS0FBSyxVQUFVLGFBQWEsQ0FDM0IsS0FBb0IsRUFDcEIsUUFBZ0IsRUFDaEIsT0FBZTtJQUVmLElBQUksQ0FBQztRQUNKLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2pCLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBRTlELE9BQU87UUFDUixDQUFDO1FBRUQsVUFBVSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFMUIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFbkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLE1BQU0sS0FBSyxHQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUM3RCxN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QUU1QyxPQUFPO1lBQ1IsQ0FBQztZQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFFcEQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNmLElBQUksSUFBSSxDQUFDLFNBQVM7b0JBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLFlBQVksVUFBVSxDQUFDLENBQUM7Z0JBRXhELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBRTVDLE9BQU87WUFDUixDQUFDO1lBRUQsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFbEMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBRW5ELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQzthQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsS0FBYyxFQUFFLENBQUMsQ0FBQzthQUMzRCxJQUFJLElBQUksQ0FBQyxTQUFTO1lBQ3RCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEtBQWMsRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUc7SUFDbEIsYUFBYTtJQUNiLGtCQUFrQjtJQUNsQixnQkFBZ0I7Q0FDUCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50c1xuXG5pbXBvcnQge1xuXHRDb2xvcklucHV0RWxlbWVudCxcblx0Q29sb3JTcGFjZSxcblx0R2VuQnV0dG9uUGFyYW1zLFxuXHRIU0wsXG5cdFBhbGV0dGVJdGVtXG59IGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgeyBpZGIgfSBmcm9tICcuLi8uLi9pZGInO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuLi91dGlscyc7XG5cbmNvbnN0IG1vZGUgPSBjb25maWcubW9kZTtcblxuYXN5bmMgZnVuY3Rpb24gZ2VuUGFsZXR0ZUJveChcblx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdHRhYmxlSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZVJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWxldHRlLXJvdycpO1xuXG5cdFx0aWYgKCFwYWxldHRlUm93KSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoJ3BhbGV0dGVSb3cgaXMgdW5kZWZpbmVkLicpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJztcblxuXHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG5cdFx0aXRlbXMuc2xpY2UoMCwgbnVtQm94ZXMpLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdGNvbnN0IGNvbG9yOiBIU0wgPSB7IHZhbHVlOiBpdGVtLmNvbG9ycy5oc2wsIGZvcm1hdDogJ2hzbCcgfTtcblx0XHRcdGNvbnN0IHsgY29sb3JTdHJpcGUgfSA9IGhlbHBlcnMuZG9tLm1ha2VQYWxldHRlQm94KGNvbG9yLCBpICsgMSk7XG5cblx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGNvbG9yU3RyaXBlKTtcblxuXHRcdFx0dXRpbHMucGFsZXR0ZS5wb3B1bGF0ZU91dHB1dEJveChjb2xvciwgaSArIDEpO1xuXHRcdH0pO1xuXG5cdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdQYWxldHRlIGJveGVzIGdlbmVyYXRlZCBhbmQgcmVuZGVyZWQuJyk7XG5cblx0XHRhd2FpdCBpZGIuc2F2ZURhdGEoJ3RhYmxlcycsIHRhYmxlSWQsIHsgcGFsZXR0ZTogaXRlbXMgfSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyBwYWxldHRlIGJveDogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRHZW5CdXR0b25QYXJhbXMoKTogR2VuQnV0dG9uUGFyYW1zIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPSBjb25maWcuY29uc3RzLmRvbS5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnMgPSBjb25maWcuY29uc3RzLmRvbS5wYWxldHRlVHlwZU9wdGlvbnM7XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3JSYXcgPSBjb25maWcuY29uc3RzLmRvbS5jdXN0b21Db2xvckVsZW1lbnQ/LnZhbHVlO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRpZiAoXG5cdFx0XHRwYWxldHRlTnVtYmVyT3B0aW9ucyA9PT0gbnVsbCB8fFxuXHRcdFx0cGFsZXR0ZVR5cGVPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0R3JheW5lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCA9PT0gbnVsbFxuXHRcdCkge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKCdPbmUgb3IgbW9yZSBlbGVtZW50cyBhcmUgbnVsbCcpO1xuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0YG51bUJveGVzOiAke3BhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCl9XFxucGFsZXR0ZVR5cGU6ICR7cGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCl9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRudW1Cb3hlczogcGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdHBhbGV0dGVUeXBlOiBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdGN1c3RvbUNvbG9yOiBjdXN0b21Db2xvclJhd1xuXHRcdFx0XHQ/IChjb3JlLnBhcnNlQ3VzdG9tQ29sb3IoY3VzdG9tQ29sb3JSYXcpIGFzIEhTTCB8IG51bGwpXG5cdFx0XHRcdDogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYUNoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmtuZXNzQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3guY2hlY2tlZFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOiAke2Vycm9yfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hDb2xvclNwYWNlKHRhcmdldEZvcm1hdDogQ29sb3JTcGFjZSk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveGVzID1cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdCcuY29sb3ItdGV4dC1vdXRwdXQtYm94J1xuXHRcdFx0KTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveGVzLmZvckVhY2goYm94ID0+IHtcblx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIENvbG9ySW5wdXRFbGVtZW50O1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSBpbnB1dEJveC5jb2xvclZhbHVlcztcblxuXHRcdFx0aWYgKCFjb2xvclZhbHVlcyB8fCAhY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKSkge1xuXHRcdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4gQ2Fubm90IGRpc3BsYXkgdG9hc3QuJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VycmVudEZvcm1hdCA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZShcblx0XHRcdFx0J2RhdGEtZm9ybWF0J1xuXHRcdFx0KSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdGBDb252ZXJ0aW5nIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGNvbnZlcnRGbiA9IHV0aWxzLmNvbnZlcnNpb24uZ2V0Q29udmVyc2lvbkZuKFxuXHRcdFx0XHRjdXJyZW50Rm9ybWF0LFxuXHRcdFx0XHR0YXJnZXRGb3JtYXRcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbG9yVmFsdWVzLmZvcm1hdCA9PT0gJ3h5eicpIHtcblx0XHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBYWVogdG8gYW5vdGhlciBjb2xvciBzcGFjZS4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gdXRpbHMuY29sb3IubmFycm93VG9Db2xvcihjb2xvclZhbHVlcyk7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IWNsb25lZENvbG9yIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzU0xDb2xvcihjbG9uZWRDb2xvcikgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNTVkNvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1hZWihjbG9uZWRDb2xvcilcblx0XHRcdCkge1xuXHRcdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFNMLCBTViwgb3IgWFlaIGNvbG9yIHNwYWNlcy4gUGxlYXNlIGNvbnZlcnQgdG8gYSBzdXBwb3J0ZWQgZm9ybWF0IGZpcnN0Lidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbG9uZWRDb2xvcikge1xuXHRcdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmApO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBmYWlsZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdDb2xvciA9IGNvcmUuY2xvbmUoY29udmVydEZuKGNsb25lZENvbG9yKSk7XG5cblx0XHRcdGlmICghbmV3Q29sb3IpIHtcblx0XHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gKTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gZmFpbGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aW5wdXRCb3gudmFsdWUgPSBTdHJpbmcobmV3Q29sb3IpO1xuXG5cdFx0XHRpbnB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdGFyZ2V0Rm9ybWF0KTtcblx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nKTtcblx0XHRlbHNlIGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHRcdGVsc2UgaWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkb20gPSB7XG5cdGdlblBhbGV0dGVCb3gsXG5cdGdldEdlbkJ1dHRvblBhcmFtcyxcblx0c3dpdGNoQ29sb3JTcGFjZVxufSBhcyBjb25zdDtcbiJdfQ==