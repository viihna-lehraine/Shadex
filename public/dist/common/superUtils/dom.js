// File: src/common/superUtils/dom.js
import { consts, mode } from '../data/base.js';
import { createLogger } from '../../logger/index.js';
import { core } from '../core/index.js';
import { helpers } from '../helpers/index.js';
import { utils } from '../utils/index.js';
const logger = await createLogger();
const logMode = mode.logging;
const domInputElements = consts.dom.elements.inputs;
function getGenButtonArgs() {
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
                logger.error('One or more elements are null', 'common > superUtils > dom > getGenButtonArgs()');
            return null;
        }
        if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
            logger.info(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`, 'getGenButtonArgs()');
        return {
            swatches: parseInt(paletteNumberOptions.value, 10),
            type: parseInt(paletteTypeOptions.value, 10),
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
        if (logMode.error)
            logger.error(`Failed to retrieve generateButton parameters: ${error}`, 'common > superUtils > dom > getGenButtonArgs()');
        return null;
    }
}
async function switchColorSpace(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        for (const box of colorTextOutputBoxes) {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !core.validate.colorValues(colorValues)) {
                if (logMode.error)
                    logger.error('Invalid color values. Cannot display toast.', 'common > superUtils > switchColorSpace()');
                helpers.dom.showToast('Invalid color.');
                continue;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
                logger.info(`Converting from ${currentFormat} to ${targetFormat}`, 'common > superUtils > dom > switchColorSpace()');
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (logMode.error)
                    logger.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`, 'common > superUtils > dom > switchColorSpace()');
                helpers.dom.showToast('Conversion not supported.');
                continue;
            }
            if (colorValues.format === 'xyz') {
                if (logMode.error)
                    logger.error('Cannot convert from XYZ to another color space.', 'common > superUtils > dom > switchColorSpace()');
                helpers.dom.showToast('Conversion not supported.');
                continue;
            }
            const clonedColor = await utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (logMode.verbosity >= 3 && logMode.error)
                    logger.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.', 'common > superUtils > dom > switchColorSpace()');
                helpers.dom.showToast('Conversion not supported.');
                continue;
            }
            if (!clonedColor) {
                if (logMode.error)
                    logger.error(`Conversion to ${targetFormat} failed.`, 'common > superUtils > dom > switchColorSpace()');
                helpers.dom.showToast('Conversion failed.');
                continue;
            }
            const newColor = core.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (logMode.error)
                    logger.error(`Conversion to ${targetFormat} failed.`, 'common > superUtils > dom > switchColorSpace()');
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
            logger.warn('Failed to convert colors.', 'common > superUtils > dom > switchColorSpace()');
        else if (!mode.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (logMode.error)
            logger.error(`Failed to convert colors: ${error}`);
    }
}
export const dom = {
    getGenButtonArgs,
    switchColorSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFTckMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBRXBELFNBQVMsZ0JBQWdCO0lBQ3hCLElBQUksQ0FBQztRQUNKLE1BQU0sb0JBQW9CLEdBQUcsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUM7UUFDbkUsTUFBTSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztRQUMvRCxNQUFNLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUM7UUFDaEUsTUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztRQUNqRSxNQUFNLHFCQUFxQixHQUFHLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDO1FBQ3JFLE1BQU0scUJBQXFCLEdBQUcsZ0JBQWdCLENBQUMscUJBQXFCLENBQUM7UUFDckUsTUFBTSxzQkFBc0IsR0FBRyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztRQUV2RSxJQUNDLG9CQUFvQixLQUFLLElB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Q0FBQyxNQUFNLEdBQUcsR0FBd0Q7SUFDdkUsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtDQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29tbW9uL3N1cGVyVXRpbHMvZG9tLmpzXG5cbmltcG9ydCB7XG5cdENvbG9ySW5wdXRFbGVtZW50LFxuXHRDb2xvclNwYWNlLFxuXHRDb21tb25GdW5jdGlvbnNNYXN0ZXJJbnRlcmZhY2UsXG5cdEdlbkJ1dHRvbkFyZ3MsXG5cdEhTTFxufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25zdHMsIG1vZGUgfSBmcm9tICcuLi9kYXRhL2Jhc2UuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IGNvcmUgfSBmcm9tICcuLi9jb3JlL2luZGV4LmpzJztcbmltcG9ydCB7IGhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzL2luZGV4LmpzJztcbmltcG9ydCB7IHV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvaW5kZXguanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcbmNvbnN0IGRvbUlucHV0RWxlbWVudHMgPSBjb25zdHMuZG9tLmVsZW1lbnRzLmlucHV0cztcblxuZnVuY3Rpb24gZ2V0R2VuQnV0dG9uQXJncygpOiBHZW5CdXR0b25BcmdzIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPSBkb21JbnB1dEVsZW1lbnRzLnBhbGV0dGVOdW1iZXJPcHRpb25zO1xuXHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9ucyA9IGRvbUlucHV0RWxlbWVudHMucGFsZXR0ZVR5cGVPcHRpb25zO1xuXHRcdGNvbnN0IGN1c3RvbUNvbG9yUmF3ID0gZG9tSW5wdXRFbGVtZW50cy5jdXN0b21Db2xvcklucHV0Py52YWx1ZTtcblx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID0gZG9tSW5wdXRFbGVtZW50cy5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGRvbUlucHV0RWxlbWVudHMubGltaXREYXJrbmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0R3JheW5lc3NDaGVja2JveCA9IGRvbUlucHV0RWxlbWVudHMubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPSBkb21JbnB1dEVsZW1lbnRzLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRpZiAoXG5cdFx0XHRwYWxldHRlTnVtYmVyT3B0aW9ucyA9PT0gbnVsbCB8fFxuXHRcdFx0cGFsZXR0ZVR5cGVPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0R3JheW5lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCA9PT0gbnVsbFxuXHRcdCkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHQnT25lIG9yIG1vcmUgZWxlbWVudHMgYXJlIG51bGwnLFxuXHRcdFx0XHRcdCdjb21tb24gPiBzdXBlclV0aWxzID4gZG9tID4gZ2V0R2VuQnV0dG9uQXJncygpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID49IDIpXG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0YG51bUJveGVzOiAke3BhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCl9XFxucGFsZXR0ZVR5cGU6ICR7cGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCl9YCxcblx0XHRcdFx0J2dldEdlbkJ1dHRvbkFyZ3MoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3dhdGNoZXM6IHBhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHR0eXBlOiBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdGN1c3RvbUNvbG9yOiBjdXN0b21Db2xvclJhd1xuXHRcdFx0XHQ/IChjb3JlLmJhc2UucGFyc2VDdXN0b21Db2xvcihjdXN0b21Db2xvclJhdykgYXMgSFNMIHwgbnVsbClcblx0XHRcdFx0OiBudWxsLFxuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFya25lc3NDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRHcmF5bmVzczogbGltaXRHcmF5bmVzc0NoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogbGltaXRMaWdodG5lc3NDaGVja2JveC5jaGVja2VkXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBzdXBlclV0aWxzID4gZG9tID4gZ2V0R2VuQnV0dG9uQXJncygpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN3aXRjaENvbG9yU3BhY2UodGFyZ2V0Rm9ybWF0OiBDb2xvclNwYWNlKTogUHJvbWlzZTx2b2lkPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ZXMgPVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHQpO1xuXG5cdFx0Zm9yIChjb25zdCBib3ggb2YgY29sb3JUZXh0T3V0cHV0Qm94ZXMpIHtcblx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIENvbG9ySW5wdXRFbGVtZW50O1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSBpbnB1dEJveC5jb2xvclZhbHVlcztcblxuXHRcdFx0aWYgKCFjb2xvclZhbHVlcyB8fCAhY29yZS52YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvclZhbHVlcykpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J0ludmFsaWQgY29sb3IgdmFsdWVzLiBDYW5ub3QgZGlzcGxheSB0b2FzdC4nLFxuXHRcdFx0XHRcdFx0J2NvbW1vbiA+IHN1cGVyVXRpbHMgPiBzd2l0Y2hDb2xvclNwYWNlKCknXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjdXJyZW50Rm9ybWF0ID0gaW5wdXRCb3guZ2V0QXR0cmlidXRlKFxuXHRcdFx0XHQnZGF0YS1mb3JtYXQnXG5cdFx0XHQpIGFzIENvbG9yU3BhY2U7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPj0gMilcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YENvbnZlcnRpbmcgZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fWAsXG5cdFx0XHRcdFx0J2NvbW1vbiA+IHN1cGVyVXRpbHMgPiBkb20gPiBzd2l0Y2hDb2xvclNwYWNlKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGNvbnZlcnRGbiA9IHV0aWxzLmNvbnZlcnNpb24uZ2V0Q29udmVyc2lvbkZuKFxuXHRcdFx0XHRjdXJyZW50Rm9ybWF0LFxuXHRcdFx0XHR0YXJnZXRGb3JtYXRcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBDb252ZXJzaW9uIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH0gaXMgbm90IHN1cHBvcnRlZC5gLFxuXHRcdFx0XHRcdFx0J2NvbW1vbiA+IHN1cGVyVXRpbHMgPiBkb20gPiBzd2l0Y2hDb2xvclNwYWNlKCknXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvclZhbHVlcy5mb3JtYXQgPT09ICd4eXonKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFhZWiB0byBhbm90aGVyIGNvbG9yIHNwYWNlLicsXG5cdFx0XHRcdFx0XHQnY29tbW9uID4gc3VwZXJVdGlscyA+IGRvbSA+IHN3aXRjaENvbG9yU3BhY2UoKSdcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGF3YWl0IHV0aWxzLmNvbG9yLm5hcnJvd1RvQ29sb3IoY29sb3JWYWx1ZXMpO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCFjbG9uZWRDb2xvciB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1NMQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzU1ZDb2xvcihjbG9uZWRDb2xvcikgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNYWVooY2xvbmVkQ29sb3IpXG5cdFx0XHQpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID49IDMgJiYgbG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBTTCwgU1YsIG9yIFhZWiBjb2xvciBzcGFjZXMuIFBsZWFzZSBjb252ZXJ0IHRvIGEgc3VwcG9ydGVkIGZvcm1hdCBmaXJzdC4nLFxuXHRcdFx0XHRcdFx0J2NvbW1vbiA+IHN1cGVyVXRpbHMgPiBkb20gPiBzd2l0Y2hDb2xvclNwYWNlKCknXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbG9uZWRDb2xvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmAsXG5cdFx0XHRcdFx0XHQnY29tbW9uID4gc3VwZXJVdGlscyA+IGRvbSA+IHN3aXRjaENvbG9yU3BhY2UoKSdcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBmYWlsZWQuJyk7XG5cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gY29yZS5iYXNlLmNsb25lKGNvbnZlcnRGbihjbG9uZWRDb2xvcikpO1xuXG5cdFx0XHRpZiAoIW5ld0NvbG9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCxcblx0XHRcdFx0XHRcdCdjb21tb24gPiBzdXBlclV0aWxzID4gZG9tID4gc3dpdGNoQ29sb3JTcGFjZSgpJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aW5wdXRCb3gudmFsdWUgPSBTdHJpbmcobmV3Q29sb3IpO1xuXG5cdFx0XHRpbnB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdGFyZ2V0Rm9ybWF0KTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuKVxuXHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyxcblx0XHRcdFx0J2NvbW1vbiA+IHN1cGVyVXRpbHMgPiBkb20gPiBzd2l0Y2hDb2xvclNwYWNlKCknXG5cdFx0XHQpO1xuXHRcdGVsc2UgaWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY29udmVydCBjb2xvcnM6ICR7ZXJyb3IgYXMgRXJyb3J9YCk7XG5cdFx0ZWxzZSBpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkb206IENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZVsnc3VwZXJVdGlscyddWydkb20nXSA9IHtcblx0Z2V0R2VuQnV0dG9uQXJncyxcblx0c3dpdGNoQ29sb3JTcGFjZVxufSBhcyBjb25zdDtcbiJdfQ==