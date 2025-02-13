/**
 * Will be responsible for managing favourite locations using the IndexedDB API.
 */

import { IndexedDBLocation } from "../types/locationTypes";


/**
 * Establishes a connection to the given indexedDB, 
 * creating the necessary Locations data store
 * @returns db {IDBDatabase} - The IDBDatabase interface of the IndexedDB API provides a connection to a database
 */
export async function openDB() {
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
 * Attempts to add a given location item to the LocationsDB
 * @param location {IndexedDBLocation} - Location data to be added to the LocationsDB
 * @returns 
 */
export async function addToDB(location: IndexedDBLocation) {
    const db = await openDB();
    if (db == null) return; //TODO Might want to log an error here

    const transaction = db?.transaction(["Locations"], "readwrite");
    //TODO: may want to pass in complete and error callbacks
    transaction.oncomplete = (event) => {
        console.log("All done!");
    };
    
    transaction.onerror = (event) => {
    // Don't forget to handle errors!
        console.error("An error occured when trying to create a transaction with the LocationsDB", event);
    };

    const objectStore = transaction.objectStore("Locations");
    const request = objectStore.add(location);
    request.onsuccess = (event) => {
        console.log("sucessfully added item location to LocationsDB");
    };
    request.onerror = (event) => {
        console.error("An error occured when trying to add to the LocationsDB", event);
    }
}