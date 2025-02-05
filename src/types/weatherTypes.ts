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