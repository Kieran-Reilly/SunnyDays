/**
 * Will be responsible for managing favourite locations using the IndexedDB API.
 */

import { IndexedDBLocation } from "../types/locationTypes";


/**
 * Establishes a connection to the given indexedDB, 
 * creating the necessary Locations data store
 * @returns db {IDBDatabase} - The IDBDatabase interface of the IndexedDB API provides a connection to a database
 */
export async function openDB(): Promise<IDBDatabase | null> {
    let db: IDBDatabase | null;

    const requestPromise: Promise<IDBDatabase | null> = new Promise((resolve, reject) => {
        const request = window.indexedDB.open("LocationsDB");
        request.onerror = (event: Event) => {
            console.error("Some error occured when establishing indexedDB connenction", event);
            reject(null);
        }
        request.onsuccess = (event: Event) => {
            //connection is returned
            console.log(`Connection to indexDB LocationsDB has been established`);
            const target = event.target as IDBOpenDBRequest;
            db = target.result;
            resolve(db);
        }
        request.onupgradeneeded = (event: IDBVersionChangeEvent ) => {
            const target = event.target as IDBOpenDBRequest;
            db = target.result;
            const objectStore = db.createObjectStore("Locations", {"keyPath": "id"});
            objectStore.transaction.oncomplete = () => {
                console.log("Object store 'Locations' successfully created on DB");
                resolve(db);
            }
        }
    })

    db = await requestPromise;
    return db;
}

/**
 * Creates a transaction when looking to interact with the LocationsDB
 * @param db {IDBDatabase} - The connection to the LocationsDB
 * @returns transaction {IDBTransaction} - the transaction to be used to interact with the LocationsDB
 */
async function createTransaction(db: IDBDatabase ):Promise<IDBTransaction> {
    const transaction = db?.transaction(["Locations"], "readwrite");
    transaction.oncomplete = (event) => {
        console.log("All done!");
    };
    
    transaction.onerror = (event) => {
        // TODO: Don't forget to handle errors!
        console.error("An error occured when trying to create a transaction with the LocationsDB", event);
    };

    return transaction;
}

/**
 * Retrieves the objectStore of the LocationsDB which contains all the favourited location data
 * @returns objectStore {IDBObjectStore} - LocationsDB object store containing all the favourited location information
 */
async function retrieveObjectStore() {
    const db = await openDB();
    if (db == null) return; //TODO: Might want to log an error here

    const transaction = await createTransaction(db);
    const objectStore = transaction.objectStore("Locations");
    return objectStore;
}

/**
 * Attempts to add a given location item to the LocationsDB
 * @param location {IndexedDBLocation} - Location data to be added to the LocationsDB
 * @returns 
 */
export async function addToDB(location: IndexedDBLocation) {
    const objectStore = await retrieveObjectStore();
    if (objectStore == null) return;

    const request = objectStore.add(location);
    request.onsuccess = (event) => {
        console.log("sucessfully added item location to LocationsDB");
    };
    request.onerror = (event) => {
        console.error("An error occured when trying to add to the LocationsDB", event);
    }
}

/**
 * Looks to remove an item of the LocationsDB given it's ID
 * @param id {Number} - item within the datastore that should be removed
 * @returns 
 */
export async function removeFromDB(id: number) {
    const objectStore = await retrieveObjectStore();
    if (objectStore == null) return;

    const request = objectStore.delete(id);
    request.onsuccess = (event) => {
        console.log("sucessfully deleted item location to LocationsDB");
    };
    request.onerror = (event) => {
        console.error("An error occured when trying to remove from the LocationsDB", event);
    }
}

/**
 * Returns all the objects (or undefined if empty) wihtin the LocationsDB
 * @returns {Promise<IndexedDBLocation[] | undefined>} - an array of all the objects within LocationsDB's store
 */
export async function retrieveAllItems() {
    const objectStore = await retrieveObjectStore();
    if (objectStore == null) return;

    const requestPromise: Promise<Array<IndexedDBLocation>> = new Promise((resolve, reject) => {
        const request = objectStore.getAll();
        request.onerror = (event) => {
            console.error("An error occured when trying to retrieve all the items off the LocationsDB", event);
        }
        request.onsuccess = (event) => {
            const target = event.target as IDBRequest;
            resolve(target.result);
        };
    });

    const favourites = await requestPromise;
    return favourites;
}

/**
 * Retrieves all the key's (which are the location IDs) off the LocationsDB
 * @returns favourites {Array<Number>} - The favourited location ID's
 */
export async function retrieveAllIDs() {
    const objectStore = await retrieveObjectStore();
    if (objectStore == null) return;

    const requestPromise: Promise<Array<Number>> = new Promise((resolve, reject) => {
        const request = objectStore.getAllKeys();
        request.onerror = (event) => {
            console.error("An error occured when trying to retrieve all the key's off of the LocationsDB", event);
        }
        request.onsuccess = (event) => {
            const target = event.target as IDBRequest;
            resolve(target.result);
        };
    });

    const favourites = await requestPromise;
    return favourites;
}