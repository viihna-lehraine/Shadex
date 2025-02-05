// File: app/dom/eventListeners/index.js
import { btnListeners } from './btns.js';
import { dadListeners } from './dad.js';
import { paletteListeners } from './palette.js';
import { tempListeners } from './temp.js';
import { windowListeners } from './windows.js';
const btns = btnListeners;
const windows = windowListeners;
export function initializeEventListeners(uiManager) {
    btns.initialize.conversionBtns();
    btns.initialize.main(uiManager);
    windows.initialize();
}
export const eventListenerFn = {
    initializeEventListeners,
    btn: btnListeners,
    dad: dadListeners,
    palette: paletteListeners,
    temp: tempListeners,
    window: windowListeners
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL2RvbS9ldmVudExpc3RlbmVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3Q0FBd0M7QUFJeEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNoRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFL0MsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDO0FBQzFCLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQztBQUVoQyxNQUFNLFVBQVUsd0JBQXdCLENBQUMsU0FBb0I7SUFDNUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUVqQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVoQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDdEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBbUM7SUFDOUQsd0JBQXdCO0lBQ3hCLEdBQUcsRUFBRSxZQUFZO0lBQ2pCLEdBQUcsRUFBRSxZQUFZO0lBQ2pCLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsTUFBTSxFQUFFLGVBQWU7Q0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGFwcC9kb20vZXZlbnRMaXN0ZW5lcnMvaW5kZXguanNcblxuaW1wb3J0IHsgRE9NRm5fRXZlbnRMaXN0ZW5lckZuSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHR5cGUgeyBVSU1hbmFnZXIgfSBmcm9tICcuLi8uLi91aS9VSU1hbmFnZXIuanMnO1xuaW1wb3J0IHsgYnRuTGlzdGVuZXJzIH0gZnJvbSAnLi9idG5zLmpzJztcbmltcG9ydCB7IGRhZExpc3RlbmVycyB9IGZyb20gJy4vZGFkLmpzJztcbmltcG9ydCB7IHBhbGV0dGVMaXN0ZW5lcnMgfSBmcm9tICcuL3BhbGV0dGUuanMnO1xuaW1wb3J0IHsgdGVtcExpc3RlbmVycyB9IGZyb20gJy4vdGVtcC5qcyc7XG5pbXBvcnQgeyB3aW5kb3dMaXN0ZW5lcnMgfSBmcm9tICcuL3dpbmRvd3MuanMnO1xuXG5jb25zdCBidG5zID0gYnRuTGlzdGVuZXJzO1xuY29uc3Qgd2luZG93cyA9IHdpbmRvd0xpc3RlbmVycztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVFdmVudExpc3RlbmVycyh1aU1hbmFnZXI6IFVJTWFuYWdlcik6IHZvaWQge1xuXHRidG5zLmluaXRpYWxpemUuY29udmVyc2lvbkJ0bnMoKTtcblxuXHRidG5zLmluaXRpYWxpemUubWFpbih1aU1hbmFnZXIpO1xuXG5cdHdpbmRvd3MuaW5pdGlhbGl6ZSgpO1xufVxuXG5leHBvcnQgY29uc3QgZXZlbnRMaXN0ZW5lckZuOiBET01Gbl9FdmVudExpc3RlbmVyRm5JbnRlcmZhY2UgPSB7XG5cdGluaXRpYWxpemVFdmVudExpc3RlbmVycyxcblx0YnRuOiBidG5MaXN0ZW5lcnMsXG5cdGRhZDogZGFkTGlzdGVuZXJzLFxuXHRwYWxldHRlOiBwYWxldHRlTGlzdGVuZXJzLFxuXHR0ZW1wOiB0ZW1wTGlzdGVuZXJzLFxuXHR3aW5kb3c6IHdpbmRvd0xpc3RlbmVyc1xufTtcbiJdfQ==