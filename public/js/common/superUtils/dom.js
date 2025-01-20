// File: src/common/superUtils/dom.js
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { logger } from '../../logger/index.js';
import { utils } from '../utils/index.js';
const mode = data.mode;
const logMode = data.mode.logging;
function getGenButtonArgs() {
    try {
        const paletteNumberOptions = data.consts.dom.elements.paletteNumberOptions;
        const paletteTypeOptions = data.consts.dom.elements.paletteTypeOptions;
        const customColorRaw = data.consts.dom.elements.customColorInput?.value;
        const enableAlphaCheckbox = data.consts.dom.elements.enableAlphaCheckbox;
        const limitDarknessCheckbox = data.consts.dom.elements.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.elements.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.elements.limitLightnessCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitDarknessCheckbox === null ||
            limitGraynessCheckbox === null ||
            limitLightnessCheckbox === null) {
            if (logMode.errors)
                logger.error('One or more elements are null');
            return null;
        }
        if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
            logger.info(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
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
        if (logMode.errors)
            logger.error(`Failed to retrieve generateButton parameters: ${error}`);
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
                if (logMode.errors)
                    logger.error('Invalid color values. Cannot display toast.');
                helpers.dom.showToast('Invalid color.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
                logger.info(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (logMode.errors)
                    logger.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                if (logMode.errors)
                    logger.error('Cannot convert from XYZ to another color space.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (logMode.verbosity >= 3 && logMode.errors)
                    logger.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                if (logMode.errors)
                    logger.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            const newColor = core.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (logMode.errors)
                    logger.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        helpers.dom.showToast('Failed to convert colors.');
        if (!mode.quiet && logMode.warnings)
            logger.warning('Failed to convert colors.');
        else if (!mode.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (logMode.errors)
            logger.error(`Failed to convert colors: ${error}`);
    }
}
export const dom = {
    getGenButtonArgs,
    switchColorSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFTckMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRWxDLFNBQVMsZ0JBQWdCO0lBQ3hCLElBQUksQ0FBQztRQUNKLE1BQU0sb0JBQW9CLEdBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztRQUMvQyxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztRQUN2RSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO1FBQ3hFLE1BQU0sbUJBQW1CLEdBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztRQUM5QyxNQUFNLHFCQUFxQixHQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUM7UUFDaEQsTUFBTSxxQkFBcUIsR0FDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDO1FBQ2hELE1BQU0sc0JBQXNCLEdBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQztRQUVqRCxJQUNDLG9CQUFvQixLQUFLLElBQUk7WUFDN0Isa0JBQWtCLEtBQUssSUFBSTtZQUMzQixtQkFBbUIsS0FBSyxJQUFJO1lBQzVCLHFCQUFxQixLQUFLLElBQUk7WUFDOUIscUJBQXFCLEtBQUssSUFBSTtZQUM5QixzQkFBc0IsS0FBSyxJQUFJLEVBQzlCLENBQUM7WUFDRixJQUFJLE9BQU8sQ0FBQyxNQUFNO2dCQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUVsRSxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQztZQUN4RCxNQUFNLENBQUMsSUFBSSxDQUNWLGFBQWEsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsa0JBQWtCLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FDL0csQ0FBQztRQUVILE9BQU87WUFDTixRQUFRLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDbEQsV0FBVyxFQUFFLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQ25ELFdBQVcsRUFBRSxjQUFjO2dCQUMxQixDQUFDLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQWdCO2dCQUM1RCxDQUFDLENBQUMsSUFBSTtZQUNQLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQyxPQUFPO1lBQ3hDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxPQUFPO1lBQzVDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxPQUFPO1lBQzVDLGNBQWMsRUFBRSxzQkFBc0IsQ0FBQyxPQUFPO1NBQzlDLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLE9BQU8sQ0FBQyxNQUFNO1lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsaURBQWlELEtBQUssRUFBRSxDQUN4RCxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsWUFBd0I7SUFDakQsSUFBSSxDQUFDO1FBQ0osTUFBTSxvQkFBb0IsR0FDekIsUUFBUSxDQUFDLGdCQUFnQixDQUN4Qix3QkFBd0IsQ0FDeEIsQ0FBQztRQUVILG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNsQyxNQUFNLFFBQVEsR0FBRyxHQUF3QixDQUFDO1lBQzFDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFFekMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7Z0JBQzdELElBQUksT0FBTyxDQUFDLE1BQU07b0JBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztnQkFFN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFeEMsT0FBTztZQUNSLENBQUM7WUFFRCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUMxQyxhQUFhLENBQ0MsQ0FBQztZQUVoQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQztnQkFDeEQsTUFBTSxDQUFDLElBQUksQ0FDVixtQkFBbUIsYUFBYSxPQUFPLFlBQVksRUFBRSxDQUNyRCxDQUFDO1lBRUgsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQ2pELGFBQWEsRUFDYixZQUFZLENBQ1osQ0FBQztZQUVGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxPQUFPLENBQUMsTUFBTTtvQkFDakIsTUFBTSxDQUFDLEtBQUssQ0FDWCxtQkFBbUIsYUFBYSxPQUFPLFlBQVksb0JBQW9CLENBQ3ZFLENBQUM7Z0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFFbkQsT0FBTztZQUNSLENBQUM7WUFFRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFLENBQUM7Z0JBQ2xDLElBQUksT0FBTyxDQUFDLE1BQU07b0JBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsaURBQWlELENBQ2pELENBQUM7Z0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFFbkQsT0FBTztZQUNSLENBQUM7WUFFRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUzRCxJQUNDLENBQUMsV0FBVztnQkFDWixLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQzdCLENBQUM7Z0JBQ0YsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTTtvQkFDM0MsTUFBTSxDQUFDLEtBQUssQ0FDWCw4RkFBOEYsQ0FDOUYsQ0FBQztnQkFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2dCQUVuRCxPQUFPO1lBQ1IsQ0FBQztZQUVELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxPQUFPLENBQUMsTUFBTTtvQkFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsWUFBWSxVQUFVLENBQUMsQ0FBQztnQkFFdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFFNUMsT0FBTztZQUNSLENBQUM7WUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUV6RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxPQUFPLENBQUMsTUFBTTtvQkFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsWUFBWSxVQUFVLENBQUMsQ0FBQztnQkFFdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFFNUMsT0FBTztZQUNSLENBQUM7WUFFRCxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLFFBQVE7WUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFjLEVBQUUsQ0FBQyxDQUFDO2FBQzNELElBQUksT0FBTyxDQUFDLE1BQU07WUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsS0FBYyxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBd0I7SUFDdkMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtDQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29tbW9uL3N1cGVyVXRpbHMvZG9tLmpzXG5cbmltcG9ydCB7XG5cdENvbG9ySW5wdXRFbGVtZW50LFxuXHRDb2xvclNwYWNlLFxuXHRDb21tb25TdXBlclV0aWxzRE9NLFxuXHRHZW5CdXR0b25BcmdzLFxuXHRIU0xcbn0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgaGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IHV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvaW5kZXguanMnO1xuXG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgbG9nTW9kZSA9IGRhdGEubW9kZS5sb2dnaW5nO1xuXG5mdW5jdGlvbiBnZXRHZW5CdXR0b25BcmdzKCk6IEdlbkJ1dHRvbkFyZ3MgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlTnVtYmVyT3B0aW9ucyA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMucGFsZXR0ZU51bWJlck9wdGlvbnM7XG5cdFx0Y29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnBhbGV0dGVUeXBlT3B0aW9ucztcblx0XHRjb25zdCBjdXN0b21Db2xvclJhdyA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5jdXN0b21Db2xvcklucHV0Py52YWx1ZTtcblx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXREYXJrbmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0R3JheW5lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRpZiAoXG5cdFx0XHRwYWxldHRlTnVtYmVyT3B0aW9ucyA9PT0gbnVsbCB8fFxuXHRcdFx0cGFsZXR0ZVR5cGVPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0R3JheW5lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCA9PT0gbnVsbFxuXHRcdCkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSBsb2dnZXIuZXJyb3IoJ09uZSBvciBtb3JlIGVsZW1lbnRzIGFyZSBudWxsJyk7XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPj0gMilcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgbnVtQm94ZXM6ICR7cGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKX1cXG5wYWxldHRlVHlwZTogJHtwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKX1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG51bUJveGVzOiBwYXJzZUludChwYWxldHRlTnVtYmVyT3B0aW9ucy52YWx1ZSwgMTApLFxuXHRcdFx0cGFsZXR0ZVR5cGU6IHBhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IGN1c3RvbUNvbG9yUmF3XG5cdFx0XHRcdD8gKGNvcmUuYmFzZS5wYXJzZUN1c3RvbUNvbG9yKGN1c3RvbUNvbG9yUmF3KSBhcyBIU0wgfCBudWxsKVxuXHRcdFx0XHQ6IG51bGwsXG5cdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXREYXJrbmVzczogbGltaXREYXJrbmVzc0NoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiBsaW1pdEdyYXluZXNzQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0bmVzc0NoZWNrYm94LmNoZWNrZWRcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOiAke2Vycm9yfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hDb2xvclNwYWNlKHRhcmdldEZvcm1hdDogQ29sb3JTcGFjZSk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveGVzID1cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdCcuY29sb3ItdGV4dC1vdXRwdXQtYm94J1xuXHRcdFx0KTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveGVzLmZvckVhY2goYm94ID0+IHtcblx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIENvbG9ySW5wdXRFbGVtZW50O1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSBpbnB1dEJveC5jb2xvclZhbHVlcztcblxuXHRcdFx0aWYgKCFjb2xvclZhbHVlcyB8fCAhY29yZS52YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvclZhbHVlcykpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcignSW52YWxpZCBjb2xvciB2YWx1ZXMuIENhbm5vdCBkaXNwbGF5IHRvYXN0LicpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvci4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRGb3JtYXQgPSBpbnB1dEJveC5nZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdCdkYXRhLWZvcm1hdCdcblx0XHRcdCkgYXMgQ29sb3JTcGFjZTtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+PSAyKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgQ29udmVydGluZyBmcm9tICR7Y3VycmVudEZvcm1hdH0gdG8gJHt0YXJnZXRGb3JtYXR9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRjb25zdCBjb252ZXJ0Rm4gPSB1dGlscy5jb252ZXJzaW9uLmdldENvbnZlcnNpb25Gbihcblx0XHRcdFx0Y3VycmVudEZvcm1hdCxcblx0XHRcdFx0dGFyZ2V0Rm9ybWF0XG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIWNvbnZlcnRGbikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbG9yVmFsdWVzLmZvcm1hdCA9PT0gJ3h5eicpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFhZWiB0byBhbm90aGVyIGNvbG9yIHNwYWNlLidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSB1dGlscy5jb2xvci5uYXJyb3dUb0NvbG9yKGNvbG9yVmFsdWVzKTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQhY2xvbmVkQ29sb3IgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNTTENvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1NWQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzWFlaKGNsb25lZENvbG9yKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLnZlcmJvc2l0eSA+PSAzICYmIGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFNMLCBTViwgb3IgWFlaIGNvbG9yIHNwYWNlcy4gUGxlYXNlIGNvbnZlcnQgdG8gYSBzdXBwb3J0ZWQgZm9ybWF0IGZpcnN0Lidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbG9uZWRDb2xvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gY29yZS5iYXNlLmNsb25lKGNvbnZlcnRGbihjbG9uZWRDb2xvcikpO1xuXG5cdFx0XHRpZiAoIW5ld0NvbG9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoYENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gKTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gZmFpbGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aW5wdXRCb3gudmFsdWUgPSBTdHJpbmcobmV3Q29sb3IpO1xuXG5cdFx0XHRpbnB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdGFyZ2V0Rm9ybWF0KTtcblx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm5pbmdzKVxuXHRcdFx0bG9nZ2VyLndhcm5pbmcoJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nKTtcblx0XHRlbHNlIGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHRcdGVsc2UgaWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0bG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gY29udmVydCBjb2xvcnM6ICR7ZXJyb3IgYXMgRXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGRvbTogQ29tbW9uU3VwZXJVdGlsc0RPTSA9IHtcblx0Z2V0R2VuQnV0dG9uQXJncyxcblx0c3dpdGNoQ29sb3JTcGFjZVxufSBhcyBjb25zdDtcbiJdfQ==