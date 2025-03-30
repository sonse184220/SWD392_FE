import { getRecommendationList } from '@/services/geminiAIService';
import { openDB, deleteDB } from 'idb';

const DB_NAME = 'CityScoutDB';
const STORE_NAME = 'recommendations';
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 phút
const EXPIRATION_KEY = 'db_expiration'; // Key to track expiration in localStorage
const LAST_SYNC_KEY = 'last_data_sync';

export const initDB = async (token: string) => {
    // Check if the DB should be deleted due to expiration
    const expirationTime = localStorage.getItem(EXPIRATION_KEY);
    if (expirationTime && Date.now() > Number(expirationTime)) {
        await deleteDatabase();
    }

    // Refresh expiration time
    refreshExpiration();

    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'createdAt' });
            }
        },
    });

    // Initialize with data from server if needed
    await syncDataFromServer(token);

    return db;

    // return openDB(DB_NAME, 1, {
    //     upgrade(db) {
    //         if (!db.objectStoreNames.contains(STORE_NAME)) {
    //             db.createObjectStore(STORE_NAME, { keyPath: 'createdAt' });
    //         }
    //     },
    // });
};

// 🔄 Refresh expiration time
const refreshExpiration = () => {
    localStorage.setItem(EXPIRATION_KEY, (Date.now() + EXPIRATION_TIME).toString());
};

// ❌ Delete entire DB when it expires
export const deleteDatabase = async () => {
    await deleteDB(DB_NAME);
    localStorage.removeItem(EXPIRATION_KEY);
    console.log('🔴 IndexedDB has been deleted due to inactivity');
};

// 🔄 Sync data from server
export const syncDataFromServer = async (token: string) => {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    const now = Date.now();

    // Only sync if we haven't synced recently (e.g., in the last minute)
    // or if this is the first sync
    if (!lastSync || (now - Number(lastSync) > 60000)) {
        try {
            const response = await getRecommendationList(token);
            if (response && response.data) {
                const db = await openDB(DB_NAME, 1);

                // Clear existing data to avoid duplicates
                const tx = db.transaction(STORE_NAME, 'readwrite');
                await tx.objectStore(STORE_NAME).clear();

                // Add all new items with current timestamp
                const timestamp = Date.now();
                for (const item of response.data) {
                    await tx.objectStore(STORE_NAME).put({
                        ...item.response,
                        createdAt: Date.now()
                    });
                }

                await tx.done;

                // Update last sync time
                localStorage.setItem(LAST_SYNC_KEY, now.toString());
                console.log('🟢 Data synced from server');
            }
        } catch (error) {
            console.error('❌ Failed to sync data from server:', error);
        }
    }
};

// ✅ Save data & refresh expiration
export const saveData = async (data: any, token: string) => {
    const db = await initDB(token);
    const newData = { ...data, createdAt: Date.now() };
    await db.put(STORE_NAME, newData);
    refreshExpiration(); // Extend expiration on save
};

// ✅ Get data, clean expired entries & refresh expiration
export const getData = async (token: string) => {
    const db = await initDB(token);
    const allData = await db.getAll(STORE_NAME);

    // If no data found, try to sync from server
    if (allData.length === 0) {
        await syncDataFromServer(token);
        // Fetch again after sync
        return await db.getAll(STORE_NAME);
    }

    const now = Date.now();
    const validData = allData.filter((item: any) => now - item.createdAt < EXPIRATION_TIME);

    // Remove expired data
    for (const item of allData) {
        if (now - item.createdAt >= EXPIRATION_TIME) {
            await db.delete(STORE_NAME, item.createdAt);
        }
    }

    if (validData.length > 0) {
        refreshExpiration(); // Extend expiration if there's still valid data
    }

    return validData;
};
