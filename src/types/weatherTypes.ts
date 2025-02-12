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

//For an explanation of these fields, please see: https://openweathermap.org/forecast5#fields_JSON
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