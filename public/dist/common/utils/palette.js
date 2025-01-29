// File: common/utils/palette.js
import { coreUtils } from '../core.js';
import { createLogger } from '../../logger/index.js';
import { helpers } from '../helpers/index.js';
import { modeData as mode } from '../../data/mode.js';
const logMode = mode.logging;
const thisModule = 'common/utils/palette.js';
const logger = await createLogger();
function createObject(type, items, swatches, paletteID, enableAlpha, limitDark, limitGray, limitLight) {
    return {
        id: `${type}_${paletteID}`,
        items,
        metadata: {
            name: '',
            timestamp: coreUtils.getFormattedTimestamp(),
            swatches,
            type,
            flags: {
                enableAlpha: enableAlpha,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQ0FBZ0M7QUFTaEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFdEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixNQUFNLFVBQVUsR0FBRyx5QkFBeUIsQ0FBQztBQUU3QyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLFNBQVMsWUFBWSxDQUNwQixJQUFZLEVBQ1osS0FBb0IsRUFDcEIsUUFBZ0IsRUFDaEIsU0FBaUIsRUFDakIsV0FBb0IsRUFDcEIsU0FBa0IsRUFDbEIsU0FBa0IsRUFDbEIsVUFBbUI7SUFFbkIsT0FBTztRQUNOLEVBQUUsRUFBRSxHQUFHLElBQUksSUFBSSxTQUFTLEVBQUU7UUFDMUIsS0FBSztRQUNMLFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxFQUFFO1lBQ1IsU0FBUyxFQUFFLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRTtZQUM1QyxRQUFRO1lBQ1IsSUFBSTtZQUNKLEtBQUssRUFBRTtnQkFDTixXQUFXLEVBQUUsV0FBVztnQkFDeEIsYUFBYSxFQUFFLFNBQVM7Z0JBQ3hCLGFBQWEsRUFBRSxTQUFTO2dCQUN4QixjQUFjLEVBQUUsVUFBVTthQUMxQjtZQUNELFdBQVcsRUFBRTtnQkFDWixNQUFNLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUU7b0JBQ2pDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsSUFBSSxFQUFFO29CQUMvQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRTtpQkFDL0I7YUFDRDtTQUNEO0tBQ0QsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLGlCQUFpQixDQUN0QyxLQUFnQyxFQUNoQyxTQUFpQjtJQUVqQixNQUFNLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztJQUV6QyxJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBVSxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDekQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUM3QixDQUFDLENBQUMsTUFBTSxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQ2xELElBQUksT0FBTyxDQUFDLEtBQUs7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsdUJBQXVCLEVBQ3ZCLEdBQUcsVUFBVSxNQUFNLFVBQVUsRUFBRSxDQUMvQixDQUFDO1lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUV4QyxPQUFPO1FBQ1IsQ0FBQztRQUVELE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDakQseUJBQXlCLFNBQVMsRUFBRSxDQUNULENBQUM7UUFFN0IsSUFBSSxDQUFDLGtCQUFrQjtZQUFFLE9BQU87UUFFaEMsTUFBTSxnQkFBZ0IsR0FDckIsTUFBTSxTQUFTLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQ1YscUNBQXFDLGdCQUFnQixFQUFFLEVBQ3ZELEdBQUcsVUFBVSxNQUFNLFVBQVUsRUFBRSxDQUMvQixDQUFDO1FBRUgsa0JBQWtCLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO1FBQzVDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxDQUFDLEtBQUs7WUFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCw2Q0FBNkMsS0FBSyxFQUFFLEVBQ3BELEdBQUcsVUFBVSxNQUFNLFVBQVUsRUFBRSxDQUMvQixDQUFDO1FBRUgsT0FBTztJQUNSLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFpRDtJQUN6RSxZQUFZO0lBQ1osaUJBQWlCO0NBQ1IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGNvbW1vbi91dGlscy9wYWxldHRlLmpzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRDb2xvcl9TdHJpbmdQcm9wcyxcblx0Q29tbW9uRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlSXRlbVxufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleCc7XG5pbXBvcnQgeyBjb3JlVXRpbHMgfSBmcm9tICcuLi9jb3JlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uLy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuY29uc3QgdGhpc01vZHVsZSA9ICdjb21tb24vdXRpbHMvcGFsZXR0ZS5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3QoXG5cdHR5cGU6IHN0cmluZyxcblx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdHN3YXRjaGVzOiBudW1iZXIsXG5cdHBhbGV0dGVJRDogbnVtYmVyLFxuXHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0bGltaXREYXJrOiBib29sZWFuLFxuXHRsaW1pdEdyYXk6IGJvb2xlYW4sXG5cdGxpbWl0TGlnaHQ6IGJvb2xlYW5cbik6IFBhbGV0dGUge1xuXHRyZXR1cm4ge1xuXHRcdGlkOiBgJHt0eXBlfV8ke3BhbGV0dGVJRH1gLFxuXHRcdGl0ZW1zLFxuXHRcdG1ldGFkYXRhOiB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHRpbWVzdGFtcDogY29yZVV0aWxzLmdldEZvcm1hdHRlZFRpbWVzdGFtcCgpLFxuXHRcdFx0c3dhdGNoZXMsXG5cdFx0XHR0eXBlLFxuXHRcdFx0ZmxhZ3M6IHtcblx0XHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhLFxuXHRcdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmssXG5cdFx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheSxcblx0XHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRcblx0XHRcdH0sXG5cdFx0XHRjdXN0b21Db2xvcjoge1xuXHRcdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0XHRtYWluOiBpdGVtc1swXT8uY29sb3JzLm1haW4gfHwge30sXG5cdFx0XHRcdFx0c3RyaW5nUHJvcHM6IGl0ZW1zWzBdPy5jb2xvcnMuc3RyaW5nUHJvcHMgfHwge30sXG5cdFx0XHRcdFx0Y3NzOiBpdGVtc1swXT8uY29sb3JzLmNzcyB8fCB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcG9wdWxhdGVPdXRwdXRCb3goXG5cdGNvbG9yOiBDb2xvciB8IENvbG9yX1N0cmluZ1Byb3BzLFxuXHRib3hOdW1iZXI6IG51bWJlclxuKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAncG9wdWxhdGVPdXRwdXRCb3goKSc7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBjbG9uZWRDb2xvcjogQ29sb3IgPSBjb3JlVXRpbHMuZ3VhcmRzLmlzQ29sb3IoY29sb3IpXG5cdFx0XHQ/IGNvcmVVdGlscy5iYXNlLmNsb25lKGNvbG9yKVxuXHRcdFx0OiBhd2FpdCBjb3JlVXRpbHMuY29udmVydC5jb2xvclN0cmluZ1RvQ29sb3IoY29sb3IpO1xuXG5cdFx0aWYgKCFjb3JlVXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZXMoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yLicpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7Ym94TnVtYmVyfWBcblx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKCFjb2xvclRleHRPdXRwdXRCb3gpIHJldHVybjtcblxuXHRcdGNvbnN0IHN0cmluZ2lmaWVkQ29sb3IgPVxuXHRcdFx0YXdhaXQgY29yZVV0aWxzLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAwKVxuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBBZGRpbmcgQ1NTLWZvcm1hdHRlZCBjb2xvciB0byBET00gJHtzdHJpbmdpZmllZENvbG9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWUgPSBzdHJpbmdpZmllZENvbG9yO1xuXHRcdGNvbG9yVGV4dE91dHB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgY29sb3IuZm9ybWF0KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBwb3B1bGF0ZSBjb2xvciB0ZXh0IG91dHB1dCBib3g6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybjtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgcGFsZXR0ZVV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ11bJ3BhbGV0dGUnXSA9IHtcblx0Y3JlYXRlT2JqZWN0LFxuXHRwb3B1bGF0ZU91dHB1dEJveFxufSBhcyBjb25zdDtcbiJdfQ==