// File: src/paelette/common/paletteUtils/probability.ts
import { config } from '../../../config';
const mode = config.mode;
const probabilities = config.consts.probabilities;
function getWeightedRandomInterval() {
    try {
        const weights = probabilities.weights;
        const probabilityValues = probabilities.values;
        const cumulativeProbabilities = probabilityValues.reduce((acc, prob, i) => {
            acc[i] = (acc[i - 1] || 0) + prob;
            return acc;
        }, []);
        const random = Math.random();
        for (let i = 0; i < cumulativeProbabilities.length; i++) {
            if (random < cumulativeProbabilities[i]) {
                return weights[i];
            }
        }
        return weights[weights.length - 1];
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error generating weighted random interval: ${error}`);
        return 50;
    }
}
export const probability = { getWeightedRandomInterval };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvYmFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcGFsZXR0ZS9jb21tb24vcGFsZXR0ZVV0aWxzL3Byb2JhYmlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHdEQUF3RDtBQUV4RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFekMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN6QixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUVsRCxTQUFTLHlCQUF5QjtJQUNqQyxJQUFJLENBQUM7UUFDSixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQ3RDLE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUMvQyxNQUFNLHVCQUF1QixHQUFhLGlCQUFpQixDQUFDLE1BQU0sQ0FDakUsQ0FBQyxHQUFhLEVBQUUsSUFBWSxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQzFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2xDLE9BQU8sR0FBRyxDQUFDO1FBQ1osQ0FBQyxFQUNELEVBQUUsQ0FDRixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN6RCxJQUFJLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN6QyxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixDQUFDO1FBQ0YsQ0FBQztRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsS0FBSyxDQUNaLDhDQUE4QyxLQUFLLEVBQUUsQ0FDckQsQ0FBQztRQUVILE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsRUFBRSx5QkFBeUIsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL3BhZWxldHRlL2NvbW1vbi9wYWxldHRlVXRpbHMvcHJvYmFiaWxpdHkudHNcblxuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vY29uZmlnJztcblxuY29uc3QgbW9kZSA9IGNvbmZpZy5tb2RlO1xuY29uc3QgcHJvYmFiaWxpdGllcyA9IGNvbmZpZy5jb25zdHMucHJvYmFiaWxpdGllcztcblxuZnVuY3Rpb24gZ2V0V2VpZ2h0ZWRSYW5kb21JbnRlcnZhbCgpOiBudW1iZXIge1xuXHR0cnkge1xuXHRcdGNvbnN0IHdlaWdodHMgPSBwcm9iYWJpbGl0aWVzLndlaWdodHM7XG5cdFx0Y29uc3QgcHJvYmFiaWxpdHlWYWx1ZXMgPSBwcm9iYWJpbGl0aWVzLnZhbHVlcztcblx0XHRjb25zdCBjdW11bGF0aXZlUHJvYmFiaWxpdGllczogbnVtYmVyW10gPSBwcm9iYWJpbGl0eVZhbHVlcy5yZWR1Y2UoXG5cdFx0XHQoYWNjOiBudW1iZXJbXSwgcHJvYjogbnVtYmVyLCBpOiBudW1iZXIpID0+IHtcblx0XHRcdFx0YWNjW2ldID0gKGFjY1tpIC0gMV0gfHwgMCkgKyBwcm9iO1xuXHRcdFx0XHRyZXR1cm4gYWNjO1xuXHRcdFx0fSxcblx0XHRcdFtdXG5cdFx0KTtcblx0XHRjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdW11bGF0aXZlUHJvYmFiaWxpdGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHJhbmRvbSA8IGN1bXVsYXRpdmVQcm9iYWJpbGl0aWVzW2ldKSB7XG5cdFx0XHRcdHJldHVybiB3ZWlnaHRzW2ldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB3ZWlnaHRzW3dlaWdodHMubGVuZ3RoIC0gMV07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEVycm9yIGdlbmVyYXRpbmcgd2VpZ2h0ZWQgcmFuZG9tIGludGVydmFsOiAke2Vycm9yfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gNTA7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHByb2JhYmlsaXR5ID0geyBnZXRXZWlnaHRlZFJhbmRvbUludGVydmFsIH07XG4iXX0=