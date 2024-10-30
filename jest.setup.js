const { IDBFactory } = import('idb-mock');
global.indexedDB = new IDBFactory();
