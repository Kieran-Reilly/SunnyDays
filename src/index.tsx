import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './app';
import { getCurrentLocation } from './managers/location-manager';
import { getCurrentWeather } from './managers/weather-manager';
import { CurrentWeather } from './types/weatherTypes';
import { Location } from './types/locationTypes';
import { retrieveAllIDs } from './managers/favourites-manager';

function locationRetrievedSuccess(position: Location): Location {
  return position;
}

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


function render(currentWeather: CurrentWeather) {
  console.log("rendering");
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <React.StrictMode>
      <App weather={currentWeather} favourites={favourites}/>
    </React.StrictMode>
  );
}

// TODO: start loader
// need to retrieve location | have a fallback location to be used in retrieving weather data
const currentLocation = await getCurrentLocation(locationRetrievedSuccess, locationRetrievedError);

// once location is defined, need to retrieve weather data for that location
const currentWeather = await getCurrentWeather(currentLocation.coords.latitude, currentLocation.coords.longitude);

//retrieve all the favourited items within the LocationsDB
const favourites = await retrieveAllIDs() || new Array<Number>;

// once weather data is retrieve, need to pass that on to App for rendering
render(currentWeather);

// TODO: once rendering is complete, stop loader