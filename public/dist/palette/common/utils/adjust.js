// File: palette/common/utils/adjust.js
import { constsData as consts } from '../../../data/consts.js';
import { commonFn } from '../../../common/index.js';
import { createLogger } from '../../../logger/index.js';
import { modeData as mode } from '../../../data/mode.js';
const adjustments = consts.adjustments;
const logMode = mode.logging;
const thisModule = 'palette/common/utils/adjust.js';
const coreUtils = commonFn.core;
const logger = await createLogger();
function sl(color) {
    const thisFunction = 'sl()';
    try {
        if (!coreUtils.validate.colorValues(color)) {
            if (logMode.error)
                logger.error('Invalid color valus for adjustment.', `${thisModule} > ${thisFunction}`);
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: coreUtils.brand.asPercentile(adjustedSaturation),
                lightness: coreUtils.brand.asPercentile(adjustedLightness)
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error adjusting saturation and lightness: ${error}`, `${thisModule} > ${thisFunction}`);
        return color;
    }
}
export const adjust = { sl };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRqdXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL3V0aWxzL2FkanVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FBdUM7QUFHdkMsT0FBTyxFQUFFLFVBQVUsSUFBSSxNQUFNLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFekQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUN2QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLE1BQU0sVUFBVSxHQUFHLGdDQUFnQyxDQUFDO0FBRXBELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFFaEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxTQUFTLEVBQUUsQ0FBQyxLQUFVO0lBQ3JCLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQztJQUU1QixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM1QyxJQUFJLE9BQU8sQ0FBQyxLQUFLO2dCQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLHFDQUFxQyxFQUNyQyxHQUFHLFVBQVUsTUFBTSxZQUFZLEVBQUUsQ0FDakMsQ0FBQztZQUVILE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUMxRCxHQUFHLENBQ0gsQ0FBQztRQUNGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QyxPQUFPO1lBQ04sS0FBSyxFQUFFO2dCQUNOLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUc7Z0JBQ3BCLFVBQVUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztnQkFDNUQsU0FBUyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDO2FBQzFEO1lBQ0QsTUFBTSxFQUFFLEtBQUs7U0FDYixDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSztZQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLDZDQUE2QyxLQUFLLEVBQUUsRUFDcEQsR0FBRyxVQUFVLE1BQU0sWUFBWSxFQUFFLENBQ2pDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLEVBQUUsRUFBRSxFQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBwYWxldHRlL2NvbW1vbi91dGlscy9hZGp1c3QuanNcblxuaW1wb3J0IHsgSFNMIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgY29uc3RzRGF0YSBhcyBjb25zdHMgfSBmcm9tICcuLi8uLi8uLi9kYXRhL2NvbnN0cy5qcyc7XG5pbXBvcnQgeyBjb21tb25GbiB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi8uLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4uLy4uLy4uL2RhdGEvbW9kZS5qcyc7XG5cbmNvbnN0IGFkanVzdG1lbnRzID0gY29uc3RzLmFkanVzdG1lbnRzO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuY29uc3QgdGhpc01vZHVsZSA9ICdwYWxldHRlL2NvbW1vbi91dGlscy9hZGp1c3QuanMnO1xuXG5jb25zdCBjb3JlVXRpbHMgPSBjb21tb25Gbi5jb3JlO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZnVuY3Rpb24gc2woY29sb3I6IEhTTCk6IEhTTCB7XG5cdGNvbnN0IHRoaXNGdW5jdGlvbiA9ICdzbCgpJztcblxuXHR0cnkge1xuXHRcdGlmICghY29yZVV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHQnSW52YWxpZCBjb2xvciB2YWx1cyBmb3IgYWRqdXN0bWVudC4nLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYWRqdXN0ZWRTYXR1cmF0aW9uID0gTWF0aC5taW4oXG5cdFx0XHRNYXRoLm1heChjb2xvci52YWx1ZS5zYXR1cmF0aW9uICsgYWRqdXN0bWVudHMuc2xhVmFsdWUsIDApLFxuXHRcdFx0MTAwXG5cdFx0KTtcblx0XHRjb25zdCBhZGp1c3RlZExpZ2h0bmVzcyA9IE1hdGgubWluKDEwMCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBjb2xvci52YWx1ZS5odWUsXG5cdFx0XHRcdHNhdHVyYXRpb246IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUoYWRqdXN0ZWRTYXR1cmF0aW9uKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKGFkanVzdGVkTGlnaHRuZXNzKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgYWRqdXN0aW5nIHNhdHVyYXRpb24gYW5kIGxpZ2h0bmVzczogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGFkanVzdCA9IHsgc2wgfSBhcyBjb25zdDtcbiJdfQ==