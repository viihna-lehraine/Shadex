// File: src/paelette/common/paletteUtils/probability.js
import { consts, mode } from '../../../common/data/base.js';
import { createLogger } from '../../../logger/index.js';
const logger = await createLogger();
const logMode = mode.logging;
const probabilities = consts.probabilities;
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
            if (random < cumulativeProbabilities[i])
                return weights[i];
        }
        return weights[weights.length - 1];
    }
    catch (error) {
        if (logMode.error)
            // eslint-disable-next-line prettier/prettier
            logger.error(`Error generating weighted random interval: ${error}`, 'palette > common > paletteUtils > getWeightedRandomInterval()');
        return 50;
    }
}
export const probability = {
    getWeightedRandomInterval
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvYmFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcGFsZXR0ZS9jb21tb24vcGFsZXR0ZVV0aWxzL3Byb2JhYmlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHdEQUF3RDtBQUV4RCxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV4RCxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUUzQyxTQUFTLHlCQUF5QjtJQUNqQyxJQUFJLENBQUM7UUFDSixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQ3RDLE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUMvQyxNQUFNLHVCQUF1QixHQUFhLGlCQUFpQixDQUFDLE1BQU0sQ0FDakUsQ0FBQyxHQUFhLEVBQUUsSUFBWSxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQzFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBRWxDLE9BQU8sR0FBRyxDQUFDO1FBQ1osQ0FBQyxFQUNELEVBQUUsQ0FDRixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN6RCxJQUFJLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSztZQUNoQiw2Q0FBNkM7WUFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsS0FBSyxFQUFFLEVBQUUsK0RBQStELENBQUMsQ0FBQztRQUV0SSxPQUFPLEVBQUUsQ0FBQztJQUNYLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHO0lBQzFCLHlCQUF5QjtDQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL3BhZWxldHRlL2NvbW1vbi9wYWxldHRlVXRpbHMvcHJvYmFiaWxpdHkuanNcblxuaW1wb3J0IHsgY29uc3RzLCBtb2RlIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2RhdGEvYmFzZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi8uLi9sb2dnZXIvaW5kZXguanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcbmNvbnN0IHByb2JhYmlsaXRpZXMgPSBjb25zdHMucHJvYmFiaWxpdGllcztcblxuZnVuY3Rpb24gZ2V0V2VpZ2h0ZWRSYW5kb21JbnRlcnZhbCgpOiBudW1iZXIge1xuXHR0cnkge1xuXHRcdGNvbnN0IHdlaWdodHMgPSBwcm9iYWJpbGl0aWVzLndlaWdodHM7XG5cdFx0Y29uc3QgcHJvYmFiaWxpdHlWYWx1ZXMgPSBwcm9iYWJpbGl0aWVzLnZhbHVlcztcblx0XHRjb25zdCBjdW11bGF0aXZlUHJvYmFiaWxpdGllczogbnVtYmVyW10gPSBwcm9iYWJpbGl0eVZhbHVlcy5yZWR1Y2UoXG5cdFx0XHQoYWNjOiBudW1iZXJbXSwgcHJvYjogbnVtYmVyLCBpOiBudW1iZXIpID0+IHtcblx0XHRcdFx0YWNjW2ldID0gKGFjY1tpIC0gMV0gfHwgMCkgKyBwcm9iO1xuXG5cdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHR9LFxuXHRcdFx0W11cblx0XHQpO1xuXHRcdGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1bXVsYXRpdmVQcm9iYWJpbGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAocmFuZG9tIDwgY3VtdWxhdGl2ZVByb2JhYmlsaXRpZXNbaV0pIHJldHVybiB3ZWlnaHRzW2ldO1xuXHRcdH1cblxuXHRcdHJldHVybiB3ZWlnaHRzW3dlaWdodHMubGVuZ3RoIC0gMV07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJldHRpZXIvcHJldHRpZXJcblx0XHRcdGxvZ2dlci5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyB3ZWlnaHRlZCByYW5kb20gaW50ZXJ2YWw6ICR7ZXJyb3J9YCwgJ3BhbGV0dGUgPiBjb21tb24gPiBwYWxldHRlVXRpbHMgPiBnZXRXZWlnaHRlZFJhbmRvbUludGVydmFsKCknKTtcblxuXHRcdHJldHVybiA1MDtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgcHJvYmFiaWxpdHkgPSB7XG5cdGdldFdlaWdodGVkUmFuZG9tSW50ZXJ2YWxcbn0gYXMgY29uc3Q7XG4iXX0=