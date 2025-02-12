import { FaGithub, FaLinkedin  } from "react-icons/fa6";
import WeatherCard from "./components/weather_card";
import { CurrentWeather} from "./types/weatherTypes";
import { useState } from "react";
import { getForecast } from "./managers/weather-manager";
import FiveDayForecast from "./components/five_day_forecast";

export default function app(weather: CurrentWeather) {
    const [currentView, setCurrentView] = useState('currentWeather');
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);

    async function toggleView(event: React.MouseEvent) {
        if (currentView === 'currentWeather') {
            setLoading(true);
            const target = event.target as HTMLElement;
            const selectedCard = target.parentElement?.parentElement;
            const lat = Number(selectedCard?.dataset.lat);
            const lon = Number(selectedCard?.dataset.lon);

            //TODO: implement check to see if we already have lat and lon forecast data in state to save on a request
            const requestResult = await getForecast(lat, lon);
            setForecastData(requestResult);
            setCurrentView('forecast');
            setLoading(false);
            return;
        }

        if (currentView === 'forecast') {
            setLoading(true);
            setCurrentView('currentWeather');
            setLoading(false);
            return;
        }
    }

    const currentDate = new Date();
    const headerInfo = {date: currentDate, ...weather};
    return (
        <>
            <div className="app-header">
                Some Logo
            </div>
            <div className="app-main" data-active-view={currentView}>
                {currentView === 'currentWeather' && <WeatherCard headerInfo={headerInfo} toggleView={toggleView} />}
                {forecastData != null && currentView === 'forecast' && <FiveDayForecast forecastInfo={forecastData} toggleView={toggleView}></FiveDayForecast>}
            </div>
            <div className="app-footer">
                <p>Developed by Kieran Reilly</p>
                <a className="icon-btn" href="https://github.com/Kieran-Reilly/SunnyDays" target="_blank"><FaGithub /></a>
                <a className="icon-btn" href="https://www.linkedin.com/in/kieran--reilly/" target="_blank"><FaLinkedin /></a>
            </div>
        </>
    );
}