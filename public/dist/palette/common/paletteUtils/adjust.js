// File: src/palette/common/paletteUtils/adjust.js
import { core, helpers } from '../../../common/index.js';
import { consts, mode } from '../../../common/data/base.js';
import { createLogger } from '../../../logger/index.js';
const logger = await createLogger();
const adjustments = consts.adjustments;
const logMode = mode.logging;
function sl(color) {
    try {
        if (!core.validate.colorValues(color)) {
            if (logMode.error)
                logger.error('Invalid color valus for adjustment.', 'palette > common > paletteUtils > adjust > sl()');
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
        if (logMode.error)
            logger.error(`Error adjusting saturation and lightness: ${error}`, 'palette > common > paletteUtils > adjust > sl()');
        return color;
    }
}
export const adjust = { sl };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRqdXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL3BhbGV0dGVVdGlscy9hZGp1c3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0RBQWtEO0FBR2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFeEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3ZDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFN0IsU0FBUyxFQUFFLENBQUMsS0FBVTtJQUNyQixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxJQUFJLE9BQU8sQ0FBQyxLQUFLO2dCQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLHFDQUFxQyxFQUNyQyxpREFBaUQsQ0FDakQsQ0FBQztZQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFOUMsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQzFELEdBQUcsQ0FDSCxDQUFDO1FBQ0YsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXhDLE9BQU87WUFDTixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRztnQkFDcEIsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO2dCQUN2RCxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3JELEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUs7YUFDeEI7WUFDRCxNQUFNLEVBQUUsS0FBSztTQUNiLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLE9BQU8sQ0FBQyxLQUFLO1lBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsNkNBQTZDLEtBQUssRUFBRSxFQUNwRCxpREFBaUQsQ0FDakQsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxFQUFFLEVBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9wYWxldHRlL2NvbW1vbi9wYWxldHRlVXRpbHMvYWRqdXN0LmpzXG5cbmltcG9ydCB7IEhTTCB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvcmUsIGhlbHBlcnMgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgY29uc3RzLCBtb2RlIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2RhdGEvYmFzZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi8uLi9sb2dnZXIvaW5kZXguanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgYWRqdXN0bWVudHMgPSBjb25zdHMuYWRqdXN0bWVudHM7XG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuXG5mdW5jdGlvbiBzbChjb2xvcjogSFNMKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdCdJbnZhbGlkIGNvbG9yIHZhbHVzIGZvciBhZGp1c3RtZW50LicsXG5cdFx0XHRcdFx0J3BhbGV0dGUgPiBjb21tb24gPiBwYWxldHRlVXRpbHMgPiBhZGp1c3QgPiBzbCgpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IgdmFsdWVzJyk7XG5cblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb25zdCBhZGp1c3RlZFNhdHVyYXRpb24gPSBNYXRoLm1pbihcblx0XHRcdE1hdGgubWF4KGNvbG9yLnZhbHVlLnNhdHVyYXRpb24gKyBhZGp1c3RtZW50cy5zbGFWYWx1ZSwgMCksXG5cdFx0XHQxMDBcblx0XHQpO1xuXHRcdGNvbnN0IGFkanVzdGVkTGlnaHRuZXNzID0gTWF0aC5taW4oMTAwKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGNvbG9yLnZhbHVlLmh1ZSxcblx0XHRcdFx0c2F0dXJhdGlvbjogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUoYWRqdXN0ZWRTYXR1cmF0aW9uKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShhZGp1c3RlZExpZ2h0bmVzcyksXG5cdFx0XHRcdGFscGhhOiBjb2xvci52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgYWRqdXN0aW5nIHNhdHVyYXRpb24gYW5kIGxpZ2h0bmVzczogJHtlcnJvcn1gLFxuXHRcdFx0XHQncGFsZXR0ZSA+IGNvbW1vbiA+IHBhbGV0dGVVdGlscyA+IGFkanVzdCA+IHNsKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBhZGp1c3QgPSB7IHNsIH0gYXMgY29uc3Q7XG4iXX0=