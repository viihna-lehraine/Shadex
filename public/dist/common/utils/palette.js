// File: src/common/utils/palette.js
import { core } from '../core/index.js';
import { createLogger } from '../../logger/index.js';
import { mode } from '../data/base.js';
import { helpers } from '../helpers/index.js';
const logger = await createLogger();
const logMode = mode.logging;
function createObject(type, items, swatches, paletteID, enableAlpha, limitDark, limitGray, limitLight) {
    return {
        id: `${type}_${paletteID}`,
        items,
        metadata: {
            name: '',
            timestamp: core.getFormattedTimestamp(),
            swatches,
            type,
            flags: {
                enableAlpha: enableAlpha,
                limitDarkness: limitDark,
                limitGrayness: limitGray,
                limitLightness: limitLight
            },
            customColor: {
                colors: items[0]?.colors || {},
                colorStrings: items[0]?.colorStrings || {},
                cssStrings: items[0]?.cssStrings || {}
            }
        }
    };
}
export async function populateOutputBox(color, boxNumber) {
    try {
        const clonedColor = core.guards.isColor(color)
            ? core.base.clone(color)
            : await core.convert.colorStringToColor(color);
        if (!core.validate.colorValues(clonedColor)) {
            if (logMode.error)
                logger.error('Invalid color values.', 'common > utils > palette > populateOutputBox()');
            helpers.dom.showToast('Invalid color.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = await core.convert.colorToCSSColorString(clonedColor);
        if (!mode.quiet && logMode.info && logMode.verbosity > 0)
            logger.info(`Adding CSS-formatted color to DOM ${stringifiedColor}`, 'common > utils > palette > populateOutputBox()');
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Failed to populate color text output box: ${error}`, 'common > utils > palette > populateOutputBox()');
        return;
    }
}
export const palette = {
    createObject,
    populateOutputBox
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFTcEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixTQUFTLFlBQVksQ0FDcEIsSUFBWSxFQUNaLEtBQW9CLEVBQ3BCLFFBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLFdBQW9CLEVBQ3BCLFNBQWtCLEVBQ2xCLFNBQWtCLEVBQ2xCLFVBQW1CO0lBRW5CLE9BQU87UUFDTixFQUFFLEVBQUUsR0FBRyxJQUFJLElBQUksU0FBUyxFQUFFO1FBQzFCLEtBQUs7UUFDTCxRQUFRLEVBQUU7WUFDVCxJQUFJLEVBQUUsRUFBRTtZQUNSLFNBQVMsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDdkMsUUFBUTtZQUNSLElBQUk7WUFDSixLQUFLLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGFBQWEsRUFBRSxTQUFTO2dCQUN4QixhQUFhLEVBQUUsU0FBUztnQkFDeEIsY0FBYyxFQUFFLFVBQVU7YUFDMUI7WUFDRCxXQUFXLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLElBQUksRUFBRTtnQkFDOUIsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLElBQUksRUFBRTtnQkFDMUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLElBQUksRUFBRTthQUN0QztTQUNEO0tBQ0QsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLGlCQUFpQixDQUN0QyxLQUEwQixFQUMxQixTQUFpQjtJQUVqQixJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QixDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQzdDLElBQUksT0FBTyxDQUFDLEtBQUs7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsdUJBQXVCLEVBQ3ZCLGdEQUFnRCxDQUNoRCxDQUFDO1lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUV4QyxPQUFPO1FBQ1IsQ0FBQztRQUVELE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDakQseUJBQXlCLFNBQVMsRUFBRSxDQUNULENBQUM7UUFFN0IsSUFBSSxDQUFDLGtCQUFrQjtZQUFFLE9BQU87UUFFaEMsTUFBTSxnQkFBZ0IsR0FDckIsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQ1YscUNBQXFDLGdCQUFnQixFQUFFLEVBQ3ZELGdEQUFnRCxDQUNoRCxDQUFDO1FBRUgsa0JBQWtCLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO1FBQzVDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxDQUFDLEtBQUs7WUFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCw2Q0FBNkMsS0FBSyxFQUFFLEVBQ3BELGdEQUFnRCxDQUNoRCxDQUFDO1FBRUgsT0FBTztJQUNSLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUF1RDtJQUMxRSxZQUFZO0lBQ1osaUJBQWlCO0NBQ1IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS5qc1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JTdHJpbmcsXG5cdENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZSxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUl0ZW1cbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXgnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGUgfSBmcm9tICcuLi9kYXRhL2Jhc2UuanMnO1xuaW1wb3J0IHsgaGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvaW5kZXguanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KFxuXHR0eXBlOiBzdHJpbmcsXG5cdGl0ZW1zOiBQYWxldHRlSXRlbVtdLFxuXHRzd2F0Y2hlczogbnVtYmVyLFxuXHRwYWxldHRlSUQ6IG51bWJlcixcblx0ZW5hYmxlQWxwaGE6IGJvb2xlYW4sXG5cdGxpbWl0RGFyazogYm9vbGVhbixcblx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRsaW1pdExpZ2h0OiBib29sZWFuXG4pOiBQYWxldHRlIHtcblx0cmV0dXJuIHtcblx0XHRpZDogYCR7dHlwZX1fJHtwYWxldHRlSUR9YCxcblx0XHRpdGVtcyxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0aW1lc3RhbXA6IGNvcmUuZ2V0Rm9ybWF0dGVkVGltZXN0YW1wKCksXG5cdFx0XHRzd2F0Y2hlcyxcblx0XHRcdHR5cGUsXG5cdFx0XHRmbGFnczoge1xuXHRcdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGEsXG5cdFx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFyayxcblx0XHRcdFx0bGltaXRHcmF5bmVzczogbGltaXRHcmF5LFxuXHRcdFx0XHRsaW1pdExpZ2h0bmVzczogbGltaXRMaWdodFxuXHRcdFx0fSxcblx0XHRcdGN1c3RvbUNvbG9yOiB7XG5cdFx0XHRcdGNvbG9yczogaXRlbXNbMF0/LmNvbG9ycyB8fCB7fSxcblx0XHRcdFx0Y29sb3JTdHJpbmdzOiBpdGVtc1swXT8uY29sb3JTdHJpbmdzIHx8IHt9LFxuXHRcdFx0XHRjc3NTdHJpbmdzOiBpdGVtc1swXT8uY3NzU3RyaW5ncyB8fCB7fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvcHVsYXRlT3V0cHV0Qm94KFxuXHRjb2xvcjogQ29sb3IgfCBDb2xvclN0cmluZyxcblx0Ym94TnVtYmVyOiBudW1iZXJcbik6IFByb21pc2U8dm9pZD4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yOiBDb2xvciA9IGNvcmUuZ3VhcmRzLmlzQ29sb3IoY29sb3IpXG5cdFx0XHQ/IGNvcmUuYmFzZS5jbG9uZShjb2xvcilcblx0XHRcdDogYXdhaXQgY29yZS5jb252ZXJ0LmNvbG9yU3RyaW5nVG9Db2xvcihjb2xvcik7XG5cblx0XHRpZiAoIWNvcmUudmFsaWRhdGUuY29sb3JWYWx1ZXMoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nLFxuXHRcdFx0XHRcdCdjb21tb24gPiB1dGlscyA+IHBhbGV0dGUgPiBwb3B1bGF0ZU91dHB1dEJveCgpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtib3hOdW1iZXJ9YFxuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yVGV4dE91dHB1dEJveCkgcmV0dXJuO1xuXG5cdFx0Y29uc3Qgc3RyaW5naWZpZWRDb2xvciA9XG5cdFx0XHRhd2FpdCBjb3JlLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAwKVxuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBBZGRpbmcgQ1NTLWZvcm1hdHRlZCBjb2xvciB0byBET00gJHtzdHJpbmdpZmllZENvbG9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiB1dGlscyA+IHBhbGV0dGUgPiBwb3B1bGF0ZU91dHB1dEJveCgpJ1xuXHRcdFx0KTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveC52YWx1ZSA9IHN0cmluZ2lmaWVkQ29sb3I7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCBjb2xvci5mb3JtYXQpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIHBvcHVsYXRlIGNvbG9yIHRleHQgb3V0cHV0IGJveDogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBwYWxldHRlID4gcG9wdWxhdGVPdXRwdXRCb3goKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHBhbGV0dGU6IENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZVsndXRpbHMnXVsncGFsZXR0ZSddID0ge1xuXHRjcmVhdGVPYmplY3QsXG5cdHBvcHVsYXRlT3V0cHV0Qm94XG59IGFzIGNvbnN0O1xuIl19