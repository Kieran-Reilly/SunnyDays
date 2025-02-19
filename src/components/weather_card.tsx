import { FaChevronDown, FaChevronUp, FaHeart, FaCloudRain, FaWind, FaGaugeHigh, FaDroplet, FaEye, FaRegSnowflake } from "react-icons/fa6";
import { CurrentWeather } from "../types/weatherTypes";
import { useState } from "react";
import { fetchWindDirection } from "../types/weatherUtils";
import { retrieveAllItems } from "../managers/favourites-manager";
import { getCurrentWeather } from "../managers/weather-manager";

/**
 * Retrieves the weather for any favourited locations
 * @returns favouritedWeatherData {Array<CurrentWeather>} - an array of the waether for the corresponding favourited weather locations
 */
async function fetchFavouritedWeatherData() {
    const favouriteItems = await retrieveAllItems();
    if (favouriteItems == null) return;

    const favouritedWeatherData = new Array<CurrentWeather>;
    for (const item of favouriteItems) {
        const itemWeather = await getCurrentWeather(item.lat, item.lon);
        favouritedWeatherData.push(itemWeather);
    }

    return favouritedWeatherData;
}
/**
 * Given a number of favourites locations, will render a list of weather cards per favourited location
 * @param currentWeather {CurrentWeather} - Current weather of the location
 * @param favourites {Array<Number>} - Array of the favourited locations
 * @param toggleView {Function} - Toggles the view between current weather and 5-day forecast
 * @param toggleFavourites {Function} - Adds/removes favourited locations
 * @param activeCard {Number} - The currently active weather card
 * @param setActiveCard {stateSetter} - Sets the active card state
 * @returns React Elements {JSX.Element} - A collection of weather cards
 */
export function WeatherCards({currentWeather, favourites, toggleView, toggleFavourites, activeCard, setActiveCard}: {currentWeather: CurrentWeather, favourites: Array<Number>, toggleView: React.MouseEventHandler, toggleFavourites: React.MouseEventHandler, activeCard: Number, setActiveCard: React.Dispatch<React.SetStateAction<number>>}) {
    const [weatherData, setWeatherData] = useState(new Array<CurrentWeather>);

    if (weatherData.length != favourites.length) {
        fetchFavouritedWeatherData()
        .then((result) => {
            result != null && setWeatherData(result);
        })
    }
    
    const favouriteWeatherItems = weatherData.map((item) => {
        if (currentWeather.id != item.id) {
            return (
                <WeatherCard key={item.id} weatherData={item} favouritedItems={favourites} toggleView={toggleView} toggleFavourites={toggleFavourites} activeCard={activeCard} setActiveCard={setActiveCard}> 
                </WeatherCard>
            )
        }
    })

    return (
        <>
            {favouriteWeatherItems}
        </>
    )
}


/**
 * Weather card component which displays the current weather data for a specific location.
 * Responsible for toggling the card as active/inactive.
 * @param weatherData {CurrentWeather} - Current weather of the location
 * @param favourites {Array<Number>} - Array of the favourited locations
 * @param toggleView {Function} - Toggles the view between current weather and 5-day forecast
 * @param toggleFavourites {Function} - Adds/removes favourited locations
 * @param activeCard {Number} - The currently active weather card
 * @param setActiveCard {stateSetter} - Sets the active card state
 * @returns React Elements {JSX.Element} - A weather card
 */
export default function WeatherCard({weatherData, favouritedItems, toggleView, toggleFavourites, activeCard, setActiveCard}: {weatherData: CurrentWeather,  favouritedItems: Array<Number>, toggleView: React.MouseEventHandler, toggleFavourites: React.MouseEventHandler, activeCard: Number, setActiveCard: React.Dispatch<React.SetStateAction<number>>}) {
    /**
     * Toggle Card Click handler which updates the active card
     */
    function toggleCard(event: React.MouseEvent) {
        const target = event.target as HTMLElement;
        const selectedTab = target.parentElement?.parentElement?.parentElement;

        if (Number(selectedTab?.dataset.id) != activeCard) {
            //open
            setActiveCard(Number(selectedTab?.dataset.id));
        } else {
            //close
            setActiveCard(-1);
        }
    }

    const description = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;
    
    const currentDate = weatherData.date || new Date();
    const rain = weatherData?.rain != null ? weatherData?.rain["3h"] : 0;
    const snow = weatherData?.snow != null ? weatherData?.snow["3h"] : 0;
    const windDirection = fetchWindDirection(weatherData.wind.deg);
    const visibility = weatherData.visibility/1000;
    const isFavourited = favouritedItems.indexOf(weatherData.id) != -1 ? true : false;

    return(
        <div className='weather-card' data-id={weatherData.id} data-location={weatherData.name} data-lat={weatherData.coord?.lat} data-lon={weatherData.coord?.lon} data-favourited={isFavourited}>
            <div className="card-header">
                { activeCard == weatherData.id ? (
                    <span className="card-header-info">
                        <p>{currentDate.toDateString()}, {currentDate.getHours()}:{currentDate.getMinutes()}</p>
                        <h3>{weatherData.name}</h3>
                        <p>Feels Like {Math.round(weatherData.main.feels_like)}°C, {description}</p>
                    </span>
                ) : (
                    <span className="card-header-info" data-is-open="false">
                        <h3>{weatherData.name}</h3>
                        <span>
                            { globalThis.onMobile == true ? (
                                <>
                                    <img src={`http://openweathermap.org/img/wn/${iconCode}.png`}></img>
                                    <p>{Math.round(weatherData.main.temp)}°C</p>
                                </>
                            ) : null}
                        </span>
                    </span>
                ) }
                <span className="card-header-buttons">
                    { globalThis.onMobile == true ? <button className="icon-btn" onClick={toggleCard}>{activeCard == weatherData.id ? <FaChevronUp /> : <FaChevronDown />}</button> : null}
                    <button className="icon-btn heart" onClick={toggleFavourites}><FaHeart /></button>
                </span>
            </div>
            { activeCard == weatherData.id || globalThis.onMobile == false ? (
                <>
                    <div className="card-body">
                        <div className="card-body-highlight">
                            <img src={`http://openweathermap.org/img/wn/${iconCode}.png`}></img>
                            <p>{Math.round(weatherData.main.temp)}°C</p>
                        </div>
                        <div className="card-body-info">
                            {rain !== 0 ? (
                                <>
                                    <span className="card-body-info-panel">
                                        <p>Expected amount of rain</p>
                                        <h4>{rain}mm/h</h4>
                                        <FaCloudRain />
                                    </span>
                                    <span className="card-body-info-panel-seperator"></span>
                                </>
                            ) : null}
                            {snow !== 0 ? (
                                <>
                                    <span className="card-body-info-panel">
                                    <p>Expected amount of snow</p>
                                    <h4>{snow}mm/h</h4>
                                    <FaRegSnowflake />
                                    </span>
                                    <span className="card-body-info-panel-seperator"></span>
                                </>
                            ) : null}
                            <span className="card-body-info-panel">
                                <p>Wind speed & direction</p>
                                <h4>{weatherData.wind.speed}m/s {windDirection}</h4>
                                <FaWind />
                            </span>
                            <span className="card-body-info-panel-seperator"></span>
                            <span className="card-body-info-panel">
                                <p>Pressure</p>
                                <h4>{weatherData.main.pressure}hPa</h4>
                                <FaGaugeHigh />
                            </span>
                            <span className="card-body-info-panel-seperator"></span>
                            <span className="card-body-info-panel">
                                <p>Humidity</p>
                                <h4>{weatherData.main.humidity}%</h4>
                                <FaDroplet />
                            </span>
                            <span className="card-body-info-panel-seperator"></span>
                            <span className="card-body-info-panel">
                                <p>Visibility</p>
                                <h4>{visibility}km</h4>
                                <FaEye />
                            </span>
                        </div>
                    </div>
                    <div className="card-footer"><button onClick={toggleView}>5 Day Forecast</button></div>
                </>
            ) : null}
        </div>
    )
}