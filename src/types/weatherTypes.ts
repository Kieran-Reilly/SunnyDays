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
        "1h"?: number
    },
    "snow": {
        "1h"?: number
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