// File: common/superUtils.js
import { coreUtils } from './core.js';
import { createLogger } from '../logger/index.js';
import { domData } from '../data/dom.js';
import { helpers } from './helpers/index.js';
import { modeData as mode } from '../data/mode.js';
import { utils } from './utils/index.js';
const domInputElements = domData.elements.inputs;
const logMode = mode.logging;
const thisModule = 'common/superUtils/dom.js';
const logger = await createLogger();
function getGenButtonArgs() {
    const thisMethod = 'getGenButtonArgs()';
    try {
        const paletteNumberOptions = domInputElements.paletteNumberOptions;
        const paletteTypeOptions = domInputElements.paletteTypeOptions;
        const customColorRaw = domInputElements.customColorInput?.value;
        const enableAlphaCheckbox = domInputElements.enableAlphaCheckbox;
        const limitDarknessCheckbox = domInputElements.limitDarknessCheckbox;
        const limitGraynessCheckbox = domInputElements.limitGraynessCheckbox;
        const limitLightnessCheckbox = domInputElements.limitLightnessCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitDarknessCheckbox === null ||
            limitGraynessCheckbox === null ||
            limitLightnessCheckbox === null) {
            if (logMode.error)
                logger.error('One or more elements are null', `${thisModule} > ${thisMethod}`);
            return null;
        }
        if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
            logger.info(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`, `${thisModule} > ${thisMethod}`);
        return {
            swatches: parseInt(paletteNumberOptions.value, 10),
            type: parseInt(paletteTypeOptions.value, 10),
            customColor: customColorRaw
                ? coreUtils.base.parseCustomColor(customColorRaw)
                : null,
            enableAlpha: enableAlphaCheckbox.checked,
            limitDark: limitDarknessCheckbox.checked,
            limitGray: limitGraynessCheckbox.checked,
            limitLight: limitLightnessCheckbox.checked
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Failed to retrieve generateButton parameters: ${error}`, `${thisModule} > ${thisMethod}`);
        return null;
    }
}
async function switchColorSpace(targetFormat) {
    const thisMethod = 'switchColorSpace()';
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        for (const box of colorTextOutputBoxes) {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !coreUtils.validate.colorValues(colorValues)) {
                if (logMode.error)
                    logger.error('Invalid color values. Cannot display toast.', `${thisModule} > ${thisMethod}`);
                helpers.dom.showToast('Invalid color.');
                continue;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
                logger.info(`Converting from ${currentFormat} to ${targetFormat}`, `${thisModule} > ${thisMethod}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (logMode.error)
                    logger.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`, `${thisModule} > ${thisMethod}`);
                helpers.dom.showToast('Conversion not supported.');
                continue;
            }
            if (colorValues.format === 'xyz') {
                if (logMode.error)
                    logger.error('Cannot convert from XYZ to another color space.', `${thisModule} > ${thisMethod}`);
                helpers.dom.showToast('Conversion not supported.');
                continue;
            }
            const clonedColor = await utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (logMode.verbosity >= 3 && logMode.error)
                    logger.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.', `${thisModule} > ${thisMethod}`);
                helpers.dom.showToast('Conversion not supported.');
                continue;
            }
            if (!clonedColor) {
                if (logMode.error)
                    logger.error(`Conversion to ${targetFormat} failed.`, `${thisModule} > ${thisMethod}`);
                helpers.dom.showToast('Conversion failed.');
                continue;
            }
            const newColor = coreUtils.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (logMode.error)
                    logger.error(`Conversion to ${targetFormat} failed.`, `${thisModule} > ${thisMethod}`);
                helpers.dom.showToast('Conversion failed.');
                continue;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        }
    }
    catch (error) {
        helpers.dom.showToast('Failed to convert colors.');
        if (!mode.quiet && logMode.warn)
            logger.warn('Failed to convert colors.', `${thisModule} > ${thisMethod}`);
        else if (!mode.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (logMode.error)
            logger.error(`Failed to convert colors: ${error}`);
    }
}
export const superUtils = {
    dom: {
        getGenButtonArgs,
        switchColorSpace
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJVdGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3VwZXJVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2QkFBNkI7QUFTN0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN0QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUV6QyxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ2pELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFN0IsTUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQUM7QUFFOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxTQUFTLGdCQUFnQjtJQUN4QixNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUV4QyxJQUFJLENBQUM7UUFDSixNQUFNLG9CQUFvQixHQUFHLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO1FBQ25FLE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7UUFDL0QsTUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO1FBQ2hFLE1BQU0sbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUM7UUFDakUsTUFBTSxxQkFBcUIsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQztRQUNyRSxNQUFNLHFCQUFxQixHQUFH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QUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUk7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FDViwyQkFBMkIsRUFDM0IsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7YUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsS0FBYyxFQUFFLENBQUMsQ0FBQzthQUMzRCxJQUFJLE9BQU8sQ0FBQyxLQUFLO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEtBQWMsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQTJDO0lBQ2pFLEdBQUcsRUFBRTtRQUNKLGdCQUFnQjtRQUNoQixnQkFBZ0I7S0FDaEI7Q0FDUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL3N1cGVyVXRpbHMuanNcblxuaW1wb3J0IHtcblx0Q29sb3JJbnB1dEVsZW1lbnQsXG5cdENvbG9yU3BhY2UsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0R2VuUGFsZXR0ZUFyZ3MsXG5cdEhTTFxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlVXRpbHMgfSBmcm9tICcuL2NvcmUuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IGRvbURhdGEgfSBmcm9tICcuLi9kYXRhL2RvbS5qcyc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi9oZWxwZXJzL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi9kYXRhL21vZGUuanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuL3V0aWxzL2luZGV4LmpzJztcblxuY29uc3QgZG9tSW5wdXRFbGVtZW50cyA9IGRvbURhdGEuZWxlbWVudHMuaW5wdXRzO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuY29uc3QgdGhpc01vZHVsZSA9ICdjb21tb24vc3VwZXJVdGlscy9kb20uanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZnVuY3Rpb24gZ2V0R2VuQnV0dG9uQXJncygpOiBHZW5QYWxldHRlQXJncyB8IG51bGwge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2dldEdlbkJ1dHRvbkFyZ3MoKSc7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlTnVtYmVyT3B0aW9ucyA9IGRvbUlucHV0RWxlbWVudHMucGFsZXR0ZU51bWJlck9wdGlvbnM7XG5cdFx0Y29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zID0gZG9tSW5wdXRFbGVtZW50cy5wYWxldHRlVHlwZU9wdGlvbnM7XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3JSYXcgPSBkb21JbnB1dEVsZW1lbnRzLmN1c3RvbUNvbG9ySW5wdXQ/LnZhbHVlO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBkb21JbnB1dEVsZW1lbnRzLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID0gZG9tSW5wdXRFbGVtZW50cy5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID0gZG9tSW5wdXRFbGVtZW50cy5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9IGRvbUlucHV0RWxlbWVudHMubGltaXRMaWdodG5lc3NDaGVja2JveDtcblxuXHRcdGlmIChcblx0XHRcdHBhbGV0dGVOdW1iZXJPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRwYWxldHRlVHlwZU9wdGlvbnMgPT09IG51bGwgfHxcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0RGFya25lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID09PSBudWxsXG5cdFx0KSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdCdPbmUgb3IgbW9yZSBlbGVtZW50cyBhcmUgbnVsbCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID49IDIpXG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0YG51bUJveGVzOiAke3BhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCl9XFxucGFsZXR0ZVR5cGU6ICR7cGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCl9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzd2F0Y2hlczogcGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdHR5cGU6IHBhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IGN1c3RvbUNvbG9yUmF3XG5cdFx0XHRcdD8gKGNvcmVVdGlscy5iYXNlLnBhcnNlQ3VzdG9tQ29sb3IoXG5cdFx0XHRcdFx0XHRjdXN0b21Db2xvclJhd1xuXHRcdFx0XHRcdCkgYXMgSFNMIHwgbnVsbClcblx0XHRcdFx0OiBudWxsLFxuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0RGFyazogbGltaXREYXJrbmVzc0NoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdEdyYXk6IGxpbWl0R3JheW5lc3NDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRMaWdodDogbGltaXRMaWdodG5lc3NDaGVja2JveC5jaGVja2VkXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBzd2l0Y2hDb2xvclNwYWNlKHRhcmdldEZvcm1hdDogQ29sb3JTcGFjZSk6IFByb21pc2U8dm9pZD4ge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3N3aXRjaENvbG9yU3BhY2UoKSc7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3hlcyA9XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KFxuXHRcdFx0XHQnLmNvbG9yLXRleHQtb3V0cHV0LWJveCdcblx0XHRcdCk7XG5cblx0XHRmb3IgKGNvbnN0IGJveCBvZiBjb2xvclRleHRPdXRwdXRCb3hlcykge1xuXHRcdFx0Y29uc3QgaW5wdXRCb3ggPSBib3ggYXMgQ29sb3JJbnB1dEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9IGlucHV0Qm94LmNvbG9yVmFsdWVzO1xuXG5cdFx0XHRpZiAoIWNvbG9yVmFsdWVzIHx8ICFjb3JlVXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3JWYWx1ZXMpKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4gQ2Fubm90IGRpc3BsYXkgdG9hc3QuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvci4nKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VycmVudEZvcm1hdCA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZShcblx0XHRcdFx0J2RhdGEtZm9ybWF0J1xuXHRcdFx0KSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID49IDIpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBDb252ZXJ0aW5nIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0Y29uc3QgY29udmVydEZuID0gdXRpbHMuY29udmVyc2lvbi5nZXRDb252ZXJzaW9uRm4oXG5cdFx0XHRcdGN1cnJlbnRGb3JtYXQsXG5cdFx0XHRcdHRhcmdldEZvcm1hdFxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFjb252ZXJ0Rm4pIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbG9yVmFsdWVzLmZvcm1hdCA9PT0gJ3h5eicpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gWFlaIHRvIGFub3RoZXIgY29sb3Igc3BhY2UuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGF3YWl0IHV0aWxzLmNvbG9yLm5hcnJvd1RvQ29sb3IoY29sb3JWYWx1ZXMpO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCFjbG9uZWRDb2xvciB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1NMQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzU1ZDb2xvcihjbG9uZWRDb2xvcikgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNYWVooY2xvbmVkQ29sb3IpXG5cdFx0XHQpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID49IDMgJiYgbG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBTTCwgU1YsIG9yIFhZWiBjb2xvciBzcGFjZXMuIFBsZWFzZSBjb252ZXJ0IHRvIGEgc3VwcG9ydGVkIGZvcm1hdCBmaXJzdC4nLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghY2xvbmVkQ29sb3IpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbmV3Q29sb3IgPSBjb3JlVXRpbHMuYmFzZS5jbG9uZShjb252ZXJ0Rm4oY2xvbmVkQ29sb3IpKTtcblxuXHRcdFx0aWYgKCFuZXdDb2xvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gZmFpbGVkLicpO1xuXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnB1dEJveC52YWx1ZSA9IFN0cmluZyhuZXdDb2xvcik7XG5cblx0XHRcdGlucHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCB0YXJnZXRGb3JtYXQpO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm4pXG5cdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0J0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXHRcdGVsc2UgaWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY29udmVydCBjb2xvcnM6ICR7ZXJyb3IgYXMgRXJyb3J9YCk7XG5cdFx0ZWxzZSBpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBzdXBlclV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ3N1cGVyVXRpbHMnXSA9IHtcblx0ZG9tOiB7XG5cdFx0Z2V0R2VuQnV0dG9uQXJncyxcblx0XHRzd2l0Y2hDb2xvclNwYWNlXG5cdH1cbn0gYXMgY29uc3Q7XG4iXX0=