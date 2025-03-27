import { openDB, deleteDB } from 'idb';

const DB_NAME = 'CityScoutDB';
const STORE_NAME = 'recommendations';
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 phút
const EXPIRATION_KEY = 'db_expiration'; // Key to track expiration in localStorage

export const initDB = async () => {
    // Check if the DB should be deleted due to expiration
    const expirationTime = localStorage.getItem(EXPIRATION_KEY);
    if (expirationTime && Date.now() > Number(expirationTime)) {
        await deleteDatabase();
    }

    // Refresh expiration time
    refreshExpiration();

    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'createdAt' });
            }
        },
    });
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

// ✅ Save data & refresh expiration
export const saveData = async (data: any) => {
    const db = await initDB();
    const newData = { ...data, createdAt: Date.now() };
    await db.put(STORE_NAME, newData);
    refreshExpiration(); // Extend expiration on save
};

// ✅ Get data, clean expired entries & refresh expiration
export const getData = async () => {
    const db = await initDB();
    const allData = await db.getAll(STORE_NAME);

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
