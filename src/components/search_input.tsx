import { useState } from "react";
import { GoeLocationData } from "../types/locationTypes";
import { CurrentWeather } from "../types/weatherTypes";
import { getLocation } from "../managers/location-manager";
import { getCurrentWeather } from "../managers/weather-manager";

/**
 * Generates the list items to populate the Search Results UL
 * @param searchResults {Array<GoeLocationData>} - A list of geolocations that match with the searched location
 * @param locationSelected {React.MouseEventHandler} - Location Selected event handler
 * @returns React Elements {JSX.Element} - A collection of list items
 */
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

/**
 * Responsible for the rendering of the search input and it's sub-components.
 * Handles when the input values changes, if the enter key is pressed on the input,
 * as well as submitting the searched location, 
 * clearing the search input and populating the list of results.
 * @param currentWeather {CurrentWeather} - The current weather data for the current location
 * @param weather {CurrentWeather} - 
 * @param setCurrentWeather {stateSetter} - React useState hook to which sets currentWeather
 * @param setCurrentView {stateSetter} - React useState hook which sets currentView
 * @param setActiveCard {stateSetter} - React useState hook which sets activeCard
 * @returns React Elements {JSX.Element - The search component and it's sub components
 */
export default function SearchInput({currentWeather, weather, setCurrentWeather, setCurrentView, setActiveCard}: {currentWeather: CurrentWeather,weather: CurrentWeather, setCurrentWeather:  React.Dispatch<React.SetStateAction<CurrentWeather>>, setCurrentView: React.Dispatch<React.SetStateAction<string>>, setActiveCard: React.Dispatch<React.SetStateAction<number>>}) {
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searchResultsListActive, setSearchResultsListActive] = useState(false);

    /**
     * Input change handler which updates the searchString state
     * @param event {React.BaseSyntheticEvent} - Change event
     */
    function handleChange(event: React.BaseSyntheticEvent) {
        if (event.target?.value.trim() == '') {
            clearLocation();
        }

        setSearchString(event.target?.value);
    }

    /**
     * Input key up handler which checks whether the enter key has been pressed
     * @param event {React.BaseSyntheticEvent} - Key up event
     */
    function inputKeyUpHandler(event: React.KeyboardEvent) {
        if (event.key === 'Enter')  searchForLocation();
    }

    /**
     * Fires off the getLocation request given the location name, 
     * and returns an array of results with any matching locations 
     * and their corresponding latitude and longitude coordinants
     */
    async function searchForLocation() {
        if (searchString == null || searchString.trim() == '') return;

        const requestResult = await getLocation(searchString);
        if (requestResult.length > 0 ) {
            setSearchResults(requestResult);
            setSearchResultsListActive(true);
        }
    }

    /**
     * Clear location handler which will reset the search input and update any states to a "default" config
     */
    function clearLocation() {
        if (searchString == null || searchString.trim() == '') return;

        setSearchResults(null);
        setSearchString('');
        setSearchResultsListActive(false);
        setCurrentWeather(weather);
        setActiveCard(weather.id);
        setCurrentView("currentWeather");
    }

    /**
     * Location selected click event handler which fires when a list item within the search
     * results is selected. Fetches the current weather for the selected location and 
     * sets the corresponding states.
     * @param event {React.MouseEvent} -  Click event
     */
    async function locationSelected(event: React.MouseEvent) {
        setSearchResultsListActive(false);
        const target = event.target as HTMLElement;
        
        //Fetch weather for specified location
        const weatherResult = await getCurrentWeather(Number(target?.dataset.lat), Number(target?.dataset.lon));

        //Set currentWeather to fetched weather result
        setCurrentWeather(weatherResult);
        setActiveCard(weatherResult.id);
        setCurrentView("currentWeather");
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