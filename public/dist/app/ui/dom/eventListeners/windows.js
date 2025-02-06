// File: app/ui/dom/eventListeners/windows.js
import { domData } from '../../../../data/dom.js';
const divElements = domData.elements.static.divs;
function initWindowListeners() {
    window.addEventListener('click', async (e) => {
        if (divElements.helpMenu)
            if (e.target === divElements.helpMenu) {
                divElements.helpMenu.classList.add('hidden');
            }
    });
    window.addEventListener('click', async (e) => {
        if (divElements.historyMenu)
            if (e.target === divElements.historyMenu) {
                divElements.historyMenu.classList.add('hidden');
            }
    });
}
export const windowListeners = {
    initialize: initWindowListeners
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvdWkvZG9tL2V2ZW50TGlzdGVuZXJzL3dpbmRvd3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkNBQTZDO0FBRTdDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVsRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFFakQsU0FBUyxtQkFBbUI7SUFDM0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBYSxFQUFFLEVBQUU7UUFDeEQsSUFBSSxXQUFXLENBQUMsUUFBUTtZQUN2QixJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN2QyxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUMsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBYSxFQUFFLEVBQUU7UUFDeEQsSUFBSSxXQUFXLENBQUMsV0FBVztZQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMxQyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakQsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRztJQUM5QixVQUFVLEVBQUUsbUJBQW1CO0NBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBhcHAvdWkvZG9tL2V2ZW50TGlzdGVuZXJzL3dpbmRvd3MuanNcblxuaW1wb3J0IHsgZG9tRGF0YSB9IGZyb20gJy4uLy4uLy4uLy4uL2RhdGEvZG9tLmpzJztcblxuY29uc3QgZGl2RWxlbWVudHMgPSBkb21EYXRhLmVsZW1lbnRzLnN0YXRpYy5kaXZzO1xuXG5mdW5jdGlvbiBpbml0V2luZG93TGlzdGVuZXJzKCk6IHZvaWQge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmIChkaXZFbGVtZW50cy5oZWxwTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gZGl2RWxlbWVudHMuaGVscE1lbnUpIHtcblx0XHRcdFx0ZGl2RWxlbWVudHMuaGVscE1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKGRpdkVsZW1lbnRzLmhpc3RvcnlNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSBkaXZFbGVtZW50cy5oaXN0b3J5TWVudSkge1xuXHRcdFx0XHRkaXZFbGVtZW50cy5oaXN0b3J5TWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBjb25zdCB3aW5kb3dMaXN0ZW5lcnMgPSB7XG5cdGluaXRpYWxpemU6IGluaXRXaW5kb3dMaXN0ZW5lcnNcbn07XG4iXX0=