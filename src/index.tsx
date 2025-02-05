import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Optional: your global styles here
import App from './app';
import { getCurrentLocation } from './managers/location-manager';
import { getCurrentWeather, getForecast } from './managers/weather-manager';

import { CurrentWeather, Location } from './types/weatherTypes';


function locationRetrievedSuccess(position: Location): Location {
  return position;
}

function locationRetrievedError(error: GeolocationPositionError): Location {
  console.error("failed to retrieve current location", error.code, error.message);
  
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
      <App {...currentWeather}/>
    </React.StrictMode>
  );
}

// TODO: start loader
// need to retrieve location | have a fallback location to be used in retrieving weather data
const currentLocation = await getCurrentLocation(locationRetrievedSuccess, locationRetrievedError);
console.log(currentLocation);

// once location is defined, need to retrieve weather data for that location
const currentWeather = await getCurrentWeather(currentLocation.coords.latitude, currentLocation.coords.longitude);

// once weather data is retrieve, need to pass that on to App for rendering
render(currentWeather);

// TODO: once rendering is complete, stop loader