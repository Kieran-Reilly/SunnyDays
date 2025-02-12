/**
 * Responsible for making api calls to openWeather
 */

/**
 * Retrieves the current weather report for a specified location
 * @param lat {number} - the latitude of the desired location
 * @param lon {number} - the longitude of the desired location
 * @returns result {CurrentWeather} - weather data for the desired location
 */
export async function getCurrentWeather(lat: number, lon: number) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=9abcaf69d758c66e9c57d5b4775cf765`)
        .then((response) => {return response.json()})
        .then((result) => {return result})
        .catch((error) => {
            console.error(error);
            //TODO: return dummy data if this request falls over
        });
    
    console.log("Current Weather", result);
    return result
}


/**
 * Retrieves a 5-day forecast for a specified location
 * @param lat {number} - the latitude of the desired location
 * @param lon {number} - the longitude of the desired location
 * @returns result {ForecastData} - 5-day forecast data for the desired location 
 */
export async function getForecast(lat: number, lon: number) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=9abcaf69d758c66e9c57d5b4775cf765`)
        .then((response) => {return response.json()})
        .then((result) => {return result})
        .catch((error) => {
            console.error(error);
            //TODO: return dummy data if this request falls over
        });

    console.log("Forecast", result);
    return result
}