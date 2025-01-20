// File: src/palette/common/paletteUtils/adjust.js
import { core, helpers } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { logger } from '../../../logger/index.js';
const adjustments = data.consts.adjustments;
const logMode = data.mode.logging;
function sl(color) {
    try {
        if (!core.validate.colorValues(color)) {
            if (logMode.errors)
                logger.error('Invalid color valus for adjustment.');
            helpers.dom.showToast('Invalid color values');
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: core.brand.asPercentile(adjustedSaturation),
                lightness: core.brand.asPercentile(adjustedLightness),
                alpha: color.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (logMode.errors)
            logger.error(`Error adjusting saturation and lightness: ${error}`);
        return color;
    }
}
export const adjust = {
    sl
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRqdXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL3BhbGV0dGVVdGlscy9hZGp1c3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0RBQWtEO0FBR2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzlDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVsRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUVsQyxTQUFTLEVBQUUsQ0FBQyxLQUFVO0lBQ3JCLElBQUksQ0FBQztRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLElBQUksT0FBTyxDQUFDLE1BQU07Z0JBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUVyRCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBRTlDLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUMxRCxHQUFHLENBQ0gsQ0FBQztRQUNGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QyxPQUFPO1lBQ04sS0FBSyxFQUFFO2dCQUNOLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUc7Z0JBQ3BCLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztnQkFDdkQsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDO2dCQUNyRCxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLO2FBQ3hCO1lBQ0QsTUFBTSxFQUFFLEtBQUs7U0FDYixDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLENBQUMsTUFBTTtZQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDLDZDQUE2QyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQStCO0lBQ2pELEVBQUU7Q0FDTyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL3BhbGV0dGUvY29tbW9uL3BhbGV0dGVVdGlscy9hZGp1c3QuanNcblxuaW1wb3J0IHsgSFNMLCBQYWxldHRlQ29tbW9uX1V0aWxzX0FkanVzdCB9IGZyb20gJy4uLy4uLy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGNvcmUsIGhlbHBlcnMgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uLy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcblxuY29uc3QgYWRqdXN0bWVudHMgPSBkYXRhLmNvbnN0cy5hZGp1c3RtZW50cztcbmNvbnN0IGxvZ01vZGUgPSBkYXRhLm1vZGUubG9nZ2luZztcblxuZnVuY3Rpb24gc2woY29sb3I6IEhTTCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlLmNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdXMgZm9yIGFkanVzdG1lbnQuJyk7XG5cblx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvciB2YWx1ZXMnKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFkanVzdGVkU2F0dXJhdGlvbiA9IE1hdGgubWluKFxuXHRcdFx0TWF0aC5tYXgoY29sb3IudmFsdWUuc2F0dXJhdGlvbiArIGFkanVzdG1lbnRzLnNsYVZhbHVlLCAwKSxcblx0XHRcdDEwMFxuXHRcdCk7XG5cdFx0Y29uc3QgYWRqdXN0ZWRMaWdodG5lc3MgPSBNYXRoLm1pbigxMDApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogY29sb3IudmFsdWUuaHVlLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShhZGp1c3RlZFNhdHVyYXRpb24pLFxuXHRcdFx0XHRsaWdodG5lc3M6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKGFkanVzdGVkTGlnaHRuZXNzKSxcblx0XHRcdFx0YWxwaGE6IGNvbG9yLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0bG9nZ2VyLmVycm9yKGBFcnJvciBhZGp1c3Rpbmcgc2F0dXJhdGlvbiBhbmQgbGlnaHRuZXNzOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBhZGp1c3Q6IFBhbGV0dGVDb21tb25fVXRpbHNfQWRqdXN0ID0ge1xuXHRzbFxufSBhcyBjb25zdDtcbiJdfQ==