import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Optional: your global styles here
import App from './app';
import { getCurrentLocation } from './location-manager';
import { getCurrentWeather, getForecast } from './weather-manager';


interface location {
  coords: {
    latitude: number,
    longitude: number
  }
}

function locationRetrievedSuccess(position: location): location {
  return position;
}

function locationRetrievedError(error: GeolocationPositionError): location {
  console.error("failed to retrieve current location", error.code, error.message);
  
  const defaultLocation: location = {
    coords: {
      latitude: -29.7795584,
      longitude: 31.04768
    }
  }

  return defaultLocation;
}


function render() {
  console.log("rendering");
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// start loader
// need to retrieve location | have a fallback location to be used in retrieving weather data
const currentLocation = await getCurrentLocation(locationRetrievedSuccess, locationRetrievedError);
console.log(currentLocation);

const currentWeather = await getCurrentWeather(currentLocation.coords.latitude, currentLocation.coords.longitude);
const currentForecast = await getForecast(currentLocation.coords.latitude, currentLocation.coords.longitude);


// once location is defined, need to retrieve weather data for that location
// once weather data is retrieve, need to pass that on to App for rendering
// once rendering is complete, stop loader