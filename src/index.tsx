import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './app';
import { getCurrentLocation } from './managers/location-manager';
import { getCurrentWeather } from './managers/weather-manager';
import { CurrentWeather } from './types/weatherTypes';
import { Location } from './types/locationTypes';
import { retrieveAllIDs } from './managers/favourites-manager';

/**
 * Location retrieved successfully handler which returns the latitude and longitude of a specified location
 * @param position {Location} - the latitude and longitude of the specified location
 * @returns position {Location}
 */
function locationRetrievedSuccess(position: Location): Location {
  return position;
}

/**
 * Location retrieved error handler which handles any errors that occured during the retrieval of latitude and longitude
 * coords for a specified location. Provides a default latitude and longitude in this event.
 * @param error {GeolocationPositionError} - Error code and message to be logged
 * @returns defaultLocation {Location} - A default location's latitude and longitude as a fallback
 */
function locationRetrievedError(error: GeolocationPositionError): Location {
  console.error("failed to retrieve current location", error.code, error.message);
  
  //NOTE: Will just return a default lat and lon
  const defaultLocation: Location = {
    coords: {
      latitude: -29.7795584,
      longitude: 31.04768
    }
  }

  return defaultLocation;
}

/**
 * Kicks of the render process of the application, handing the retrieve weather data to the app component.
 * @param currentWeather {CurrentWeather} - The current weather for the location that was retrieved
 */
function render(currentWeather: CurrentWeather) {
  console.log("rendering");
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <React.StrictMode>
      <App weather={currentWeather} favourites={favourites}/>
    </React.StrictMode>
  );
}

// need to retrieve location | have a fallback location to be used in retrieving weather data
const currentLocation = await getCurrentLocation(locationRetrievedSuccess, locationRetrievedError);

// once location is defined, need to retrieve weather data for that location
const currentWeather = await getCurrentWeather(currentLocation.coords.latitude, currentLocation.coords.longitude);

//retrieve all the favourited items within the LocationsDB
const favourites = await retrieveAllIDs() || new Array<Number>;

// once weather data is retrieve, need to pass that on to App for rendering
render(currentWeather);