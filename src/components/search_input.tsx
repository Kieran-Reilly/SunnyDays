import { useState } from "react";
import { GoeLocationData } from "../types/locationTypes";
import { CurrentWeather } from "../types/weatherTypes";
import { getLocation } from "../managers/location-manager";
import { getCurrentWeather } from "../managers/weather-manager";

//TODO: JSDocs
function SearchResultItems({searchResults, locationSelected}: {searchResults: GoeLocationData[], locationSelected: React.MouseEventHandler}) {
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

//TODO: JSDocs
export default function SearchInput({currentWeather, weather, setCurrentWeather, setCurrentView, setActiveCard}: {currentWeather: CurrentWeather,weather: CurrentWeather, setCurrentWeather:  React.Dispatch<React.SetStateAction<CurrentWeather>>, setCurrentView: React.Dispatch<React.SetStateAction<string>>, setActiveCard: React.Dispatch<React.SetStateAction<number>>}) {
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searchResultsListActive, setSearchResultsListActive] = useState(false);

    //TODO: JSDocs
    function handleChange(event: React.BaseSyntheticEvent) {
        if (event.target?.value.trim() == '') {
            clearLocation();
        }

        setSearchString(event.target?.value);
    }

    //TODO: JSDocs
    function inputKeyUpHandler(event: React.KeyboardEvent) {
        if (event.key === 'Enter')  searchForLocation();
    }

    //TODO: JSDocs
    async function searchForLocation() {
        if (searchString == null || searchString.trim() == '') return;

        const requestResult = await getLocation(searchString);
        if (requestResult.length > 0 ) {
            setSearchResults(requestResult);
            setSearchResultsListActive(true);
        }
    }

    //TODO: JSDocs
    function clearLocation() {
        if (searchString == null || searchString.trim() == '') return;

        setSearchResults(null);
        setSearchString('');
        setSearchResultsListActive(false);
        setCurrentWeather(weather);
        setActiveCard(weather.id);
        setCurrentView("currentWeather");
    }

    //TODO: JSDocs
    async function locationSelected(event: React.MouseEvent) {
        setSearchResultsListActive(false);
        const target = event.target as HTMLElement;
        
        //Fetch weather for specified location
        const weatherResult = await getCurrentWeather(Number(target?.dataset.lat), Number(target?.dataset.lon));

        //Set currentWeather to fetched weather result
        setCurrentWeather(weatherResult);
        setActiveCard(weatherResult.id);
    }

    return (
        <>
            <div className="search-container">
                <input type="text" placeholder="Search for a location" value={searchString} onChange={handleChange} onKeyUp={inputKeyUpHandler}></input>
                <button className="search-btn" onClick={searchForLocation}>Search</button>
                {currentWeather != weather && <button className="clear-btn" onClick={clearLocation}>Clear</button>}                
                {searchString != '' && searchResults && searchResultsListActive == true && 
                    <ul className="search-results">
                        <SearchResultItems searchResults={searchResults} locationSelected={locationSelected}></SearchResultItems>
                    </ul>
                }
            </div>
        </>
    )
}