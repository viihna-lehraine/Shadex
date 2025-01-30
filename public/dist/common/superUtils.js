// File: common/superUtils.js
import { coreUtils } from './core.js';
import { createLogger } from '../logger/index.js';
import { domData } from '../data/dom.js';
import { helpers } from './helpers/index.js';
import { modeData as mode } from '../data/mode.js';
import { utils } from './utils/index.js';
const domElements = domData.elements.static;
const logMode = mode.logging;
const thisModule = 'common/superUtils/dom.js';
const logger = await createLogger();
function getPaletteGenerationArgs() {
    const thisMethod = 'getGenButtonArgs()';
    try {
        const swatchGenNumber = domElements.selects.swatchGen;
        const paletteType = domElements.selects.paletteType;
        const customColorRaw = domElements.inputs.customColor?.value;
        const limitDarkChkbx = domElements.inputs.limitDarkChkbx;
        const limitGrayChkbx = domElements.inputs.limitGrayChkbx;
        const limitLightChkbx = domElements.inputs.limitLightChkbx;
        if (swatchGenNumber === null ||
            paletteType === null ||
            limitDarkChkbx === null ||
            limitGrayChkbx === null ||
            limitLightChkbx === null) {
            if (logMode.error)
                logger.error('One or more elements are null', `${thisModule} > ${thisMethod}`);
            return null;
        }
        if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
            logger.info(`numBoxes: ${parseInt(swatchGenNumber.value, 10)}\npaletteType: ${parseInt(paletteType.value, 10)}`, `${thisModule} > ${thisMethod}`);
        return {
            swatches: parseInt(swatchGenNumber.value, 10),
            type: parseInt(paletteType.value, 10),
            customColor: customColorRaw
                ? coreUtils.base.parseCustomColor(customColorRaw)
                : null,
            limitDark: limitDarkChkbx.checked,
            limitGray: limitGrayChkbx.checked,
            limitLight: limitLightChkbx.checked
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
        getPaletteGenerationArgs,
        switchColorSpace
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJVdGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3VwZXJVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2QkFBNkI7QUFTN0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN0QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUV6QyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLE1BQU0sVUFBVSxHQUFHLDBCQUEwQixDQUFDO0FBRTlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsU0FBUyx3QkFBd0I7SUFDaEMsTUFBTSxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFFeEMsSUFBSSxDQUFDO1FBQ0osTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDdEQsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDcEQsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO1FBQzdELE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQ3pELE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQ3pELE1BQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBRTNELElBQ0MsZUFBZSxLQUFLLElBQUk7WUFDeEIsV0FBVyxLQUFLLElBQUk7WUFDcEIsY0FBYyxLQUFLLElBQUk7WUFDdkIsY0FBYyxLQUFLLElBQUk7WUFDdkIsZUFBZSxLQUFLLElBQUksRUFDdkIsQ0FBQztZQUNGLElBQUksT0FBTyxDQUFDLEtBQUs7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsK0JBQStCLEVBQy9CLEdBQUcsVUFBVSxNQUFNLFVBQVUsRUFBRSxDQUMvQixDQUFDO1lBRUgsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUM7WUFDeEQsTUFBTSxDQUFDLElBQUksQ0FDVixhQUFhLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFDbkcsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7UUFFSCxPQUFPO1lBQ04sUUFBUSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxJQUFJLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQ3JDLFdBQVcsRUFBRSxjQUFjO2dCQUMxQixDQUFDLENBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FDaEMsY0FBYyxDQUNDO2dCQUNqQixDQUFDLENBQUMsSUFBSTtZQUNQLFNBQVMsRUFBRSxjQUFjLENBQUMsT0FBTztZQUNqQyxTQUFTLEVBQUUsY0FBYyxDQUFDLE9BQU87WUFDakMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxPQUFPO1NBQ25DLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLE9BQU8sQ0FBQyxLQUFLO1lBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsaURBQWlELEtBQUssRUFBRSxFQUN4RCxHQUFHLFVBQVUsTUFBTSxVQUFVLEVBQUUsQ0FDL0IsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztBQUNGLENBQUM7QUFFRCxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsWUFBd0I7SUFDdkQsTUFBTSxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFFeEMsSUFBSSxDQUFDO1FBQ0osTUFBTSxvQkFBb0IsR0FDekIsUUFBUSxDQUFDLGdCQUFnQixDQUN4Qix3QkFBd0IsQ0FDeEIsQ0FBQztRQUVILEtBQUssTUFBTSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztZQUN4QyxNQUFNLFFBQVEsR0FBRyxHQUF3QixDQUFDO1lBQzFDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFFekMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xFLElBQUksT0FBTyxDQUFDLEtBQUs7b0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsNkNBQTZDLEVBQzdDLEdBQUcsVUFBVSxNQUFNLFVBQVUsRUFBRSxDQUMvQixDQUFDO2dCQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRXhDLFNBQVM7WUFDVixDQUFDO1lBRUQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FDMUMsYUFBYSxDQUNDLENBQUM7WUFFaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQ1YsbUJBQW1CLGFBQWEsT0FBTyxZQUFZLEVBQUUsRUFDckQsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7WUFFSCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FDakQsYUFBYSxFQUNiLFlBQVksQ0FDWixDQUFDO1lBRUYsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNoQixJQUFJLE9BQU8sQ0FBQyxLQUFLO29CQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLG1CQUFtQixhQUFhLE9BQU8sWUFBWSxvQkFBb0IsRUFDdkUsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7Z0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFFbkQsU0FBUztZQUNWLENBQUM7WUFFRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFLENBQUM7Z0JBQ2xDLElBQUksT0FBTyxDQUFDLEtBQUs7b0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsaURBQWlELEVBQ2pELEdBQUcsVUFBVSxNQUFNLFVBQVUsRUFBRSxDQUMvQixDQUFDO2dCQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBRW5ELFNBQVM7WUFDVixDQUFDO1lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVqRSxJQUNDLENBQUMsV0FBVztnQkFDWixLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQzdCLENBQUM7Z0JBQ0YsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSztvQkFDMUMsTUFBTSxDQUFDLEtBQUssQ0FDWCw4RkFBOEYsRUFDOUYsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7Z0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFFbkQsU0FBUztZQUNWLENBQUM7WUFFRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2xCLElBQUksT0FBTyxDQUFDLEtBQUs7b0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsaUJBQWlCLFlBQVksVUFBVSxFQUN2QyxHQUFHLFVBQVUsTUFBTSxVQUFVLEVBQUUsQ0FDL0IsQ0FBQztnQkFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUU1QyxTQUFTO1lBQ1YsQ0FBQztZQUVELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRTlELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDZixJQUFJLE9BQU8sQ0FBQyxLQUFLO29CQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLGlCQUFpQixZQUFZLFVBQVUsRUFDdkMsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7Z0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFFNUMsU0FBUztZQUNWLENBQUM7WUFFRCxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNwRCxDQUFDO0lBQ0YsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSTtZQUM5QixNQUFNLENBQUMsSUFBSSxDQUNWLDJCQUEyQixFQUMzQixHQUFHLFVBQVUsTUFBTSxVQUFVLEVBQUUsQ0FDL0IsQ0FBQzthQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFjLEVBQUUsQ0FBQyxDQUFDO2FBQzNELElBQUksT0FBTyxDQUFDLEtBQUs7WUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsS0FBYyxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBMkM7SUFDakUsR0FBRyxFQUFFO1FBQ0osd0JBQXdCO1FBQ3hCLGdCQUFnQjtLQUNoQjtDQUNRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb21tb24vc3VwZXJVdGlscy5qc1xuXG5pbXBvcnQge1xuXHRDb2xvcklucHV0RWxlbWVudCxcblx0Q29sb3JTcGFjZSxcblx0Q29tbW9uRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRIU0wsXG5cdFBhbGV0dGVHZW5lcmF0aW9uQXJnc1xufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlVXRpbHMgfSBmcm9tICcuL2NvcmUuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IGRvbURhdGEgfSBmcm9tICcuLi9kYXRhL2RvbS5qcyc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi9oZWxwZXJzL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi9kYXRhL21vZGUuanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuL3V0aWxzL2luZGV4LmpzJztcblxuY29uc3QgZG9tRWxlbWVudHMgPSBkb21EYXRhLmVsZW1lbnRzLnN0YXRpYztcbmNvbnN0IGxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5cbmNvbnN0IHRoaXNNb2R1bGUgPSAnY29tbW9uL3N1cGVyVXRpbHMvZG9tLmpzJztcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbmZ1bmN0aW9uIGdldFBhbGV0dGVHZW5lcmF0aW9uQXJncygpOiBQYWxldHRlR2VuZXJhdGlvbkFyZ3MgfCBudWxsIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdnZXRHZW5CdXR0b25BcmdzKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3dhdGNoR2VuTnVtYmVyID0gZG9tRWxlbWVudHMuc2VsZWN0cy5zd2F0Y2hHZW47XG5cdFx0Y29uc3QgcGFsZXR0ZVR5cGUgPSBkb21FbGVtZW50cy5zZWxlY3RzLnBhbGV0dGVUeXBlO1xuXHRcdGNvbnN0IGN1c3RvbUNvbG9yUmF3ID0gZG9tRWxlbWVudHMuaW5wdXRzLmN1c3RvbUNvbG9yPy52YWx1ZTtcblx0XHRjb25zdCBsaW1pdERhcmtDaGtieCA9IGRvbUVsZW1lbnRzLmlucHV0cy5saW1pdERhcmtDaGtieDtcblx0XHRjb25zdCBsaW1pdEdyYXlDaGtieCA9IGRvbUVsZW1lbnRzLmlucHV0cy5saW1pdEdyYXlDaGtieDtcblx0XHRjb25zdCBsaW1pdExpZ2h0Q2hrYnggPSBkb21FbGVtZW50cy5pbnB1dHMubGltaXRMaWdodENoa2J4O1xuXG5cdFx0aWYgKFxuXHRcdFx0c3dhdGNoR2VuTnVtYmVyID09PSBudWxsIHx8XG5cdFx0XHRwYWxldHRlVHlwZSA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXREYXJrQ2hrYnggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0R3JheUNoa2J4ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdExpZ2h0Q2hrYnggPT09IG51bGxcblx0XHQpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0J09uZSBvciBtb3JlIGVsZW1lbnRzIGFyZSBudWxsJyxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPj0gMilcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgbnVtQm94ZXM6ICR7cGFyc2VJbnQoc3dhdGNoR2VuTnVtYmVyLnZhbHVlLCAxMCl9XFxucGFsZXR0ZVR5cGU6ICR7cGFyc2VJbnQocGFsZXR0ZVR5cGUudmFsdWUsIDEwKX1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN3YXRjaGVzOiBwYXJzZUludChzd2F0Y2hHZW5OdW1iZXIudmFsdWUsIDEwKSxcblx0XHRcdHR5cGU6IHBhcnNlSW50KHBhbGV0dGVUeXBlLnZhbHVlLCAxMCksXG5cdFx0XHRjdXN0b21Db2xvcjogY3VzdG9tQ29sb3JSYXdcblx0XHRcdFx0PyAoY29yZVV0aWxzLmJhc2UucGFyc2VDdXN0b21Db2xvcihcblx0XHRcdFx0XHRcdGN1c3RvbUNvbG9yUmF3XG5cdFx0XHRcdFx0KSBhcyBIU0wgfCBudWxsKVxuXHRcdFx0XHQ6IG51bGwsXG5cdFx0XHRsaW1pdERhcms6IGxpbWl0RGFya0Noa2J4LmNoZWNrZWQsXG5cdFx0XHRsaW1pdEdyYXk6IGxpbWl0R3JheUNoa2J4LmNoZWNrZWQsXG5cdFx0XHRsaW1pdExpZ2h0OiBsaW1pdExpZ2h0Q2hrYnguY2hlY2tlZFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVyczogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc3dpdGNoQ29sb3JTcGFjZSh0YXJnZXRGb3JtYXQ6IENvbG9yU3BhY2UpOiBQcm9taXNlPHZvaWQ+IHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdzd2l0Y2hDb2xvclNwYWNlKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ZXMgPVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHQpO1xuXG5cdFx0Zm9yIChjb25zdCBib3ggb2YgY29sb3JUZXh0T3V0cHV0Qm94ZXMpIHtcblx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIENvbG9ySW5wdXRFbGVtZW50O1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSBpbnB1dEJveC5jb2xvclZhbHVlcztcblxuXHRcdFx0aWYgKCFjb2xvclZhbHVlcyB8fCAhY29yZVV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKSkge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnSW52YWxpZCBjb2xvciB2YWx1ZXMuIENhbm5vdCBkaXNwbGF5IHRvYXN0LicsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRGb3JtYXQgPSBpbnB1dEJveC5nZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdCdkYXRhLWZvcm1hdCdcblx0XHRcdCkgYXMgQ29sb3JTcGFjZTtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+PSAyKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgQ29udmVydGluZyBmcm9tICR7Y3VycmVudEZvcm1hdH0gdG8gJHt0YXJnZXRGb3JtYXR9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGNvbnZlcnRGbiA9IHV0aWxzLmNvbnZlcnNpb24uZ2V0Q29udmVyc2lvbkZuKFxuXHRcdFx0XHRjdXJyZW50Rm9ybWF0LFxuXHRcdFx0XHR0YXJnZXRGb3JtYXRcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBDb252ZXJzaW9uIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH0gaXMgbm90IHN1cHBvcnRlZC5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvclZhbHVlcy5mb3JtYXQgPT09ICd4eXonKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFhZWiB0byBhbm90aGVyIGNvbG9yIHNwYWNlLicsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBhd2FpdCB1dGlscy5jb2xvci5uYXJyb3dUb0NvbG9yKGNvbG9yVmFsdWVzKTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQhY2xvbmVkQ29sb3IgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNTTENvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1NWQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzWFlaKGNsb25lZENvbG9yKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLnZlcmJvc2l0eSA+PSAzICYmIGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gU0wsIFNWLCBvciBYWVogY29sb3Igc3BhY2VzLiBQbGVhc2UgY29udmVydCB0byBhIHN1cHBvcnRlZCBmb3JtYXQgZmlyc3QuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWNsb25lZENvbG9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBmYWlsZWQuJyk7XG5cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gY29yZVV0aWxzLmJhc2UuY2xvbmUoY29udmVydEZuKGNsb25lZENvbG9yKSk7XG5cblx0XHRcdGlmICghbmV3Q29sb3IpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aW5wdXRCb3gudmFsdWUgPSBTdHJpbmcobmV3Q29sb3IpO1xuXG5cdFx0XHRpbnB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdGFyZ2V0Rm9ybWF0KTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuKVxuXHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHRlbHNlIGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHRcdGVsc2UgaWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBjb252ZXJ0IGNvbG9yczogJHtlcnJvciBhcyBFcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3Qgc3VwZXJVdGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWydzdXBlclV0aWxzJ10gPSB7XG5cdGRvbToge1xuXHRcdGdldFBhbGV0dGVHZW5lcmF0aW9uQXJncyxcblx0XHRzd2l0Y2hDb2xvclNwYWNlXG5cdH1cbn0gYXMgY29uc3Q7XG4iXX0=