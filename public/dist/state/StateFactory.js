// File: state/StateFactory.ts
const caller = 'StateFactory';
export class StateFactory {
    static #instance = null;
    #errors;
    #helpers;
    #log;
    #utils;
    constructor(helpers, services, utils) {
        try {
            services.log.debug(`Constructing StateFactory instance.`, `${caller} constructor`);
            this.#errors = services.errors;
            this.#helpers = helpers;
            this.#log = services.log;
            this.#utils = utils;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(helpers, services, utils) {
        return services.errors.handleSync(() => {
            if (!StateFactory.#instance) {
                services.log.debug('Creating StateFactory instance.', `${caller}.getInstance`);
                StateFactory.#instance = new StateFactory(helpers, services, utils);
            }
            services.log.debug(`Returning StateFactory instance.`, `${caller}.getInstance`);
            return StateFactory.#instance;
        }, `[${caller}]: Error getting instance.`);
    }
    createInitialState() {
        return (this.#errors.handleAsync(async () => {
            this.#log.debug('Generating initial state.', `${caller}.#generateInitialState`);
            const columns = this.#utils.dom.scanPaletteColumns() ?? [];
            if (!columns) {
                this.#log.error('No palette columns found!', `${caller}.#generateInitialState`);
            }
            this.#log.debug(`Scanned palette columns.`, `${caller}.#generateInitialState`);
            return {
                appMode: 'edit',
                paletteContainer: { columns },
                paletteHistory: [],
                preferences: {
                    colorSpace: 'hsl',
                    distributionType: 'soft',
                    maxHistory: 20,
                    maxPaletteHistory: 10,
                    theme: 'light'
                },
                selections: {
                    paletteColumnCount: columns.length,
                    paletteType: 'complementary',
                    targetedColumnPosition: 1
                },
                timestamp: this.#helpers.data.getFormattedTimestamp()
            };
        }, `[${caller}]: Failed to generate initial state`) ?? {});
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGVGYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0YXRlL1N0YXRlRmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFVOUIsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDO0FBRTlCLE1BQU0sT0FBTyxZQUFZO0lBQ3hCLE1BQU0sQ0FBQyxTQUFTLEdBQXdCLElBQUksQ0FBQztJQUU3QyxPQUFPLENBQXFCO0lBQzVCLFFBQVEsQ0FBVTtJQUNsQixJQUFJLENBQWtCO0lBQ3RCLE1BQU0sQ0FBWTtJQUVsQixZQUNDLE9BQWdCLEVBQ2hCLFFBQWtCLEVBQ2xCLEtBQWdCO1FBRWhCLElBQUksQ0FBQztZQUNKLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUNqQixxQ0FBcUMsRUFDckMsR0FBRyxNQUFNLGNBQWMsQ0FDdkIsQ0FBQztZQUVGLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDckIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FDZCxJQUFJLE1BQU0sa0JBQ1QsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FDMUMsRUFBRSxDQUNGLENBQUM7UUFDSCxDQUFDO0lBQ0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFXLENBQ2pCLE9BQWdCLEVBQ2hCLFFBQWtCLEVBQ2xCLEtBQWdCO1FBRWhCLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzdCLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUNqQixpQ0FBaUMsRUFDakMsR0FBRyxNQUFNLGNBQWMsQ0FDdkIsQ0FBQztnQkFFRixZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksWUFBWSxDQUN4QyxPQUFPLEVBQ1AsUUFBUSxFQUNSLEtBQUssQ0FDTCxDQUFDO1lBQ0gsQ0FBQztZQUVELFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUNqQixrQ0FBa0MsRUFDbEMsR0FBRyxNQUFNLGNBQWMsQ0FDdkIsQ0FBQztZQUVGLE9BQU8sWUFBWSxDQUFDLFNBQVMsQ0FBQztRQUMvQixDQUFDLEVBQUUsSUFBSSxNQUFNLDRCQUE0QixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELGtCQUFrQjtRQUNqQixPQUFPLENBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQ2QsMkJBQTJCLEVBQzNCLEdBQUcsTUFBTSx3QkFBd0IsQ0FDakMsQ0FBQztZQUVGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDO1lBRTNELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FDZCwyQkFBMkIsRUFDM0IsR0FBRyxNQUFNLHdCQUF3QixDQUNqQyxDQUFDO1lBQ0gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUNkLDBCQUEwQixFQUMxQixHQUFHLE1BQU0sd0JBQXdCLENBQ2pDLENBQUM7WUFFRixPQUFPO2dCQUNOLE9BQU8sRUFBRSxNQUFNO2dCQUNmLGdCQUFnQixFQUFFLEVBQUUsT0FBTyxFQUFFO2dCQUM3QixjQUFjLEVBQUUsRUFBRTtnQkFDbEIsV0FBVyxFQUFFO29CQUNaLFVBQVUsRUFBRSxLQUFLO29CQUNqQixnQkFBZ0IsRUFBRSxNQUFNO29CQUN4QixVQUFVLEVBQUUsRUFBRTtvQkFDZCxpQkFBaUIsRUFBRSxFQUFFO29CQUNyQixLQUFLLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxVQUFVLEVBQUU7b0JBQ1gsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLE1BQU07b0JBQ2xDLFdBQVcsRUFBRSxlQUFlO29CQUM1QixzQkFBc0IsRUFBRSxDQUFDO2lCQUN6QjtnQkFDRCxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7YUFDckQsQ0FBQztRQUNILENBQUMsRUFBRSxJQUFJLE1BQU0scUNBQXFDLENBQUMsSUFBSyxFQUFZLENBQ3BFLENBQUM7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3RhdGUvU3RhdGVGYWN0b3J5LnRzXG5cbmltcG9ydCB7XG5cdEhlbHBlcnMsXG5cdFNlcnZpY2VzLFxuXHRTdGF0ZSxcblx0U3RhdGVGYWN0b3J5Q29udHJhY3QsXG5cdFV0aWxpdGllc1xufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5cbmNvbnN0IGNhbGxlciA9ICdTdGF0ZUZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgU3RhdGVGYWN0b3J5IGltcGxlbWVudHMgU3RhdGVGYWN0b3J5Q29udHJhY3Qge1xuXHRzdGF0aWMgI2luc3RhbmNlOiBTdGF0ZUZhY3RvcnkgfCBudWxsID0gbnVsbDtcblxuXHQjZXJyb3JzOiBTZXJ2aWNlc1snZXJyb3JzJ107XG5cdCNoZWxwZXJzOiBIZWxwZXJzO1xuXHQjbG9nOiBTZXJ2aWNlc1snbG9nJ107XG5cdCN1dGlsczogVXRpbGl0aWVzO1xuXG5cdHByaXZhdGUgY29uc3RydWN0b3IoXG5cdFx0aGVscGVyczogSGVscGVycyxcblx0XHRzZXJ2aWNlczogU2VydmljZXMsXG5cdFx0dXRpbHM6IFV0aWxpdGllc1xuXHQpIHtcblx0XHR0cnkge1xuXHRcdFx0c2VydmljZXMubG9nLmRlYnVnKFxuXHRcdFx0XHRgQ29uc3RydWN0aW5nIFN0YXRlRmFjdG9yeSBpbnN0YW5jZS5gLFxuXHRcdFx0XHRgJHtjYWxsZXJ9IGNvbnN0cnVjdG9yYFxuXHRcdFx0KTtcblxuXHRcdFx0dGhpcy4jZXJyb3JzID0gc2VydmljZXMuZXJyb3JzO1xuXHRcdFx0dGhpcy4jaGVscGVycyA9IGhlbHBlcnM7XG5cdFx0XHR0aGlzLiNsb2cgPSBzZXJ2aWNlcy5sb2c7XG5cdFx0XHR0aGlzLiN1dGlscyA9IHV0aWxzO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdGBbJHtjYWxsZXJ9IGNvbnN0cnVjdG9yXTogJHtcblx0XHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IGVycm9yXG5cdFx0XHRcdH1gXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShcblx0XHRoZWxwZXJzOiBIZWxwZXJzLFxuXHRcdHNlcnZpY2VzOiBTZXJ2aWNlcyxcblx0XHR1dGlsczogVXRpbGl0aWVzXG5cdCk6IFN0YXRlRmFjdG9yeSB7XG5cdFx0cmV0dXJuIHNlcnZpY2VzLmVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghU3RhdGVGYWN0b3J5LiNpbnN0YW5jZSkge1xuXHRcdFx0XHRzZXJ2aWNlcy5sb2cuZGVidWcoXG5cdFx0XHRcdFx0J0NyZWF0aW5nIFN0YXRlRmFjdG9yeSBpbnN0YW5jZS4nLFxuXHRcdFx0XHRcdGAke2NhbGxlcn0uZ2V0SW5zdGFuY2VgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0U3RhdGVGYWN0b3J5LiNpbnN0YW5jZSA9IG5ldyBTdGF0ZUZhY3RvcnkoXG5cdFx0XHRcdFx0aGVscGVycyxcblx0XHRcdFx0XHRzZXJ2aWNlcyxcblx0XHRcdFx0XHR1dGlsc1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZXJ2aWNlcy5sb2cuZGVidWcoXG5cdFx0XHRcdGBSZXR1cm5pbmcgU3RhdGVGYWN0b3J5IGluc3RhbmNlLmAsXG5cdFx0XHRcdGAke2NhbGxlcn0uZ2V0SW5zdGFuY2VgXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gU3RhdGVGYWN0b3J5LiNpbnN0YW5jZTtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEVycm9yIGdldHRpbmcgaW5zdGFuY2UuYCk7XG5cdH1cblxuXHRjcmVhdGVJbml0aWFsU3RhdGUoKTogUHJvbWlzZTxTdGF0ZT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLiNsb2cuZGVidWcoXG5cdFx0XHRcdFx0J0dlbmVyYXRpbmcgaW5pdGlhbCBzdGF0ZS4nLFxuXHRcdFx0XHRcdGAke2NhbGxlcn0uI2dlbmVyYXRlSW5pdGlhbFN0YXRlYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGNvbnN0IGNvbHVtbnMgPSB0aGlzLiN1dGlscy5kb20uc2NhblBhbGV0dGVDb2x1bW5zKCkgPz8gW107XG5cblx0XHRcdFx0aWYgKCFjb2x1bW5zKSB7XG5cdFx0XHRcdFx0dGhpcy4jbG9nLmVycm9yKFxuXHRcdFx0XHRcdFx0J05vIHBhbGV0dGUgY29sdW1ucyBmb3VuZCEnLFxuXHRcdFx0XHRcdFx0YCR7Y2FsbGVyfS4jZ2VuZXJhdGVJbml0aWFsU3RhdGVgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0XHRgU2Nhbm5lZCBwYWxldHRlIGNvbHVtbnMuYCxcblx0XHRcdFx0XHRgJHtjYWxsZXJ9LiNnZW5lcmF0ZUluaXRpYWxTdGF0ZWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGFwcE1vZGU6ICdlZGl0Jyxcblx0XHRcdFx0XHRwYWxldHRlQ29udGFpbmVyOiB7IGNvbHVtbnMgfSxcblx0XHRcdFx0XHRwYWxldHRlSGlzdG9yeTogW10sXG5cdFx0XHRcdFx0cHJlZmVyZW5jZXM6IHtcblx0XHRcdFx0XHRcdGNvbG9yU3BhY2U6ICdoc2wnLFxuXHRcdFx0XHRcdFx0ZGlzdHJpYnV0aW9uVHlwZTogJ3NvZnQnLFxuXHRcdFx0XHRcdFx0bWF4SGlzdG9yeTogMjAsXG5cdFx0XHRcdFx0XHRtYXhQYWxldHRlSGlzdG9yeTogMTAsXG5cdFx0XHRcdFx0XHR0aGVtZTogJ2xpZ2h0J1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2VsZWN0aW9uczoge1xuXHRcdFx0XHRcdFx0cGFsZXR0ZUNvbHVtbkNvdW50OiBjb2x1bW5zLmxlbmd0aCxcblx0XHRcdFx0XHRcdHBhbGV0dGVUeXBlOiAnY29tcGxlbWVudGFyeScsXG5cdFx0XHRcdFx0XHR0YXJnZXRlZENvbHVtblBvc2l0aW9uOiAxXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aW1lc3RhbXA6IHRoaXMuI2hlbHBlcnMuZGF0YS5nZXRGb3JtYXR0ZWRUaW1lc3RhbXAoKVxuXHRcdFx0XHR9O1xuXHRcdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gZ2VuZXJhdGUgaW5pdGlhbCBzdGF0ZWApID8/ICh7fSBhcyBTdGF0ZSlcblx0XHQpO1xuXHR9XG59XG4iXX0=