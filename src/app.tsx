import { FaGithub, FaLinkedin  } from "react-icons/fa6";
import WeatherCard, { WeatherCards } from "./components/weather_card";
import { CurrentWeather} from "./types/weatherTypes";
import { useState } from "react";
import {getForecast } from "./managers/weather-manager";
import FiveDayForecast from "./components/five_day_forecast";
import { addToDB, removeFromDB } from "./managers/favourites-manager";
import SearchInput from "./components/search_input";
import Loader from "./components/loader";


export default function app({weather, favourites}: {weather: CurrentWeather, favourites: Array<Number>}) {
    const [currentView, setCurrentView] = useState('currentWeather');
    const [forecastData, setForecastData] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(weather);
    const [favouritedItemIDs, setFavouritedItems] = useState(favourites);
    const [activeCard, setActiveCard] = useState(weather.id);

    async function toggleView(event: React.MouseEvent) {
        if (currentView === 'currentWeather') {
            const target = event.target as HTMLElement;
            const selectedCard = target.parentElement?.parentElement;
            const lat = Number(selectedCard?.dataset.lat);
            const lon = Number(selectedCard?.dataset.lon);

            const requestResult = await getForecast(lat, lon);
            setForecastData(requestResult);
            setCurrentView('forecast');
            return;
        }

        if (currentView === 'forecast') {
            if (favouritedItemIDs.indexOf(activeCard) == -1 && currentWeather.id !== activeCard) {
                setActiveCard(currentWeather.id);
            }

            setCurrentView('currentWeather');
        }
    }

    async function toggleFavourites(event: React.MouseEvent) {
        const target = event.target as HTMLElement;
        const selectedCard = target.parentElement?.parentElement?.parentElement;

        const index = favouritedItemIDs.indexOf(Number(selectedCard?.dataset.id));
        if (index === -1) {
            await addToDB({id: Number(selectedCard?.dataset.id), lat: Number(selectedCard?.dataset.lat), lon: Number(selectedCard?.dataset.lon), name: selectedCard?.dataset.location || ''});
            favouritedItemIDs.push(Number(selectedCard?.dataset.id))
            setFavouritedItems([...favouritedItemIDs]);
        } else {
            await removeFromDB(Number(selectedCard?.dataset.id));
            favouritedItemIDs.splice(index, 1);
            setFavouritedItems([...favouritedItemIDs]);
        }
    }

    return (
        <>
            <div className="app-header">
                Some Logo
            </div>
            <div className="app-main" data-active-view={currentView}>
                <SearchInput currentWeather={currentWeather} weather={weather} setCurrentWeather={setCurrentWeather} setCurrentView={setCurrentView} setActiveCard={setActiveCard}></SearchInput>
                {currentView === 'currentWeather' && <WeatherCard weatherData={currentWeather} favouritedItems={favouritedItemIDs} toggleView={toggleView} toggleFavourites={toggleFavourites} activeCard={activeCard} setActiveCard={setActiveCard}/>}
                {currentView === 'currentWeather' && favouritedItemIDs.length > 0 && 
                    <div className="favourites">
                        <WeatherCards currentWeather={currentWeather} favourites={favouritedItemIDs} toggleView={toggleView} toggleFavourites={toggleFavourites} activeCard={activeCard} setActiveCard={setActiveCard}/>
                    </div>}
                {currentView === 'forecast' && forecastData != null && <FiveDayForecast forecastInfo={forecastData} favouritedItems={favouritedItemIDs} toggleView={toggleView} toggleFavourites={toggleFavourites}></FiveDayForecast>}
            </div>
            <div className="app-footer">
                <p>Developed by Kieran Reilly</p>
                <a className="icon-btn" href="https://github.com/Kieran-Reilly/SunnyDays" target="_blank"><FaGithub /></a>
                <a className="icon-btn" href="https://www.linkedin.com/in/kieran--reilly/" target="_blank"><FaLinkedin /></a>
            </div>
        </>
    );
}