// File: common/utils/palette.js
import { coreUtils } from '../core.js';
import { createLogger } from '../../logger/index.js';
import { helpers } from '../helpers/index.js';
import { modeData as mode } from '../../data/mode.js';
const logMode = mode.logging;
const thisModule = 'common/utils/palette.js';
const logger = await createLogger();
function createObject(type, items, swatches, paletteID, limitDark, limitGray, limitLight) {
    return {
        id: `${type}_${paletteID}`,
        items,
        metadata: {
            name: '',
            timestamp: coreUtils.getFormattedTimestamp(),
            swatches,
            type,
            flags: {
                limitDarkness: limitDark,
                limitGrayness: limitGray,
                limitLightness: limitLight
            },
            customColor: {
                colors: {
                    main: items[0]?.colors.main || {},
                    stringProps: items[0]?.colors.stringProps || {},
                    css: items[0]?.colors.css || {}
                }
            }
        }
    };
}
export async function populateOutputBox(color, boxNumber) {
    const thisMethod = 'populateOutputBox()';
    try {
        const clonedColor = coreUtils.guards.isColor(color)
            ? coreUtils.base.clone(color)
            : await coreUtils.convert.colorStringToColor(color);
        if (!coreUtils.validate.colorValues(clonedColor)) {
            if (logMode.error)
                logger.error('Invalid color values.', `${thisModule} > ${thisMethod}`);
            helpers.dom.showToast('Invalid color.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = await coreUtils.convert.colorToCSSColorString(clonedColor);
        if (!mode.quiet && logMode.info && logMode.verbosity > 0)
            logger.info(`Adding CSS-formatted color to DOM ${stringifiedColor}`, `${thisModule} > ${thisMethod}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Failed to populate color text output box: ${error}`, `${thisModule} > ${thisMethod}`);
        return;
    }
}
export const paletteUtils = {
    createObject,
    populateOutputBox
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQ0FBZ0M7QUFTaEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFdEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixNQUFNLFVBQVUsR0FBRyx5QkFBeUIsQ0FBQztBQUU3QyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLFNBQVMsWUFBWSxDQUNwQixJQUFZLEVBQ1osS0FBb0IsRUFDcEIsUUFBZ0IsRUFDaEIsU0FBaUIsRUFDakIsU0FBa0IsRUFDbEIsU0FBa0IsRUFDbEIsVUFBbUI7SUFFbkIsT0FBTztRQUNOLEVBQUUsRUFBRSxHQUFHLElBQUksSUFBSSxTQUFTLEVBQUU7UUFDMUIsS0FBSztRQUNMLFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxFQUFFO1lBQ1IsU0FBUyxFQUFFLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRTtZQUM1QyxRQUFRO1lBQ1IsSUFBSTtZQUNKLEtBQUssRUFBRTtnQkFDTixhQUFhLEVBQUUsU0FBUztnQkFDeEIsYUFBYSxFQUFFLFNBQVM7Z0JBQ3hCLGNBQWMsRUFBRSxVQUFVO2FBQzFCO1lBQ0QsV0FBVyxFQUFFO2dCQUNaLE1BQU0sRUFBRTtvQkFDUCxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtvQkFDakMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLEVBQUU7b0JBQy9DLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFO2lCQUMvQjthQUNEO1NBQ0Q7S0FDRCxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsaUJBQWlCLENBQ3RDLEtBQWdDLEVBQ2hDLFNBQWlCO0lBRWpCLE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDO0lBRXpDLElBQUksQ0FBQztRQUNKLE1BQU0sV0FBVyxHQUFVLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUN6RCxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7WUFDbEQsSUFBSSxPQUFPLENBQUMsS0FBSztnQkFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCx1QkFBdUIsRUFDdkIsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7WUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRXhDLE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNqRCx5QkFBeUIsU0FBUyxFQUFFLENBQ1QsQ0FBQztRQUU3QixJQUFJLENBQUMsa0JBQWtCO1lBQUUsT0FBTztRQUVoQyxNQUFNLGdCQUFnQixHQUNyQixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUM7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FDVixxQ0FBcUMsZ0JBQWdCLEVBQUUsRUFDdkQsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7UUFFSCxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7UUFDNUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSztZQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLDZDQUE2QyxLQUFLLEVBQUUsRUFDcEQsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7UUFFSCxPQUFPO0lBQ1IsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQWlEO0lBQ3pFLFlBQVk7SUFDWixpQkFBaUI7Q0FDUixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL3V0aWxzL3BhbGV0dGUuanNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yX1N0cmluZ1Byb3BzLFxuXHRDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVJdGVtXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4JztcbmltcG9ydCB7IGNvcmVVdGlscyB9IGZyb20gJy4uL2NvcmUuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IGhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi8uLi9kYXRhL21vZGUuanMnO1xuXG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ2NvbW1vbi91dGlscy9wYWxldHRlLmpzJztcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdChcblx0dHlwZTogc3RyaW5nLFxuXHRpdGVtczogUGFsZXR0ZUl0ZW1bXSxcblx0c3dhdGNoZXM6IG51bWJlcixcblx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdGxpbWl0RGFyazogYm9vbGVhbixcblx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRsaW1pdExpZ2h0OiBib29sZWFuXG4pOiBQYWxldHRlIHtcblx0cmV0dXJuIHtcblx0XHRpZDogYCR7dHlwZX1fJHtwYWxldHRlSUR9YCxcblx0XHRpdGVtcyxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0aW1lc3RhbXA6IGNvcmVVdGlscy5nZXRGb3JtYXR0ZWRUaW1lc3RhbXAoKSxcblx0XHRcdHN3YXRjaGVzLFxuXHRcdFx0dHlwZSxcblx0XHRcdGZsYWdzOiB7XG5cdFx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFyayxcblx0XHRcdFx0bGltaXRHcmF5bmVzczogbGltaXRHcmF5LFxuXHRcdFx0XHRsaW1pdExpZ2h0bmVzczogbGltaXRMaWdodFxuXHRcdFx0fSxcblx0XHRcdGN1c3RvbUNvbG9yOiB7XG5cdFx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRcdG1haW46IGl0ZW1zWzBdPy5jb2xvcnMubWFpbiB8fCB7fSxcblx0XHRcdFx0XHRzdHJpbmdQcm9wczogaXRlbXNbMF0/LmNvbG9ycy5zdHJpbmdQcm9wcyB8fCB7fSxcblx0XHRcdFx0XHRjc3M6IGl0ZW1zWzBdPy5jb2xvcnMuY3NzIHx8IHt9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwb3B1bGF0ZU91dHB1dEJveChcblx0Y29sb3I6IENvbG9yIHwgQ29sb3JfU3RyaW5nUHJvcHMsXG5cdGJveE51bWJlcjogbnVtYmVyXG4pOiBQcm9taXNlPHZvaWQ+IHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdwb3B1bGF0ZU91dHB1dEJveCgpJztcblxuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yOiBDb2xvciA9IGNvcmVVdGlscy5ndWFyZHMuaXNDb2xvcihjb2xvcilcblx0XHRcdD8gY29yZVV0aWxzLmJhc2UuY2xvbmUoY29sb3IpXG5cdFx0XHQ6IGF3YWl0IGNvcmVVdGlscy5jb252ZXJ0LmNvbG9yU3RyaW5nVG9Db2xvcihjb2xvcik7XG5cblx0XHRpZiAoIWNvcmVVdGlscy52YWxpZGF0ZS5jb2xvclZhbHVlcyhjbG9uZWRDb2xvcikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0J0ludmFsaWQgY29sb3IgdmFsdWVzLicsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtib3hOdW1iZXJ9YFxuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yVGV4dE91dHB1dEJveCkgcmV0dXJuO1xuXG5cdFx0Y29uc3Qgc3RyaW5naWZpZWRDb2xvciA9XG5cdFx0XHRhd2FpdCBjb3JlVXRpbHMuY29udmVydC5jb2xvclRvQ1NTQ29sb3JTdHJpbmcoY2xvbmVkQ29sb3IpO1xuXG5cdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDApXG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0YEFkZGluZyBDU1MtZm9ybWF0dGVkIGNvbG9yIHRvIERPTSAke3N0cmluZ2lmaWVkQ29sb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveC52YWx1ZSA9IHN0cmluZ2lmaWVkQ29sb3I7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCBjb2xvci5mb3JtYXQpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIHBvcHVsYXRlIGNvbG9yIHRleHQgb3V0cHV0IGJveDogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBwYWxldHRlVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsndXRpbHMnXVsncGFsZXR0ZSddID0ge1xuXHRjcmVhdGVPYmplY3QsXG5cdHBvcHVsYXRlT3V0cHV0Qm94XG59IGFzIGNvbnN0O1xuIl19