// File: app/db/services/PaletteService.js
import { appUtils } from '../../appUtils.js';
import { configData as config } from '../../../data/config.js';
import { dbUtils } from '../dbUtils.js';
import { commonFn } from '../../../common/index.js';
const PALETTE_STORE = 'palettes';
export class PaletteService {
    static instance = null;
    appUtils;
    dbUtils;
    utils;
    storeNames = config.db.STORE_NAMES;
    constructor() {
        this.appUtils = appUtils;
        this.dbUtils = dbUtils;
        this.utils = commonFn.utils;
    }
    static async getInstance() {
        if (!this.instance) {
            this.instance = new PaletteService();
        }
        return this.instance;
    }
    async getCurrentPaletteID() {
        return ((await this.appUtils.handleAsync(() => this.dbUtils.handleData('settings', this.dbUtils.getDefaultKey('APP_SETTINGS'), 'get'), 'Failed to fetch current palette ID', 'PaletteService.getCurrentPaletteID()'))?.lastPaletteID ?? 0);
    }
    async getNextTableID() {
        const lastTableID = (await this.appUtils.handleAsync(() => this.dbUtils.handleData(this.storeNames.SETTINGS, this.dbUtils.getDefaultKey('APP_SETTINGS'), 'get'), 'Failed to fetch last table ID', 'PaletteService.getNextTableID()'))?.lastTableID ?? 0;
        const nextID = lastTableID + 1;
        await this.appUtils.handleAsync(() => this.dbUtils.updateData(this.storeNames.SETTINGS, this.dbUtils.getDefaultKey('APP_SETTINGS'), s => ({ ...s, lastTableID: nextID })), 'Failed to update next table ID', 'PaletteService.getNextTableID()');
        return `palette_${nextID}`;
    }
    async getPalette(id) {
        return await this.appUtils.handleAsync(() => this.dbUtils.handleData(PALETTE_STORE, id, 'get'), `Failed to fetch palette with ID ${id}`, 'PaletteService.getPalette()');
    }
    async resetPaletteID() {
        await this.appUtils.handleAsync(() => this.dbUtils.updateData(this.storeNames.SETTINGS, this.dbUtils.getDefaultKey('APP_SETTINGS'), s => ({ ...s, lastPaletteID: 0 })), 'Failed to reset palette ID', 'PaletteService.resetPaletteID()');
    }
    async savePalette(id, palette) {
        await this.appUtils.handleAsync(() => this.dbUtils.handleData(PALETTE_STORE, id, 'put', palette), `Failed to save palette with ID ${id}`, 'PaletteService.savePalette()');
    }
    async savePaletteToDB(args) {
        const result = await this.appUtils.handleAsync(async () => {
            const newPalette = this.utils.palette.createObject(args);
            const parsedPaletteFormat = Number(newPalette.id.split('_')[1]);
            if (isNaN(parsedPaletteFormat) ||
                parsedPaletteFormat <= 0 ||
                parsedPaletteFormat >= 9) {
                throw new Error(`Invalid palette ID format: ${newPalette.id}`);
            }
            await this.savePalette(newPalette.id, newPalette);
            return newPalette;
        }, 'Failed to save palette to database', 'PaletteService.savePaletteToDB()');
        if (!result) {
            throw new Error('savePaletteToDB failed and returned null.');
        }
        return result;
    }
    async updateEntryInPalette(tableID, entryIndex, newEntry) {
        const palette = await this.appUtils.handleAsync(() => this.dbUtils.handleData(PALETTE_STORE, tableID, 'get'), `Failed to fetch palette with ID ${tableID}`, 'PaletteService.updateEntryInPalette()');
        if (!palette)
            throw new Error(`Palette ${tableID} not found.`);
        if (entryIndex >= palette.items.length)
            throw new Error(`Invalid index ${entryIndex}`);
        palette.items[entryIndex] = newEntry;
        await this.savePalette(tableID, palette);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFsZXR0ZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL2RiL3NlcnZpY2VzL1BhbGV0dGVTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBDQUEwQztBQWMxQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsSUFBSSxNQUFNLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVwRCxNQUFNLGFBQWEsR0FBRyxVQUFpQyxDQUFDO0FBRXhELE1BQU0sT0FBTyxjQUFjO0lBQ2xCLE1BQU0sQ0FBQyxRQUFRLEdBQTBCLElBQUksQ0FBQztJQUU5QyxRQUFRLENBQW9CO0lBQzVCLE9BQU8sQ0FBbUI7SUFDMUIsS0FBSyxDQUFvQztJQUV6QyxVQUFVLEdBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBRXZCO1FBQ0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVc7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN0QixDQUFDO0lBRU0sS0FBSyxDQUFDLG1CQUFtQjtRQUMvQixPQUFPLENBQ04sQ0FDQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsV0FB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Q0FBQyxHQUFHLFFBQVEsQ0FBQztRQUVyQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBhcHAvZGIvc2VydmljZXMvUGFsZXR0ZVNlcnZpY2UuanNcblxuaW1wb3J0IHtcblx0QXBwVXRpbHNJbnRlcmZhY2UsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0Q29uZmlnRGF0YUludGVyZmFjZSxcblx0REJVdGlsc0ludGVyZmFjZSxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUFyZ3MsXG5cdFBhbGV0dGVJdGVtLFxuXHRQYWxldHRlU2NoZW1hLFxuXHRQYWxldHRlU2VydmljZV9DbGFzc0ludGVyZmFjZSxcblx0U2V0dGluZ3Ncbn0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgYXBwVXRpbHMgfSBmcm9tICcuLi8uLi9hcHBVdGlscy5qcyc7XG5pbXBvcnQgeyBjb25maWdEYXRhIGFzIGNvbmZpZyB9IGZyb20gJy4uLy4uLy4uL2RhdGEvY29uZmlnLmpzJztcbmltcG9ydCB7IGRiVXRpbHMgfSBmcm9tICcuLi9kYlV0aWxzLmpzJztcbmltcG9ydCB7IGNvbW1vbkZuIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2luZGV4LmpzJztcblxuY29uc3QgUEFMRVRURV9TVE9SRSA9ICdwYWxldHRlcycgYXMga2V5b2YgUGFsZXR0ZVNjaGVtYTtcblxuZXhwb3J0IGNsYXNzIFBhbGV0dGVTZXJ2aWNlIGltcGxlbWVudHMgUGFsZXR0ZVNlcnZpY2VfQ2xhc3NJbnRlcmZhY2Uge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogUGFsZXR0ZVNlcnZpY2UgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIGFwcFV0aWxzOiBBcHBVdGlsc0ludGVyZmFjZTtcblx0cHJpdmF0ZSBkYlV0aWxzOiBEQlV0aWxzSW50ZXJmYWNlO1xuXHRwcml2YXRlIHV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ107XG5cblx0cHJpdmF0ZSBzdG9yZU5hbWVzOiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddWydTVE9SRV9OQU1FUyddID1cblx0XHRjb25maWcuZGIuU1RPUkVfTkFNRVM7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5hcHBVdGlscyA9IGFwcFV0aWxzO1xuXHRcdHRoaXMuZGJVdGlscyA9IGRiVXRpbHM7XG5cdFx0dGhpcy51dGlscyA9IGNvbW1vbkZuLnV0aWxzO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBhc3luYyBnZXRJbnN0YW5jZSgpIHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBuZXcgUGFsZXR0ZVNlcnZpY2UoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDdXJyZW50UGFsZXR0ZUlEKCk6IFByb21pc2U8bnVtYmVyPiB7XG5cdFx0cmV0dXJuIChcblx0XHRcdChcblx0XHRcdFx0YXdhaXQgdGhpcy5hcHBVdGlscy5oYW5kbGVBc3luYyhcblx0XHRcdFx0XHQoKSA9PlxuXHRcdFx0XHRcdFx0dGhpcy5kYlV0aWxzLmhhbmRsZURhdGE8U2V0dGluZ3M+KFxuXHRcdFx0XHRcdFx0XHQnc2V0dGluZ3MnLFxuXHRcdFx0XHRcdFx0XHR0aGlzLmRiVXRpbHMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJyksXG5cdFx0XHRcdFx0XHRcdCdnZXQnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdCdGYWlsZWQgdG8gZmV0Y2ggY3VycmVudCBwYWxldHRlIElEJyxcblx0XHRcdFx0XHQnUGFsZXR0ZVNlcnZpY2UuZ2V0Q3VycmVudFBhbGV0dGVJRCgpJ1xuXHRcdFx0XHQpXG5cdFx0XHQpPy5sYXN0UGFsZXR0ZUlEID8/IDBcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldE5leHRUYWJsZUlEKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0Y29uc3QgbGFzdFRhYmxlSUQgPVxuXHRcdFx0KFxuXHRcdFx0XHRhd2FpdCB0aGlzLmFwcFV0aWxzLmhhbmRsZUFzeW5jKFxuXHRcdFx0XHRcdCgpID0+XG5cdFx0XHRcdFx0XHR0aGlzLmRiVXRpbHMuaGFuZGxlRGF0YTxTZXR0aW5ncz4oXG5cdFx0XHRcdFx0XHRcdHRoaXMuc3RvcmVOYW1lcy5TRVRUSU5HUyBhcyBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdFx0XHRcdFx0XHR0aGlzLmRiVXRpbHMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJyksXG5cdFx0XHRcdFx0XHRcdCdnZXQnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdCdGYWlsZWQgdG8gZmV0Y2ggbGFzdCB0YWJsZSBJRCcsXG5cdFx0XHRcdFx0J1BhbGV0dGVTZXJ2aWNlLmdldE5leHRUYWJsZUlEKCknXG5cdFx0XHRcdClcblx0XHRcdCk/Lmxhc3RUYWJsZUlEID8/IDA7XG5cblx0XHRjb25zdCBuZXh0SUQgPSBsYXN0VGFibGVJRCArIDE7XG5cblx0XHRhd2FpdCB0aGlzLmFwcFV0aWxzLmhhbmRsZUFzeW5jKFxuXHRcdFx0KCkgPT5cblx0XHRcdFx0dGhpcy5kYlV0aWxzLnVwZGF0ZURhdGEoXG5cdFx0XHRcdFx0dGhpcy5zdG9yZU5hbWVzLlNFVFRJTkdTIGFzIGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0XHRcdFx0dGhpcy5kYlV0aWxzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpLFxuXHRcdFx0XHRcdHMgPT4gKHsgLi4ucywgbGFzdFRhYmxlSUQ6IG5leHRJRCB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0J0ZhaWxlZCB0byB1cGRhdGUgbmV4dCB0YWJsZSBJRCcsXG5cdFx0XHQnUGFsZXR0ZVNlcnZpY2UuZ2V0TmV4dFRhYmxlSUQoKSdcblx0XHQpO1xuXG5cdFx0cmV0dXJuIGBwYWxldHRlXyR7bmV4dElEfWA7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0UGFsZXR0ZShpZDogc3RyaW5nKTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiBhd2FpdCB0aGlzLmFwcFV0aWxzLmhhbmRsZUFzeW5jKFxuXHRcdFx0KCkgPT4gdGhpcy5kYlV0aWxzLmhhbmRsZURhdGE8UGFsZXR0ZT4oUEFMRVRURV9TVE9SRSwgaWQsICdnZXQnKSxcblx0XHRcdGBGYWlsZWQgdG8gZmV0Y2ggcGFsZXR0ZSB3aXRoIElEICR7aWR9YCxcblx0XHRcdCdQYWxldHRlU2VydmljZS5nZXRQYWxldHRlKCknXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyByZXNldFBhbGV0dGVJRCgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLmFwcFV0aWxzLmhhbmRsZUFzeW5jKFxuXHRcdFx0KCkgPT5cblx0XHRcdFx0dGhpcy5kYlV0aWxzLnVwZGF0ZURhdGEoXG5cdFx0XHRcdFx0dGhpcy5zdG9yZU5hbWVzLlNFVFRJTkdTIGFzIGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0XHRcdFx0dGhpcy5kYlV0aWxzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpLFxuXHRcdFx0XHRcdHMgPT4gKHsgLi4ucywgbGFzdFBhbGV0dGVJRDogMCB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0J0ZhaWxlZCB0byByZXNldCBwYWxldHRlIElEJyxcblx0XHRcdCdQYWxldHRlU2VydmljZS5yZXNldFBhbGV0dGVJRCgpJ1xuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZVBhbGV0dGUoaWQ6IHN0cmluZywgcGFsZXR0ZTogUGFsZXR0ZSk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGF3YWl0IHRoaXMuYXBwVXRpbHMuaGFuZGxlQXN5bmMoXG5cdFx0XHQoKSA9PiB0aGlzLmRiVXRpbHMuaGFuZGxlRGF0YShQQUxFVFRFX1NUT1JFLCBpZCwgJ3B1dCcsIHBhbGV0dGUpLFxuXHRcdFx0YEZhaWxlZCB0byBzYXZlIHBhbGV0dGUgd2l0aCBJRCAke2lkfWAsXG5cdFx0XHQnUGFsZXR0ZVNlcnZpY2Uuc2F2ZVBhbGV0dGUoKSdcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlVG9EQihhcmdzOiBQYWxldHRlQXJncyk6IFByb21pc2U8UGFsZXR0ZT4ge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuYXBwVXRpbHMuaGFuZGxlQXN5bmMoXG5cdFx0XHRhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG5ld1BhbGV0dGUgPSB0aGlzLnV0aWxzLnBhbGV0dGUuY3JlYXRlT2JqZWN0KGFyZ3MpO1xuXHRcdFx0XHRjb25zdCBwYXJzZWRQYWxldHRlRm9ybWF0ID0gTnVtYmVyKG5ld1BhbGV0dGUuaWQuc3BsaXQoJ18nKVsxXSk7XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGlzTmFOKHBhcnNlZFBhbGV0dGVGb3JtYXQpIHx8XG5cdFx0XHRcdFx0cGFyc2VkUGFsZXR0ZUZvcm1hdCA8PSAwIHx8XG5cdFx0XHRcdFx0cGFyc2VkUGFsZXR0ZUZvcm1hdCA+PSA5XG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdGBJbnZhbGlkIHBhbGV0dGUgSUQgZm9ybWF0OiAke25ld1BhbGV0dGUuaWR9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhd2FpdCB0aGlzLnNhdmVQYWxldHRlKG5ld1BhbGV0dGUuaWQsIG5ld1BhbGV0dGUpO1xuXG5cdFx0XHRcdHJldHVybiBuZXdQYWxldHRlO1xuXHRcdFx0fSxcblx0XHRcdCdGYWlsZWQgdG8gc2F2ZSBwYWxldHRlIHRvIGRhdGFiYXNlJyxcblx0XHRcdCdQYWxldHRlU2VydmljZS5zYXZlUGFsZXR0ZVRvREIoKSdcblx0XHQpO1xuXG5cdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignc2F2ZVBhbGV0dGVUb0RCIGZhaWxlZCBhbmQgcmV0dXJuZWQgbnVsbC4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHVwZGF0ZUVudHJ5SW5QYWxldHRlKFxuXHRcdHRhYmxlSUQ6IHN0cmluZyxcblx0XHRlbnRyeUluZGV4OiBudW1iZXIsXG5cdFx0bmV3RW50cnk6IFBhbGV0dGVJdGVtXG5cdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IHBhbGV0dGUgPSBhd2FpdCB0aGlzLmFwcFV0aWxzLmhhbmRsZUFzeW5jKFxuXHRcdFx0KCkgPT5cblx0XHRcdFx0dGhpcy5kYlV0aWxzLmhhbmRsZURhdGE8UGFsZXR0ZT4oUEFMRVRURV9TVE9SRSwgdGFibGVJRCwgJ2dldCcpLFxuXHRcdFx0YEZhaWxlZCB0byBmZXRjaCBwYWxldHRlIHdpdGggSUQgJHt0YWJsZUlEfWAsXG5cdFx0XHQnUGFsZXR0ZVNlcnZpY2UudXBkYXRlRW50cnlJblBhbGV0dGUoKSdcblx0XHQpO1xuXG5cdFx0aWYgKCFwYWxldHRlKSB0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlEfSBub3QgZm91bmQuYCk7XG5cdFx0aWYgKGVudHJ5SW5kZXggPj0gcGFsZXR0ZS5pdGVtcy5sZW5ndGgpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5kZXggJHtlbnRyeUluZGV4fWApO1xuXG5cdFx0cGFsZXR0ZS5pdGVtc1tlbnRyeUluZGV4XSA9IG5ld0VudHJ5O1xuXG5cdFx0YXdhaXQgdGhpcy5zYXZlUGFsZXR0ZSh0YWJsZUlELCBwYWxldHRlKTtcblx0fVxufVxuIl19