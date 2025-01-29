// File: palette/common/utils/adjust.js
import { constsData as consts } from '../../../data/consts.js';
import { coreUtils, helpers } from '../../../common/index.js';
import { createLogger } from '../../../logger/index.js';
import { modeData as mode } from '../../../data/mode.js';
const adjustments = consts.adjustments;
const logMode = mode.logging;
const thisModule = 'palette/common/utils/adjust.js';
const logger = await createLogger();
function sl(color) {
    const thisFunction = 'sl()';
    try {
        if (!coreUtils.validate.colorValues(color)) {
            if (logMode.error)
                logger.error('Invalid color valus for adjustment.', `${thisModule} > ${thisFunction}`);
            helpers.dom.showToast('Invalid color values');
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: coreUtils.brand.asPercentile(adjustedSaturation),
                lightness: coreUtils.brand.asPercentile(adjustedLightness),
                alpha: color.value.alpha
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRqdXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL3V0aWxzL2FkanVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FBdUM7QUFHdkMsT0FBTyxFQUFFLFVBQVUsSUFBSSxNQUFNLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXpELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixNQUFNLFVBQVUsR0FBRyxnQ0FBZ0MsQ0FBQztBQUVwRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLFNBQVMsRUFBRSxDQUFDLEtBQVU7SUFDckIsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDO0lBRTVCLElBQUksQ0FBQztRQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzVDLElBQUksT0FBTyxDQUFDLEtBQUs7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQ1gscUNBQXFDLEVBQ3JDLEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO1lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUU5QyxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFDMUQsR0FBRyxDQUNILENBQUM7UUFDRixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFeEMsT0FBTztZQUNOLEtBQUssRUFBRTtnQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHO2dCQUNwQixVQUFVLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7Z0JBQzVELFNBQVMsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQztnQkFDMUQsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSzthQUN4QjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2IsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxDQUFDLEtBQUs7WUFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCw2Q0FBNkMsS0FBSyxFQUFFLEVBQ3BELEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO1FBRUgsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxFQUFFLEVBQUUsRUFBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogcGFsZXR0ZS9jb21tb24vdXRpbHMvYWRqdXN0LmpzXG5cbmltcG9ydCB7IEhTTCB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbnN0c0RhdGEgYXMgY29uc3RzIH0gZnJvbSAnLi4vLi4vLi4vZGF0YS9jb25zdHMuanMnO1xuaW1wb3J0IHsgY29yZVV0aWxzLCBoZWxwZXJzIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uLy4uLy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vLi4vLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgYWRqdXN0bWVudHMgPSBjb25zdHMuYWRqdXN0bWVudHM7XG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ3BhbGV0dGUvY29tbW9uL3V0aWxzL2FkanVzdC5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5mdW5jdGlvbiBzbChjb2xvcjogSFNMKTogSFNMIHtcblx0Y29uc3QgdGhpc0Z1bmN0aW9uID0gJ3NsKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlVXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdCdJbnZhbGlkIGNvbG9yIHZhbHVzIGZvciBhZGp1c3RtZW50LicsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNGdW5jdGlvbn1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvciB2YWx1ZXMnKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFkanVzdGVkU2F0dXJhdGlvbiA9IE1hdGgubWluKFxuXHRcdFx0TWF0aC5tYXgoY29sb3IudmFsdWUuc2F0dXJhdGlvbiArIGFkanVzdG1lbnRzLnNsYVZhbHVlLCAwKSxcblx0XHRcdDEwMFxuXHRcdCk7XG5cdFx0Y29uc3QgYWRqdXN0ZWRMaWdodG5lc3MgPSBNYXRoLm1pbigxMDApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogY29sb3IudmFsdWUuaHVlLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKGFkanVzdGVkU2F0dXJhdGlvbiksXG5cdFx0XHRcdGxpZ2h0bmVzczogY29yZVV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShhZGp1c3RlZExpZ2h0bmVzcyksXG5cdFx0XHRcdGFscGhhOiBjb2xvci52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgYWRqdXN0aW5nIHNhdHVyYXRpb24gYW5kIGxpZ2h0bmVzczogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGFkanVzdCA9IHsgc2wgfSBhcyBjb25zdDtcbiJdfQ==