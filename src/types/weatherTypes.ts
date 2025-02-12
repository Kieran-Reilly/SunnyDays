export interface Location {
    coords: {
      latitude: number,
      longitude: number
    }
  }

interface WeatherData {
  "id": number,
  "main": string,
  "description": string,
  "icon": string
}

// for an explanation on these properties, please see: https://openweathermap.org/current#fields_json
export interface CurrentWeather {
    "weather": WeatherData[],
    "date"?: Date,
    "coord"?: {
        "lat": number,
        "lon": number,
    }
    "main": {
        "temp": number,
        "feels_like": number,
        "temp_min": number,
        "temp_max": number,
        "pressure": number,
        "humidity": number,
        "sea_level": number,
        "grnd_level": number
    },
    "visibility": number,
    "wind": {
        "speed": number,
        "deg": number,
        "gust": number
    },
    "clouds": {
        "all": number
    },
    "rain": {
        "1h"?: number,
        "3h"?: number
    },
    "snow": {
        "1h"?: number,
        "3h"?: number
    },
    "sys": {
        "country": string,
        "sunrise": number,
        "sunset": number
    },
    "timezone": number,
    "id": number,
    "name": string
}

export interface ForecastData {
    "weather": WeatherData[],
    "date"?: Date,
    "dt": number,
    "dt_txt": string,
    "main": {
        "temp": number,
        "feels_like": number,
        "temp_min": number,
        "temp_max": number,
        "pressure": number,
        "humidity": number,
        "sea_level": number,
        "grnd_level": number,
        "max_day_temp"?: number,
        "min_day_temp"?: number,
    },
    "visibility": number,
    "wind": {
        "speed": number,
        "deg": number,
        "gust": number
    },
    "clouds": {
        "all": number
    },
    "rain": {
        "3h"?: number
    },
    "snow": {
        "3h"?: number
    }
}

export interface Forecast {
    city: {
        country: string,
        id: number,
        name: string,
        sunrise: number,
        sunset: number,
        timezone: number
    }, 
    list: ForecastData[]
}

/*
    Each direction is 11.25 (360 / 32) degrees farther than the previous. 
    For example, N (north) is 0 degrees, NbE (north by east) is 11.25 degrees, 
    NNE (north-northeast) is 22.5 degrees, etc.

    so given the degrees, simply divide by 11.25 and round to the nearest int to find 
    corresponding direction i.e. 180 / 11.25 = 16 -> windDirections[16] = S
*/
export const windDirections = [
    "N",
    "NbE",
    "NNE",
    "NEbN",
    "NE",
    "NEbE",
    "ENE",
    "EbN",
    "E",
    "EbS",
    "ESE",
    "SEbE",
    "SE",
    "SEbS",
    "SSE",
    "SbE",
    "S",
    "SbW",
    "SSW",
    "SWbS",
    "SW",
    "SWbW",
    "WSW",
    "WbS",
    "W",
    "WbN",
    "WNW",
    "NWbW",
    "NW",
    "NWbN",
    "NNW",
    "Nb"
]

/**
 * Given the meteorological degrees, returns the corresponding compass wind direction (N|S|E|W|etc.)
 * @param degrees {number} - the amount of meteorological degrees indicating wind direction
 * @returns windDirection {String} - the direction the wind is blowing
 */
export function fetchWindDirection(degrees: number) {
    const index = Math.round(degrees/11.25);
    return windDirections[index];
}

const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
]

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

/**
 * Returns the next date from a given date
 * @param date {Date} - the date to be used to get the next date
 * @returns nextDay {Date} - returns the next date after the specified date
 */
export function getNextDay(date: Date) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    return nextDay;
}

/**
 * Takes in the number representation of the day of the week and returns the corresponding abbreviated day of the week
 * @param day {number} - the day of the week 0 - 6 which should point to the index in the day's array above 
 * @returns day {string} - the corresponding abbreviated day of the week
 */
export function getDayOfWeek(day: number) {
    return days[day];
}

/**
 * Takes a number representation of the month of the year and returns the corresponding abbreviated month
 * @param month {number} - the month 0 - 11 which represents the index of the corresponding month in the array above
 * @returns month {string} - the corresponding abbreviated month of the year
 */
export function getMonth(month: number) {
    return months[month]
}