/**
 * Responsible for making api calls to openWeather
 */

import { Forecast, ForecastData } from "../types/weatherTypes";
import { getNextDay } from "../types/weatherUtils";

/**
 * Retrieves the current weather report for a specified location
 * Reference: https://openweathermap.org/current
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
 * Reference: https://openweathermap.org/forecast5#concept
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

/**
 * Builds up data for a 5-day forecast which will be used to populate the individual forecast-content
 * @param forecastInfo {Forecast} - an instance of the Forecast interface containing forecast data
 * @return forecastData {ForecastData[]} - an array of ForecastData instances, 1 for each day for the next 5 days after the current day 
 */
export function buildForecastData(forecastInfo: Forecast) {
    const forecastData = [];
    
    //get tomorrow at 12
    const currentDate = new Date();
    currentDate.setUTCHours(12,0,0,0);
    let nextDay = getNextDay(currentDate);

    for (const item of forecastInfo.list) {
        const itemDate = new Date(item.dt * 1000);
        //find highest and lowest temps for the day
        setMinMaxTemps(item, itemDate, forecastInfo);

        if (itemDate.getTime() == nextDay.getTime()) {
            //add this item to forecastData
            forecastData.push(item);
            nextDay = getNextDay(nextDay);
            continue;
        }

        if (forecastInfo.list.indexOf(item) === forecastInfo.list.length - 1 && forecastData.length == 4) {
            //add last data point
            forecastData.push(item);
        }
    }

    return forecastData;
}


/**
 * Given a specific ForecastData item, finds the min and max temps for dates within the data for that particular day
 * @param item {ForecastData} - a ForecastData item containing weather information for a particular day within a 5-day forecast
 * @param itemDate {Date} - the date of a particular forecast data item
 * @param forecastInfo {Forecast} - forecast information made up of ForecastData items for a 5-day forecast
 */
export function setMinMaxTemps(item: ForecastData, itemDate: Date, forecastInfo: Forecast) {
    let lowestTemp = item.main.temp_min;
    let highestTemp = item.main.temp_max;
    for (const listItem of forecastInfo.list) {
        const listItemDate = new Date(listItem.dt * 1000);
        if (listItemDate.getDate() != itemDate.getDate()) {
            continue;
        }

        if (listItem.main.temp_min < lowestTemp) {
            lowestTemp = listItem.main.temp_min;
        };

        if (listItem.main.temp_max > highestTemp) {
            highestTemp = listItem.main.temp_max;
        }
    }
    
    item.main.max_day_temp = highestTemp;
    item.main.min_day_temp = lowestTemp;
}