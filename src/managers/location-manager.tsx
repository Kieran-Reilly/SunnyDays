import {Location} from "./../types/weatherTypes"

/**
 * Responsible for retrieving locations either using the navigator.geolocation API or openWeather's geocoding API
 */
export async function getCurrentLocation (
    locationRetrievedSuccess: (position: GeolocationPosition) => Location,
    locationRetrievedError: (error: GeolocationPositionError) => Location
): Promise<Location> {
    if (!navigator.geolocation) {
        return locationRetrievedError({code: -1, message: "Geolocation is not supported by your browser", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3});
    } 

    const retrievePromise: Promise<Location> = new Promise((resolve, reject) => { 
        navigator.geolocation.getCurrentPosition(
            (position) => {resolve(locationRetrievedSuccess(position))}, 
            (error) => {reject(locationRetrievedError(error))});
    })

    return await retrievePromise
        .then(result => result)
        .catch((error) => {return locationRetrievedError({code: -1, message: error, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3})});;
}