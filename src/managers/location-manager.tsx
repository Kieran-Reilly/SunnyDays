import {Location} from "./../types/locationTypes"

/**
 * Responsible for retrieving locations either using the navigator.geolocation API or openWeather's geocoding API
 */


/**
 * Uses the Geolocation API which will request the user to provide their location
 * reference: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 * @param locationRetrievedSuccess {Function} - success callback
 * @param locationRetrievedError {Function} - error callback
 * @returns result {Location} - user's location data
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

/**
 * Allows the retrieval of geographical coordinates (lat, lon) by using name of the location (city name or area name)
 * @param location {String} - City name, state or country code to be used to retrieve the correct lat and lon 
 * @returns 
 */
export async function getLocation (location: string ) {
    const result = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=9abcaf69d758c66e9c57d5b4775cf765`)
        .then((response) => {return response.json()})
        .then((result) => {return result})
        .catch((error) => {
            console.error(error);
            //TODO: return dummy data if this request falls over
        });

    console.log('Matching locations', result);
    return result;
}