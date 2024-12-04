// File: src/common/utils/dom.ts
import { idb } from '../../idb.js';
import { helpers } from '../helpers.js';
import { palette } from './palette.js';
import { config } from '../../config.js';
import { core } from '../core.js';
async function genPaletteBox(items, numBoxes, tableId) {
    try {
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            console.error('paletteRow is undefined.');
            return;
        }
        paletteRow.innerHTML = '';
        const fragment = document.createDocumentFragment();
        items.slice(0, numBoxes).forEach((item, i) => {
            const color = { value: item.colors.hsl, format: 'hsl' };
            const { colorStripe } = helpers.dom.makePaletteBox(color, i + 1);
            fragment.appendChild(colorStripe);
            palette.populateOutputBox(color, i + 1);
        });
        paletteRow.appendChild(fragment);
        console.log('Palette boxes generated and rendered.');
        await idb.saveData('tables', tableId, { palette: items });
    }
    catch (error) {
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
            console.error('One or more elements are null');
            return null;
        }
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
        console.error('Failed to retrieve generateButton parameters:', error);
        return null;
    }
}
export const dom = { genPaletteBox, getGenButtonParams };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi91dGlscy9kb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0NBQWdDO0FBR2hDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUUvQixLQUFLLFVBQVUsYUFBYSxDQUMzQixLQUFvQixFQUNwQixRQUFnQixFQUNoQixPQUFlO0lBRWYsSUFBSSxDQUFDO1FBQ0osTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUxRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQzFDLE9BQU87UUFDUixDQUFDO1FBRUQsVUFBVSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFMUIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFbkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLE1BQU0sS0FBSyxHQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUM3RCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsR0FB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QUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9kb20udHNcblxuaW1wb3J0IHsgR2VuQnV0dG9uUGFyYW1zLCBIU0wsIFBhbGV0dGVJdGVtIH0gZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IHsgaWRiIH0gZnJvbSAnLi4vLi4vaWRiJztcbmltcG9ydCB7IGhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7IHBhbGV0dGUgfSBmcm9tICcuL3BhbGV0dGUnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7IGNvcmUgfSBmcm9tICcuLi9jb3JlJztcblxuYXN5bmMgZnVuY3Rpb24gZ2VuUGFsZXR0ZUJveChcblx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdHRhYmxlSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZVJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWxldHRlLXJvdycpO1xuXG5cdFx0aWYgKCFwYWxldHRlUm93KSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdwYWxldHRlUm93IGlzIHVuZGVmaW5lZC4nKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRwYWxldHRlUm93LmlubmVySFRNTCA9ICcnO1xuXG5cdFx0Y29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cblx0XHRpdGVtcy5zbGljZSgwLCBudW1Cb3hlcykuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0Y29uc3QgY29sb3I6IEhTTCA9IHsgdmFsdWU6IGl0ZW0uY29sb3JzLmhzbCwgZm9ybWF0OiAnaHNsJyB9O1xuXHRcdFx0Y29uc3QgeyBjb2xvclN0cmlwZSB9ID0gaGVscGVycy5kb20ubWFrZVBhbGV0dGVCb3goY29sb3IsIGkgKyAxKTtcblxuXHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY29sb3JTdHJpcGUpO1xuXG5cdFx0XHRwYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KGNvbG9yLCBpICsgMSk7XG5cdFx0fSk7XG5cblx0XHRwYWxldHRlUm93LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuXHRcdGNvbnNvbGUubG9nKCdQYWxldHRlIGJveGVzIGdlbmVyYXRlZCBhbmQgcmVuZGVyZWQuJyk7XG5cblx0XHRhd2FpdCBpZGIuc2F2ZURhdGEoJ3RhYmxlcycsIHRhYmxlSWQsIHsgcGFsZXR0ZTogaXRlbXMgfSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyBwYWxldHRlIGJveDogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRHZW5CdXR0b25QYXJhbXMoKTogR2VuQnV0dG9uUGFyYW1zIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPSBjb25maWcuY29uc3RzLmRvbS5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnMgPSBjb25maWcuY29uc3RzLmRvbS5wYWxldHRlVHlwZU9wdGlvbnM7XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3JSYXcgPSBjb25maWcuY29uc3RzLmRvbS5jdXN0b21Db2xvckVsZW1lbnQ/LnZhbHVlO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRpZiAoXG5cdFx0XHRwYWxldHRlTnVtYmVyT3B0aW9ucyA9PT0gbnVsbCB8fFxuXHRcdFx0cGFsZXR0ZVR5cGVPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0R3JheW5lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCA9PT0gbnVsbFxuXHRcdCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignT25lIG9yIG1vcmUgZWxlbWVudHMgYXJlIG51bGwnKTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgbnVtQm94ZXM6ICR7cGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKX1cXG5wYWxldHRlVHlwZTogJHtwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKX1gXG5cdFx0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRudW1Cb3hlczogcGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdHBhbGV0dGVUeXBlOiBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdGN1c3RvbUNvbG9yOiBjdXN0b21Db2xvclJhd1xuXHRcdFx0XHQ/IChjb3JlLnBhcnNlQ3VzdG9tQ29sb3IoY3VzdG9tQ29sb3JSYXcpIGFzIEhTTCB8IG51bGwpXG5cdFx0XHRcdDogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYUNoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmtuZXNzQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3guY2hlY2tlZFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIGdlbmVyYXRlQnV0dG9uIHBhcmFtZXRlcnM6JywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGRvbSA9IHsgZ2VuUGFsZXR0ZUJveCwgZ2V0R2VuQnV0dG9uUGFyYW1zIH07XG4iXX0=