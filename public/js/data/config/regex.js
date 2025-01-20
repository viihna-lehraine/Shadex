// File: src/../config/regex.ts
export const regex = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0YS9jb25maWcvcmVnZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBSS9CLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBeUI7SUFDMUMsTUFBTSxFQUFFO1FBQ1AsSUFBSSxFQUFFLG9FQUFvRTtRQUMxRSxHQUFHLEVBQUUsb0NBQW9DO1FBQ3pDLEdBQUcsRUFBRSwrREFBK0Q7UUFDcEUsR0FBRyxFQUFFLCtEQUErRDtRQUNwRSxHQUFHLEVBQUUsMkRBQTJEO1FBQ2hFLEdBQUcsRUFBRSwyREFBMkQ7UUFDaEUsR0FBRyxFQUFFLDJEQUEyRDtLQUNoRTtJQUNELElBQUksRUFBRTtRQUNMLE9BQU8sRUFBRTtZQUNSLEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUUsbUNBQW1DO2dCQUMxQyxRQUFRLEVBQUUsaUNBQWlDO2FBQzNDO1NBQ0Q7S0FDRDtDQUNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvLi4vY29uZmlnL3JlZ2V4LnRzXG5cbmltcG9ydCB7IENvbmZpZ1JlZ2V4SW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuXG5leHBvcnQgY29uc3QgcmVnZXg6IENvbmZpZ1JlZ2V4SW50ZXJmYWNlID0ge1xuXHRjb2xvcnM6IHtcblx0XHRjbXlrOiAvY215a1xcKChcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQrKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGhleDogL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezh9KSQvLFxuXHRcdGhzbDogL2hzbFxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspJT8sXFxzKihbXFxkLl0rKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGhzdjogL2hzdlxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspJT8sXFxzKihbXFxkLl0rKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGxhYjogL2xhYlxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspLFxccyooW1xcZC5dKykoPzosXFxzKihbXFxkLl0rKSk/XFwpL2ksXG5cdFx0cmdiOiAvcmdiXFwoKFtcXGQuXSspLFxccyooW1xcZC5dKyksXFxzKihbXFxkLl0rKSg/OixcXHMqKFtcXGQuXSspKT9cXCkvaSxcblx0XHR4eXo6IC94eXpcXCgoW1xcZC5dKyksXFxzKihbXFxkLl0rKSxcXHMqKFtcXGQuXSspKD86LFxccyooW1xcZC5dKykpP1xcKS9pXG5cdH0sXG5cdGZpbGU6IHtcblx0XHRwYWxldHRlOiB7XG5cdFx0XHRjc3M6IHtcblx0XHRcdFx0Y29sb3I6IC9cXC5jb2xvci1cXGQrXFxzKntcXHMqKFtcXHNcXFNdKj8pXFxzKn0vaSxcblx0XHRcdFx0bWV0YWRhdGE6IC9cXC5wYWxldHRlXFxzKntcXHMqKFtcXHNcXFNdKj8pXFxzKn0vaVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcbiJdfQ==