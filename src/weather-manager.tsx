/**
 * Responsible for making api calls to openWeather
 */

export async function getCurrentWeather(lat: number, lon: number) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=9abcaf69d758c66e9c57d5b4775cf765`)
        .then((response) => {return response.json()})
        .then((result) => {return result})
        .catch((error) => {console.error(error)});
    
    console.log(result);
}


export async function getForecast(lat: number, lon: number) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=9abcaf69d758c66e9c57d5b4775cf765`)
        .then((response) => {return response.json()})
        .then((result) => {return result})
        .catch((error) => {console.error(error)});

    console.log(result);
}