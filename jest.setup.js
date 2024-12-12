// File: jest.setup.js

const { IDBFactory } = import('idb-mock');
global.indexedDB = new IDBFactory();
