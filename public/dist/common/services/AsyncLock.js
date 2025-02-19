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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNMb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zZXJ2aWNlcy9Bc3luY0xvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0NBQW9DO0FBSXBDLE1BQU0sT0FBTyxTQUFTO0lBQ2IsUUFBUSxHQUFZLEtBQUssQ0FBQztJQUMxQixZQUFZLEdBQW1CLEVBQUUsQ0FBQztJQUVuQyxLQUFLLENBQUMsT0FBTztRQUNuQixPQUFPLElBQUksT0FBTyxDQUFPLE9BQU8sQ0FBQyxFQUFFO1lBQ2xDLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3JCLE9BQU8sRUFBRSxDQUFDO2dCQUNYLENBQUM7cUJBQU0sQ0FBQztvQkFDUCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNGLENBQUMsQ0FBQztZQUNGLFVBQVUsRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU0sT0FBTztRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDVixJQUFJLEVBQUUsQ0FBQztRQUNSLENBQUM7SUFDRixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb21tb24vc2Vydmllcy9Bc3luY0xvY2sudHNcblxuaW1wb3J0IHsgQXN5bmNMb2NrSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuXG5leHBvcnQgY2xhc3MgQXN5bmNMb2NrIGltcGxlbWVudHMgQXN5bmNMb2NrSW50ZXJmYWNlIHtcblx0cHJpdmF0ZSBpc0xvY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIHdhaXRpbmdRdWV1ZTogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuXHRwdWJsaWMgYXN5bmMgYWNxdWlyZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG5cdFx0XHRjb25zdCB0cnlBY3F1aXJlID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXMuaXNMb2NrZWQpIHtcblx0XHRcdFx0XHR0aGlzLmlzTG9ja2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy53YWl0aW5nUXVldWUucHVzaCh0cnlBY3F1aXJlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHRyeUFjcXVpcmUoKTtcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5pc0xvY2tlZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJlbGVhc2UgYSBsb2NrIHRoYXQgaXNuJ3QgYWNxdWlyZWQuXCIpO1xuXHRcdH1cblx0XHR0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG5cdFx0Y29uc3QgbmV4dCA9IHRoaXMud2FpdGluZ1F1ZXVlLnNoaWZ0KCk7XG5cdFx0aWYgKG5leHQpIHtcblx0XHRcdG5leHQoKTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==