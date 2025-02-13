import { FaGithub, FaLinkedin  } from "react-icons/fa6";
import WeatherCard from "./components/weather_card";
import { CurrentWeather} from "./types/weatherTypes";
import { useState } from "react";
import { getCurrentWeather, getForecast } from "./managers/weather-manager";
import FiveDayForecast from "./components/five_day_forecast";
import { getLocation } from "./managers/location-manager";
import { GoeLocationData } from "./types/locationTypes";
import { addToDB } from "./managers/favourites-manager";


function SearchResult({searchResults, locationSelected}: {searchResults: GoeLocationData[], locationSelected: React.MouseEventHandler}) {
    const listItems = searchResults.map(item => {
        const key = `${item.lat}${item.lon}`;

        return (
            <li  key={key} className="search-result-item" data-lat={item.lat} data-lon={item.lon} onClick={locationSelected}>
                <span className="search-result-main">{item.name}, {item.country}</span>
                <span className="search-result-secondary">{item.lat.toFixed(3)}, {item.lon.toFixed(3)}</span>
            </li>
        )
    })

    return (
        <>
            {listItems}
        </>
    )
}

export default function app(weather: CurrentWeather) {
    const [currentView, setCurrentView] = useState('currentWeather');
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searchResultsListActive, setSearchResultsListActive] = useState(false);
    const [currentWeather, setCurrentWeather] = useState(weather);

    async function toggleView(event: React.MouseEvent) {
        if (currentView === 'currentWeather') {
            setLoading(true);
            const target = event.target as HTMLElement;
            const selectedCard = target.parentElement?.parentElement;
            const lat = Number(selectedCard?.dataset.lat);
            const lon = Number(selectedCard?.dataset.lon);

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

    function handleChange(event: React.BaseSyntheticEvent) {
        if (event.target?.value.trim() == '') {
            clearLocation();
        }

        setSearchString(event.target?.value);
    }

    function inputKeyUpHandler(event: React.KeyboardEvent) {
        if (event.key === 'Enter')  searchForLocation();
    }

    async function searchForLocation() {
        if (searchString == null || searchString.trim() == '') return;

        const requestResult = await getLocation(searchString);
        if (requestResult.length > 0 ) {
            setSearchResults(requestResult);
            setSearchResultsListActive(true);
        }
    }

    function clearLocation() {
        if (searchString == null || searchString.trim() == '') return;

        setSearchResults(null);
        setSearchString('');
        setSearchResultsListActive(false);
        setCurrentWeather(weather);
        setCurrentView("currentWeather");
    }

    async function locationSelected(event: React.MouseEvent) {
        setSearchResultsListActive(false);
        const target = event.target as HTMLElement;
        
        //Fetch weather for specified location
        const weatherResult = await getCurrentWeather(Number(target?.dataset.lat), Number(target?.dataset.lon));

        //Set currentWeather to fetched weather result
        setCurrentWeather(weatherResult);
    }

    async function toggleFavourites(event: React.MouseEvent) {
        console.log("adding to favourites", event);

    //     const target = event.target as HTMLElement;
    //     const selectedCard = target.parentElement?.parentElement?.parentElement;
    //     await addToDB({id: Number(selectedCard?.dataset.id), lat: Number(selectedCard?.dataset.id), lon: Number(selectedCard?.dataset.id), name: selectedCard?.dataset.location || ''});
    }

    return (
        <>
            <div className="app-header">
                Some Logo
            </div>
            <div className="app-main" data-active-view={currentView}>
                <div className="search-container">
                    <input type="text" placeholder="Search for a location" value={searchString} onChange={handleChange} onKeyUp={inputKeyUpHandler}></input>
                    <button className="search-btn" onClick={searchForLocation}>Search</button>
                    {currentWeather != weather && <button className="clear-btn" onClick={clearLocation}>Clear</button>}                
                    {searchString != '' && searchResults && searchResultsListActive == true && 
                        <ul className="search-results">
                            <SearchResult searchResults={searchResults} locationSelected={locationSelected}></SearchResult>
                        </ul>
                    }
                </div>
                {currentView === 'currentWeather' && <WeatherCard weatherData={currentWeather} toggleView={toggleView} toggleFavourites={toggleFavourites}/>}
                {currentView === 'forecast' && forecastData != null && <FiveDayForecast forecastInfo={forecastData} toggleView={toggleView} toggleFavourites={toggleFavourites}></FiveDayForecast>}
            </div>
            <div className="app-footer">
                <p>Developed by Kieran Reilly</p>
                <a className="icon-btn" href="https://github.com/Kieran-Reilly/SunnyDays" target="_blank"><FaGithub /></a>
                <a className="icon-btn" href="https://www.linkedin.com/in/kieran--reilly/" target="_blank"><FaLinkedin /></a>
            </div>
        </>
    );
}