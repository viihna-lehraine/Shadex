// File: src/data/config.js
const DEFAULT_KEYS = {
    APP_SETTINGS: 'appSettings',
    CUSTOM_COLOR: 'customColor'
};
const DEFAULT_SETTINGS = {
    colorSpace: 'hsl',
    lastTableID: 0,
    theme: 'light',
    loggingEnabled: true
};
const STORE_NAMES = {
    APP_SETTINGS: 'appSettings',
    CUSTOM_COLOR: 'customColor',
    MUTATIONS: 'mutations',
    PALLETES: 'palettes',
    SETTINGS: 'settings',
    TABLES: 'tables'
};
const db = { DEFAULT_KEYS, DEFAULT_SETTINGS, STORE_NAMES };
const regex = {
    colors: {
        cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
    },
    file: {
        palette: {
            css: {
                color: /\.color-\d+\s*{\s*([\s\S]*?)\s*}/i,
                metadata: /\.palette\s*{\s*([\s\S]*?)\s*}/i
            }
        }
    }
};
export const configData = { db, regex };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RhdGEvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJCQUEyQjtBQUkzQixNQUFNLFlBQVksR0FBRztJQUNwQixZQUFZLEVBQUUsYUFBYTtJQUMzQixZQUFZLEVBQUUsYUFBYTtDQUMzQixDQUFDO0FBRUYsTUFBTSxnQkFBZ0IsR0FBRztJQUN4QixVQUFVLEVBQUUsS0FBbUI7SUFDL0IsV0FBVyxFQUFFLENBQUM7SUFDZCxLQUFLLEVBQUUsT0FBMkI7SUFDbEMsY0FBYyxFQUFFLElBQUk7Q0FDcEIsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHO0lBQ25CLFlBQVksRUFBRSxhQUFhO0lBQzNCLFlBQVksRUFBRSxhQUFhO0lBQzNCLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLE1BQU0sRUFBRSxRQUFRO0NBQ2hCLENBQUM7QUFFRixNQUFNLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsQ0FBQztBQUUzRCxNQUFNLEtBQUssR0FBaUM7SUFDM0MsTUFBTSxFQUFFO1FBQ1AsSUFBSSxFQUFFLG9FQUFvRTtRQUMxRSxHQUFHLEVBQUUsb0NBQW9DO1FBQ3pDLEdBQUcsRUFBRSwrREFBK0Q7UUFDcEUsR0FBRyxFQUFFLCtEQUErRDtRQUNwRSxHQUFHLEVBQUUsMkRBQTJEO1FBQ2hFLEdBQUcsRUFBRSwyREFBMkQ7UUFDaEUsR0FBRyxFQUFFLDJEQUEyRDtLQUNoRTtJQUNELElBQUksRUFBRTtRQUNMLE9BQU8sRUFBRTtZQUNSLEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUUsbUNBQW1DO2dCQUMxQyxRQUFRLEVBQUUsaUNBQWlDO2FBQzNDO1NBQ0Q7S0FDRDtDQUNELENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQXdCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2RhdGEvY29uZmlnLmpzXG5cbmltcG9ydCB7IENvbmZpZ0RhdGFJbnRlcmZhY2UsIENvbG9yU3BhY2UgfSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5cbmNvbnN0IERFRkFVTFRfS0VZUyA9IHtcblx0QVBQX1NFVFRJTkdTOiAnYXBwU2V0dGluZ3MnLFxuXHRDVVNUT01fQ09MT1I6ICdjdXN0b21Db2xvcidcbn07XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1MgPSB7XG5cdGNvbG9yU3BhY2U6ICdoc2wnIGFzIENvbG9yU3BhY2UsXG5cdGxhc3RUYWJsZUlEOiAwLFxuXHR0aGVtZTogJ2xpZ2h0JyBhcyAnbGlnaHQnIHwgJ2RhcmsnLFxuXHRsb2dnaW5nRW5hYmxlZDogdHJ1ZVxufTtcblxuY29uc3QgU1RPUkVfTkFNRVMgPSB7XG5cdEFQUF9TRVRUSU5HUzogJ2FwcFNldHRpbmdzJyxcblx0Q1VTVE9NX0NPTE9SOiAnY3VzdG9tQ29sb3InLFxuXHRNVVRBVElPTlM6ICdtdXRhdGlvbnMnLFxuXHRQQUxMRVRFUzogJ3BhbGV0dGVzJyxcblx0U0VUVElOR1M6ICdzZXR0aW5ncycsXG5cdFRBQkxFUzogJ3RhYmxlcydcbn07XG5cbmNvbnN0IGRiID0geyBERUZBVUxUX0tFWVMsIERFRkFVTFRfU0VUVElOR1MsIFNUT1JFX05BTUVTIH07XG5cbmNvbnN0IHJlZ2V4OiBDb25maWdEYXRhSW50ZXJmYWNlWydyZWdleCddID0ge1xuXHRjb2xvcnM6IHtcblx0XHRjbXlrOiAvY215a1xcKChcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQrKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGhleDogL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezh9KSQvLFxuXHRcdGhzbDogL2hzbFxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspJT8sXFxzKihbXFxkLl0rKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGhzdjogL2hzdlxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspJT8sXFxzKihbXFxkLl0rKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGxhYjogL2xhYlxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspLFxccyooW1xcZC5dKykoPzosXFxzKihbXFxkLl0rKSk/XFwpL2ksXG5cdFx0cmdiOiAvcmdiXFwoKFtcXGQuXSspLFxccyooW1xcZC5dKyksXFxzKihbXFxkLl0rKSg/OixcXHMqKFtcXGQuXSspKT9cXCkvaSxcblx0XHR4eXo6IC94eXpcXCgoW1xcZC5dKyksXFxzKihbXFxkLl0rKSxcXHMqKFtcXGQuXSspKD86LFxccyooW1xcZC5dKykpP1xcKS9pXG5cdH0sXG5cdGZpbGU6IHtcblx0XHRwYWxldHRlOiB7XG5cdFx0XHRjc3M6IHtcblx0XHRcdFx0Y29sb3I6IC9cXC5jb2xvci1cXGQrXFxzKntcXHMqKFtcXHNcXFNdKj8pXFxzKn0vaSxcblx0XHRcdFx0bWV0YWRhdGE6IC9cXC5wYWxldHRlXFxzKntcXHMqKFtcXHNcXFNdKj8pXFxzKn0vaVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ0RhdGE6IENvbmZpZ0RhdGFJbnRlcmZhY2UgPSB7IGRiLCByZWdleCB9IGFzIGNvbnN0O1xuIl19