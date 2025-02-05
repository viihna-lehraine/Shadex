// File: paletteGen/palettes/types/random.js
import { IDBManager } from '../../../app/db/IDBManager.js';
import { helpers as paletteHelpers, superUtils as paletteSuperUtils } from '../../common/index.js';
import { commonFn } from '../../../common/index.js';
const utils = commonFn.utils;
export async function random(args) {
    const baseColor = utils.random.hsl();
    const paletteItems = [
        await paletteSuperUtils.create.paletteItem(baseColor)
    ];
    for (let i = 1; i < args.swatches; i++) {
        const randomColor = utils.random.hsl();
        const nextPaletteItem = await paletteSuperUtils.create.paletteItem(randomColor);
        paletteItems.push(nextPaletteItem);
        paletteHelpers.update.colorBox(randomColor, i);
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = (await idbManager.getCurrentPaletteID()) + 1;
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const paletteArgs = {
        type: 'triadic',
        items: paletteItems,
        paletteID,
        swatches: args.swatches,
        limitDark: args.limitDark,
        limitGray: args.limitGray,
        limitLight: args.limitLight
    };
    const randomPalette = await idbManager.savePaletteToDB(paletteArgs);
    if (!randomPalette)
        throw new Error('Random palette is either null or undefined.');
    else
        return randomPalette;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvbWFpbi90eXBlcy9yYW5kb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBUTVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLEVBQ04sT0FBTyxJQUFJLGNBQWMsRUFDekIsVUFBVSxJQUFJLGlCQUFpQixFQUMvQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVwRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBRTdCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsTUFBTSxDQUFDLElBQTJCO0lBQ3ZELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDckMsTUFBTSxZQUFZLEdBQWtCO1FBQ25DLE1BQU0saUJBQWlCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7S0FDckQsQ0FBQztJQUVGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDeEMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2QyxNQUFNLGVBQWUsR0FDcEIsTUFBTSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXpELFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFbkMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsRCxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sVUFBVSxDQUFDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFL0QsSUFBSSxDQUFDLFNBQVM7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7SUFFM0UsTUFBTSxXQUFXLEdBQWdCO1FBQ2hDLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLFlBQVk7UUFDbkIsU0FBUztRQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtRQUN2QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7UUFDekIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1FBQ3pCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtLQUMzQixDQUFDO0lBRUYsTUFBTSxhQUFhLEdBQUcsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXBFLElBQUksQ0FBQyxhQUFhO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQzs7UUFDM0QsT0FBTyxhQUFhLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHBhbGV0dGVHZW4vcGFsZXR0ZXMvdHlwZXMvcmFuZG9tLmpzXG5cbmltcG9ydCB7XG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVBcmdzLFxuXHRQYWxldHRlR2VuZXJhdGlvbkFyZ3MsXG5cdFBhbGV0dGVJdGVtXG59IGZyb20gJy4uLy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IElEQk1hbmFnZXIgfSBmcm9tICcuLi8uLi8uLi9hcHAvZGIvSURCTWFuYWdlci5qcyc7XG5pbXBvcnQge1xuXHRoZWxwZXJzIGFzIHBhbGV0dGVIZWxwZXJzLFxuXHRzdXBlclV0aWxzIGFzIHBhbGV0dGVTdXBlclV0aWxzXG59IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb21tb25GbiB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9pbmRleC5qcyc7XG5cbmNvbnN0IHV0aWxzID0gY29tbW9uRm4udXRpbHM7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByYW5kb20oYXJnczogUGFsZXR0ZUdlbmVyYXRpb25BcmdzKTogUHJvbWlzZTxQYWxldHRlPiB7XG5cdGNvbnN0IGJhc2VDb2xvciA9IHV0aWxzLnJhbmRvbS5oc2woKTtcblx0Y29uc3QgcGFsZXR0ZUl0ZW1zOiBQYWxldHRlSXRlbVtdID0gW1xuXHRcdGF3YWl0IHBhbGV0dGVTdXBlclV0aWxzLmNyZWF0ZS5wYWxldHRlSXRlbShiYXNlQ29sb3IpXG5cdF07XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBhcmdzLnN3YXRjaGVzOyBpKyspIHtcblx0XHRjb25zdCByYW5kb21Db2xvciA9IHV0aWxzLnJhbmRvbS5oc2woKTtcblx0XHRjb25zdCBuZXh0UGFsZXR0ZUl0ZW0gPVxuXHRcdFx0YXdhaXQgcGFsZXR0ZVN1cGVyVXRpbHMuY3JlYXRlLnBhbGV0dGVJdGVtKHJhbmRvbUNvbG9yKTtcblxuXHRcdHBhbGV0dGVJdGVtcy5wdXNoKG5leHRQYWxldHRlSXRlbSk7XG5cblx0XHRwYWxldHRlSGVscGVycy51cGRhdGUuY29sb3JCb3gocmFuZG9tQ29sb3IsIGkpO1xuXHR9XG5cblx0Y29uc3QgaWRiTWFuYWdlciA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblx0Y29uc3QgcGFsZXR0ZUlEID0gKGF3YWl0IGlkYk1hbmFnZXIuZ2V0Q3VycmVudFBhbGV0dGVJRCgpKSArIDE7XG5cblx0aWYgKCFwYWxldHRlSUQpIHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSBJRCBpcyBlaXRoZXIgbnVsbCBvciB1bmRlZmluZWQuJyk7XG5cblx0Y29uc3QgcGFsZXR0ZUFyZ3M6IFBhbGV0dGVBcmdzID0ge1xuXHRcdHR5cGU6ICd0cmlhZGljJyxcblx0XHRpdGVtczogcGFsZXR0ZUl0ZW1zLFxuXHRcdHBhbGV0dGVJRCxcblx0XHRzd2F0Y2hlczogYXJncy5zd2F0Y2hlcyxcblx0XHRsaW1pdERhcms6IGFyZ3MubGltaXREYXJrLFxuXHRcdGxpbWl0R3JheTogYXJncy5saW1pdEdyYXksXG5cdFx0bGltaXRMaWdodDogYXJncy5saW1pdExpZ2h0XG5cdH07XG5cblx0Y29uc3QgcmFuZG9tUGFsZXR0ZSA9IGF3YWl0IGlkYk1hbmFnZXIuc2F2ZVBhbGV0dGVUb0RCKHBhbGV0dGVBcmdzKTtcblxuXHRpZiAoIXJhbmRvbVBhbGV0dGUpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdSYW5kb20gcGFsZXR0ZSBpcyBlaXRoZXIgbnVsbCBvciB1bmRlZmluZWQuJyk7XG5cdGVsc2UgcmV0dXJuIHJhbmRvbVBhbGV0dGU7XG59XG4iXX0=