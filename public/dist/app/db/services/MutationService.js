// File: app/db/services/MutationService.js
import { configData as config } from '../../../data/config.js';
import { dbUtils } from '../dbUtils.js';
export class MutationService {
    static instance = null;
    storeNames = config.db.STORE_NAMES;
    dbUtils;
    constructor() {
        this.dbUtils = dbUtils;
    }
    static async getInstance() {
        if (!this.instance) {
            this.instance = new MutationService();
        }
        return this.instance;
    }
    async createMutationLogger(obj, key) {
        const self = this;
        return new Proxy(obj, {
            set(target, property, value) {
                const oldValue = target[property];
                const success = Reflect.set(target, property, value);
                if (success) {
                    const mutationLog = {
                        timestamp: new Date().toISOString(),
                        key,
                        action: 'update',
                        newValue: { [property]: value },
                        oldValue: { [property]: oldValue },
                        origin: 'Proxy'
                    };
                    self.dbUtils.log('debug', `Mutation detected: ${JSON.stringify(mutationLog)}`, `createMutationLogger()`, 2);
                    self.dbUtils.handleAsync(() => self.persistMutation(mutationLog), 'Failed to persist mutation', 'MutationService.createMutationLogger()');
                }
                return success;
            }
        });
    }
    async getMutations() {
        return ((await this.dbUtils.handleAsync(() => this.dbUtils.handleData(this.storeNames.MUTATIONS, 'mutation_logs', 'get'), 'Failed to fetch mutation logs', 'MutationService.getMutations()')) ?? []);
    }
    async persistMutation(data) {
        await this.dbUtils.handleAsync(async () => {
            await this.dbUtils.withDB(async (db) => {
                await db.put('mutations', data);
                this.dbUtils.log('debug', `Persisted mutation: ${JSON.stringify(data)}`, 'MutationService.persistMutation()', 4);
            });
        }, 'Failed to persist mutation', 'MutationService.persistMutation()');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXV0YXRpb25TZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9kYi9zZXJ2aWNlcy9NdXRhdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQTJDO0FBUzNDLE9BQU8sRUFBRSxVQUFVLElBQUksTUFBTSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV4QyxNQUFNLE9BQU8sZUFBZTtJQUNuQixNQUFNLENBQUMsUUFBUSxHQUEyQixJQUFJLENBQUM7SUFFL0MsVUFBVSxHQUNqQixNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUVmLE9BQU8sQ0FBbUI7SUFFbEM7UUFDQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxvQkFBb0IsQ0FDaEMsR0FBTSxFQUNOLEdBQVc7UUFFWCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbEIsT0FBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDckIsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSztnQkFDMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQW1CLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVyRCxJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUNiLE1BQU0sV0FBVyxHQUFnQjt3QkFDaEMsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO3dCQUNuQyxHQUFHO3dCQUNILE1BQU0sRUFBRSxRQUFRO3dCQUNoQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRTt3QkFDL0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUU7d0JBQ2xDLE1BQU0sRUFBRSxPQUFPO3FCQUNmLENBQUM7b0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQ2YsT0FBTyxFQUNQLHNCQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQ25ELHdCQUF3QixFQUN4QixDQUFDLENBQ0QsQ0FBQztvQkFFRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FDdkIsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFDdkMsNEJBQTRCLEVBQzVCLHdDQUF3QyxDQUN4QyxDQUFDO2dCQUNILENBQUM7Z0JBRUQsT0FBTyxPQUFPLENBQUM7WUFDaEIsQ0FBQztTQUNELENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsWUFBWTtRQUN4QixPQUFPLENBQ04sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUM5QixHQUFHLEVBQUUsQ0FDSixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFnQyxFQUNoRCxlQUFlLEVBQ2YsS0FBSyxDQUNMLEVBQ0YsK0JBQStCLEVBQy9CLGdDQUFnQyxDQUNoQyxDQUFDLElBQUksRUFBRSxDQUNSLENBQUM7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFpQjtRQUM3QyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUM3QixLQUFLLElBQUksRUFBRTtZQUNWLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxFQUFFO2dCQUNwQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDZixPQUFPLEVBQ1AsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDN0MsbUNBQW1DLEVBQ25DLENBQUMsQ0FDRCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLEVBQ0QsNEJBQTRCLEVBQzVCLG1DQUFtQyxDQUNuQyxDQUFDO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGFwcC9kYi9zZXJ2aWNlcy9NdXRhdGlvblNlcnZpY2UuanNcblxuaW1wb3J0IHtcblx0Q29uZmlnRGF0YUludGVyZmFjZSxcblx0REJVdGlsc0ludGVyZmFjZSxcblx0TXV0YXRpb25Mb2csXG5cdE11dGF0aW9uU2VydmljZV9DbGFzc0ludGVyZmFjZSxcblx0UGFsZXR0ZVNjaGVtYVxufSBmcm9tICcuLi8uLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWdEYXRhIGFzIGNvbmZpZyB9IGZyb20gJy4uLy4uLy4uL2RhdGEvY29uZmlnLmpzJztcbmltcG9ydCB7IGRiVXRpbHMgfSBmcm9tICcuLi9kYlV0aWxzLmpzJztcblxuZXhwb3J0IGNsYXNzIE11dGF0aW9uU2VydmljZSBpbXBsZW1lbnRzIE11dGF0aW9uU2VydmljZV9DbGFzc0ludGVyZmFjZSB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBNdXRhdGlvblNlcnZpY2UgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIHN0b3JlTmFtZXM6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ1NUT1JFX05BTUVTJ10gPVxuXHRcdGNvbmZpZy5kYi5TVE9SRV9OQU1FUztcblxuXHRwcml2YXRlIGRiVXRpbHM6IERCVXRpbHNJbnRlcmZhY2U7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5kYlV0aWxzID0gZGJVdGlscztcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0SW5zdGFuY2UoKSB7XG5cdFx0aWYgKCF0aGlzLmluc3RhbmNlKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlID0gbmV3IE11dGF0aW9uU2VydmljZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmluc3RhbmNlO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGNyZWF0ZU11dGF0aW9uTG9nZ2VyPFQgZXh0ZW5kcyBvYmplY3Q+KFxuXHRcdG9iajogVCxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBQcm9taXNlPFQ+IHtcblx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdHJldHVybiBuZXcgUHJveHkob2JqLCB7XG5cdFx0XHRzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcblx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRbcHJvcGVydHkgYXMga2V5b2YgVF07XG5cdFx0XHRcdGNvbnN0IHN1Y2Nlc3MgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRjb25zdCBtdXRhdGlvbkxvZzogTXV0YXRpb25Mb2cgPSB7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZTogeyBbcHJvcGVydHldOiB2YWx1ZSB9LFxuXHRcdFx0XHRcdFx0b2xkVmFsdWU6IHsgW3Byb3BlcnR5XTogb2xkVmFsdWUgfSxcblx0XHRcdFx0XHRcdG9yaWdpbjogJ1Byb3h5J1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRzZWxmLmRiVXRpbHMubG9nKFxuXHRcdFx0XHRcdFx0J2RlYnVnJyxcblx0XHRcdFx0XHRcdGBNdXRhdGlvbiBkZXRlY3RlZDogJHtKU09OLnN0cmluZ2lmeShtdXRhdGlvbkxvZyl9YCxcblx0XHRcdFx0XHRcdGBjcmVhdGVNdXRhdGlvbkxvZ2dlcigpYCxcblx0XHRcdFx0XHRcdDJcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0c2VsZi5kYlV0aWxzLmhhbmRsZUFzeW5jKFxuXHRcdFx0XHRcdFx0KCkgPT4gc2VsZi5wZXJzaXN0TXV0YXRpb24obXV0YXRpb25Mb2cpLFxuXHRcdFx0XHRcdFx0J0ZhaWxlZCB0byBwZXJzaXN0IG11dGF0aW9uJyxcblx0XHRcdFx0XHRcdCdNdXRhdGlvblNlcnZpY2UuY3JlYXRlTXV0YXRpb25Mb2dnZXIoKSdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHN1Y2Nlc3M7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0TXV0YXRpb25zKCk6IFByb21pc2U8TXV0YXRpb25Mb2dbXT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHQoYXdhaXQgdGhpcy5kYlV0aWxzLmhhbmRsZUFzeW5jKFxuXHRcdFx0XHQoKSA9PlxuXHRcdFx0XHRcdHRoaXMuZGJVdGlscy5oYW5kbGVEYXRhPE11dGF0aW9uTG9nW10+KFxuXHRcdFx0XHRcdFx0dGhpcy5zdG9yZU5hbWVzLk1VVEFUSU9OUyBhcyBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdFx0XHRcdFx0J211dGF0aW9uX2xvZ3MnLFxuXHRcdFx0XHRcdFx0J2dldCdcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHQnRmFpbGVkIHRvIGZldGNoIG11dGF0aW9uIGxvZ3MnLFxuXHRcdFx0XHQnTXV0YXRpb25TZXJ2aWNlLmdldE11dGF0aW9ucygpJ1xuXHRcdFx0KSkgPz8gW11cblx0XHQpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHBlcnNpc3RNdXRhdGlvbihkYXRhOiBNdXRhdGlvbkxvZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGF3YWl0IHRoaXMuZGJVdGlscy5oYW5kbGVBc3luYyhcblx0XHRcdGFzeW5jICgpID0+IHtcblx0XHRcdFx0YXdhaXQgdGhpcy5kYlV0aWxzLndpdGhEQihhc3luYyBkYiA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgZGIucHV0KCdtdXRhdGlvbnMnLCBkYXRhKTtcblx0XHRcdFx0XHR0aGlzLmRiVXRpbHMubG9nKFxuXHRcdFx0XHRcdFx0J2RlYnVnJyxcblx0XHRcdFx0XHRcdGBQZXJzaXN0ZWQgbXV0YXRpb246ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9YCxcblx0XHRcdFx0XHRcdCdNdXRhdGlvblNlcnZpY2UucGVyc2lzdE11dGF0aW9uKCknLFxuXHRcdFx0XHRcdFx0NFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdCdGYWlsZWQgdG8gcGVyc2lzdCBtdXRhdGlvbicsXG5cdFx0XHQnTXV0YXRpb25TZXJ2aWNlLnBlcnNpc3RNdXRhdGlvbigpJ1xuXHRcdCk7XG5cdH1cbn1cbiJdfQ==