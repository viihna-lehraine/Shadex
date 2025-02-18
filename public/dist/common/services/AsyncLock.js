// File: common/servies/AsyncLock.ts
export class AsyncLock {
    isLocked = false;
    waitingQueue = [];
    async acquire() {
        return new Promise(resolve => {
            const tryAcquire = () => {
                if (!this.isLocked) {
                    this.isLocked = true;
                    resolve();
                }
                else {
                    this.waitingQueue.push(tryAcquire);
                }
            };
            tryAcquire();
        });
    }
    release() {
        if (!this.isLocked) {
            throw new Error("Cannot release a lock that isn't acquired.");
        }
        this.isLocked = false;
        const next = this.waitingQueue.shift();
        if (next) {
            next();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNMb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zZXJ2aWNlcy9Bc3luY0xvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0NBQW9DO0FBSXBDLE1BQU0sT0FBTyxTQUFTO0lBQ2IsUUFBUSxHQUFZLEtBQUssQ0FBQztJQUMxQixZQUFZLEdBQW1CLEVBQUUsQ0FBQztJQUVuQyxLQUFLLENBQUMsT0FBTztRQUNuQixPQUFPLElBQUksT0FBTyxDQUFPLE9BQU8sQ0FBQyxFQUFFO1lBQ2xDLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3JCLE9BQU8sRUFBRSxDQUFDO2dCQUNYLENBQUM7cUJBQU0sQ0FBQztvQkFDUCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNGLENBQUMsQ0FBQztZQUNGLFVBQVUsRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU0sT0FBTztRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDVixJQUFJLEVBQUUsQ0FBQztRQUNSLENBQUM7SUFDRixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb21tb24vc2Vydmllcy9Bc3luY0xvY2sudHNcblxuaW1wb3J0IHsgQXN5bmNMb2NrQ2xhc3NJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBBc3luY0xvY2sgaW1wbGVtZW50cyBBc3luY0xvY2tDbGFzc0ludGVyZmFjZSB7XG5cdHByaXZhdGUgaXNMb2NrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSB3YWl0aW5nUXVldWU6ICgoKSA9PiB2b2lkKVtdID0gW107XG5cblx0cHVibGljIGFzeW5jIGFjcXVpcmUoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xuXHRcdFx0Y29uc3QgdHJ5QWNxdWlyZSA9ICgpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzLmlzTG9ja2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5pc0xvY2tlZCA9IHRydWU7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMud2FpdGluZ1F1ZXVlLnB1c2godHJ5QWNxdWlyZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHR0cnlBY3F1aXJlKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMuaXNMb2NrZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZWxlYXNlIGEgbG9jayB0aGF0IGlzbid0IGFjcXVpcmVkLlwiKTtcblx0XHR9XG5cdFx0dGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuXHRcdGNvbnN0IG5leHQgPSB0aGlzLndhaXRpbmdRdWV1ZS5zaGlmdCgpO1xuXHRcdGlmIChuZXh0KSB7XG5cdFx0XHRuZXh0KCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=