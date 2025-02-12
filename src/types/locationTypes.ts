export interface Location {
    coords: {
      latitude: number,
      longitude: number
    }
  }


//for an explanation of these properties, please see: https://openweathermap.org/api/geocoding-api#fields_json
export interface GoeLocationData {
    name: string,
    lat: number,
    lon: number,
    country: string,
    state: string
}