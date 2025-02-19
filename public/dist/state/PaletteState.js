// File: state/PaletteState.ts
export class PaletteState {
    stateManager;
    errors;
    utils;
    constructor(stateManager, services, utils) {
        this.stateManager = stateManager;
        this.errors = services.errors;
        this.utils = utils;
    }
    updatePaletteItemColor(columnID, newColor) {
        this.errors.handle(() => {
            const currentState = this.stateManager.getState();
            const latestPalette = currentState.paletteHistory[0];
            if (!latestPalette)
                return;
            // find the PaletteItem corresponding to this column
            const updatedItems = latestPalette.items.map(item => {
                if (item.itemID !== columnID)
                    return item;
                const parsedNewColor = this.utils.color.convertCSSToColor(newColor);
                if (!parsedNewColor)
                    throw new Error('Invalid color value');
                // ensure color is in HSL format
                const hslColor = parsedNewColor.format === 'hsl'
                    ? parsedNewColor
                    : this.utils.color.convertToHSL(parsedNewColor);
                // generate all color representations (ensuring correct branded types)
                const allColors = this.utils.palette.generateAllColorValues(hslColor);
                // ensure CSS representations match expected format
                const structuredCSS = {
                    cmyk: this.utils.color.convertColorToCSS(allColors.cmyk),
                    hex: this.utils.color.convertColorToCSS(allColors.hex),
                    hsl: this.utils.color.convertColorToCSS(allColors.hsl),
                    hsv: this.utils.color.convertColorToCSS(allColors.hsv),
                    lab: this.utils.color.convertColorToCSS(allColors.lab),
                    rgb: this.utils.color.convertColorToCSS(allColors.rgb),
                    xyz: this.utils.color.convertColorToCSS(allColors.xyz)
                };
                return {
                    ...item,
                    colors: allColors,
                    css: structuredCSS
                };
            });
            // ensure column state is updated
            const updatedColumns = updatedItems.map((item, index) => ({
                id: item.itemID,
                isLocked: currentState.paletteContainer.columns[index].isLocked,
                position: index + 1,
                size: currentState.paletteContainer.columns[index].size
            }));
            // update state history with type assertions
            this.stateManager.updatePaletteColumns(updatedColumns, true, 3);
            this.stateManager.updatePaletteHistory([
                { ...latestPalette, items: updatedItems },
                ...currentState.paletteHistory.slice(1)
            ]);
        }, 'Failed to update palette item color', { columnID, newColor });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFsZXR0ZVN0YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0YXRlL1BhbGV0dGVTdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFXOUIsTUFBTSxPQUFPLFlBQVk7SUFLZjtJQUpELE1BQU0sQ0FBOEI7SUFDcEMsS0FBSyxDQUFxQjtJQUVsQyxZQUNTLFlBQTBCLEVBQ2xDLFFBQTJCLEVBQzNCLEtBQXlCO1FBRmpCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBSWxDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRU0sc0JBQXNCLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUMvRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FDakIsR0FBRyxFQUFFO1lBQ0osTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsRCxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJELElBQUksQ0FBQyxhQUFhO2dCQUFFLE9BQU87WUFFM0Isb0RBQW9EO1lBQ3BELE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUTtvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFFMUMsTUFBTSxjQUFjLEdBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsY0FBYztvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBRTVELGdDQUFnQztnQkFDaEMsTUFBTSxRQUFRLEdBQ2IsY0FBYyxDQUFDLE1BQU0sS0FBSyxLQUFLO29CQUM5QixDQUFDLENBQUMsY0FBYztvQkFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFFbEQsc0VBQXNFO2dCQUN0RSxNQUFNLFNBQVMsR0FDZCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFckQsbURBQW1EO2dCQUNuRCxNQUFNLGFBQWEsR0FBRztvQkFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUN2QyxTQUFTLENBQUMsSUFBSSxDQUNkO29CQUNELEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO29CQUN0RCxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztvQkFDdEQsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7b0JBQ3RELEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO29CQUN0RCxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztvQkFDdEQsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7aUJBQ3RELENBQUM7Z0JBRUYsT0FBTztvQkFDTixHQUFHLElBQUk7b0JBQ1AsTUFBTSxFQUFFLFNBQVM7b0JBQ2pCLEdBQUcsRUFBRSxhQUFhO2lCQUNsQixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxpQ0FBaUM7WUFDakMsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3pELEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDZixRQUFRLEVBQ1AsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRO2dCQUN0RCxRQUFRLEVBQUUsS0FBSyxHQUFHLENBQUM7Z0JBQ25CLElBQUksRUFBRSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUk7YUFDdkQsQ0FBQyxDQUFDLENBQUM7WUFFSiw0Q0FBNEM7WUFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3RDLEVBQUUsR0FBRyxhQUFhLEVBQUUsS0FBSyxFQUFFLFlBQTZCLEVBQUU7Z0JBQzFELEdBQUcsWUFBWSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3ZDLENBQUMsQ0FBQztRQUNKLENBQUMsRUFDRCxxQ0FBcUMsRUFDckMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQ3RCLENBQUM7SUFDSCxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzdGF0ZS9QYWxldHRlU3RhdGUudHNcblxuaW1wb3J0IHtcblx0QWxsQ29sb3JzLFxuXHRQYWxldHRlSXRlbSxcblx0UGFsZXR0ZVN0YXRlSW50ZXJmYWNlLFxuXHRTZXJ2aWNlc0ludGVyZmFjZSxcblx0VXRpbGl0aWVzSW50ZXJmYWNlXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IFN0YXRlTWFuYWdlciB9IGZyb20gJy4vU3RhdGVNYW5hZ2VyLmpzJztcblxuZXhwb3J0IGNsYXNzIFBhbGV0dGVTdGF0ZSBpbXBsZW1lbnRzIFBhbGV0dGVTdGF0ZUludGVyZmFjZSB7XG5cdHByaXZhdGUgZXJyb3JzOiBTZXJ2aWNlc0ludGVyZmFjZVsnZXJyb3JzJ107XG5cdHByaXZhdGUgdXRpbHM6IFV0aWxpdGllc0ludGVyZmFjZTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHN0YXRlTWFuYWdlcjogU3RhdGVNYW5hZ2VyLFxuXHRcdHNlcnZpY2VzOiBTZXJ2aWNlc0ludGVyZmFjZSxcblx0XHR1dGlsczogVXRpbGl0aWVzSW50ZXJmYWNlXG5cdCkge1xuXHRcdHRoaXMuZXJyb3JzID0gc2VydmljZXMuZXJyb3JzO1xuXHRcdHRoaXMudXRpbHMgPSB1dGlscztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVQYWxldHRlSXRlbUNvbG9yKGNvbHVtbklEOiBudW1iZXIsIG5ld0NvbG9yOiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHRoaXMuc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCk7XG5cdFx0XHRcdGNvbnN0IGxhdGVzdFBhbGV0dGUgPSBjdXJyZW50U3RhdGUucGFsZXR0ZUhpc3RvcnlbMF07XG5cblx0XHRcdFx0aWYgKCFsYXRlc3RQYWxldHRlKSByZXR1cm47XG5cblx0XHRcdFx0Ly8gZmluZCB0aGUgUGFsZXR0ZUl0ZW0gY29ycmVzcG9uZGluZyB0byB0aGlzIGNvbHVtblxuXHRcdFx0XHRjb25zdCB1cGRhdGVkSXRlbXMgPSBsYXRlc3RQYWxldHRlLml0ZW1zLm1hcChpdGVtID0+IHtcblx0XHRcdFx0XHRpZiAoaXRlbS5pdGVtSUQgIT09IGNvbHVtbklEKSByZXR1cm4gaXRlbTtcblxuXHRcdFx0XHRcdGNvbnN0IHBhcnNlZE5ld0NvbG9yID1cblx0XHRcdFx0XHRcdHRoaXMudXRpbHMuY29sb3IuY29udmVydENTU1RvQ29sb3IobmV3Q29sb3IpO1xuXHRcdFx0XHRcdGlmICghcGFyc2VkTmV3Q29sb3IpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xvciB2YWx1ZScpO1xuXG5cdFx0XHRcdFx0Ly8gZW5zdXJlIGNvbG9yIGlzIGluIEhTTCBmb3JtYXRcblx0XHRcdFx0XHRjb25zdCBoc2xDb2xvciA9XG5cdFx0XHRcdFx0XHRwYXJzZWROZXdDb2xvci5mb3JtYXQgPT09ICdoc2wnXG5cdFx0XHRcdFx0XHRcdD8gcGFyc2VkTmV3Q29sb3Jcblx0XHRcdFx0XHRcdFx0OiB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRUb0hTTChwYXJzZWROZXdDb2xvcik7XG5cblx0XHRcdFx0XHQvLyBnZW5lcmF0ZSBhbGwgY29sb3IgcmVwcmVzZW50YXRpb25zIChlbnN1cmluZyBjb3JyZWN0IGJyYW5kZWQgdHlwZXMpXG5cdFx0XHRcdFx0Y29uc3QgYWxsQ29sb3JzOiBBbGxDb2xvcnMgPVxuXHRcdFx0XHRcdFx0dGhpcy51dGlscy5wYWxldHRlLmdlbmVyYXRlQWxsQ29sb3JWYWx1ZXMoaHNsQ29sb3IpO1xuXG5cdFx0XHRcdFx0Ly8gZW5zdXJlIENTUyByZXByZXNlbnRhdGlvbnMgbWF0Y2ggZXhwZWN0ZWQgZm9ybWF0XG5cdFx0XHRcdFx0Y29uc3Qgc3RydWN0dXJlZENTUyA9IHtcblx0XHRcdFx0XHRcdGNteWs6IHRoaXMudXRpbHMuY29sb3IuY29udmVydENvbG9yVG9DU1MoXG5cdFx0XHRcdFx0XHRcdGFsbENvbG9ycy5jbXlrXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0aGV4OiB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKGFsbENvbG9ycy5oZXgpLFxuXHRcdFx0XHRcdFx0aHNsOiB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKGFsbENvbG9ycy5oc2wpLFxuXHRcdFx0XHRcdFx0aHN2OiB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKGFsbENvbG9ycy5oc3YpLFxuXHRcdFx0XHRcdFx0bGFiOiB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKGFsbENvbG9ycy5sYWIpLFxuXHRcdFx0XHRcdFx0cmdiOiB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKGFsbENvbG9ycy5yZ2IpLFxuXHRcdFx0XHRcdFx0eHl6OiB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKGFsbENvbG9ycy54eXopXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHQuLi5pdGVtLFxuXHRcdFx0XHRcdFx0Y29sb3JzOiBhbGxDb2xvcnMsXG5cdFx0XHRcdFx0XHRjc3M6IHN0cnVjdHVyZWRDU1Ncblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBlbnN1cmUgY29sdW1uIHN0YXRlIGlzIHVwZGF0ZWRcblx0XHRcdFx0Y29uc3QgdXBkYXRlZENvbHVtbnMgPSB1cGRhdGVkSXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4gKHtcblx0XHRcdFx0XHRpZDogaXRlbS5pdGVtSUQsXG5cdFx0XHRcdFx0aXNMb2NrZWQ6XG5cdFx0XHRcdFx0XHRjdXJyZW50U3RhdGUucGFsZXR0ZUNvbnRhaW5lci5jb2x1bW5zW2luZGV4XS5pc0xvY2tlZCxcblx0XHRcdFx0XHRwb3NpdGlvbjogaW5kZXggKyAxLFxuXHRcdFx0XHRcdHNpemU6IGN1cnJlbnRTdGF0ZS5wYWxldHRlQ29udGFpbmVyLmNvbHVtbnNbaW5kZXhdLnNpemVcblx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdC8vIHVwZGF0ZSBzdGF0ZSBoaXN0b3J5IHdpdGggdHlwZSBhc3NlcnRpb25zXG5cdFx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnVwZGF0ZVBhbGV0dGVDb2x1bW5zKHVwZGF0ZWRDb2x1bW5zLCB0cnVlLCAzKTtcblx0XHRcdFx0dGhpcy5zdGF0ZU1hbmFnZXIudXBkYXRlUGFsZXR0ZUhpc3RvcnkoW1xuXHRcdFx0XHRcdHsgLi4ubGF0ZXN0UGFsZXR0ZSwgaXRlbXM6IHVwZGF0ZWRJdGVtcyBhcyBQYWxldHRlSXRlbVtdIH0sXG5cdFx0XHRcdFx0Li4uY3VycmVudFN0YXRlLnBhbGV0dGVIaXN0b3J5LnNsaWNlKDEpXG5cdFx0XHRcdF0pO1xuXHRcdFx0fSxcblx0XHRcdCdGYWlsZWQgdG8gdXBkYXRlIHBhbGV0dGUgaXRlbSBjb2xvcicsXG5cdFx0XHR7IGNvbHVtbklELCBuZXdDb2xvciB9XG5cdFx0KTtcblx0fVxufVxuIl19