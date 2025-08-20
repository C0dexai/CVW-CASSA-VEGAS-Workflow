import { type Stage } from '../types';

type AllStages = { alpha: Stage[], bravo: Stage[] };

const DB_NAME = 'CassaVegasDB';
const DB_VERSION = 1;
const STAGES_STORE_NAME = 'workflowStages';
const STAGES_KEY = 'currentStages';

let db: IDBDatabase | null = null;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Database error:", (event.target as IDBOpenDBRequest).error);
      reject("Error opening DB.");
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STAGES_STORE_NAME)) {
        dbInstance.createObjectStore(STAGES_STORE_NAME);
      }
    };
  });
};

export const saveStages = async (stages: AllStages): Promise<void> => {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    try {
      const transaction = dbInstance.transaction(STAGES_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STAGES_STORE_NAME);
      store.put(stages, STAGES_KEY);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        console.error("Transaction error:", transaction.error);
        reject(transaction.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const getStages = async (): Promise<AllStages | null> => {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        try {
            const transaction = dbInstance.transaction(STAGES_STORE_NAME, 'readonly');
            const store = transaction.objectStore(STAGES_STORE_NAME);
            const request = store.get(STAGES_KEY);

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = () => {
                console.error("Error getting stages:", request.error);
                reject(request.error);
            };
        } catch(error) {
            reject(error);
        }
    });
};
