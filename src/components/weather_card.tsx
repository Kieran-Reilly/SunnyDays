import { FaChevronDown, FaHeart, FaCloudRain, FaWind, FaGaugeHigh, FaDroplet, FaEye, FaRegSnowflake } from "react-icons/fa6";
import { CurrentWeather } from "../types/weatherTypes";
import { useState } from "react";
import { fetchWindDirection } from "../types/weatherUtils";
import { retrieveAllItems } from "../managers/favourites-manager";
import { getCurrentWeather } from "../managers/weather-manager";



async function fetchFavouritedWeatherData() {
    console.log("fetch favourites to render");

    
    const favouriteItems = await retrieveAllItems();
    if (favouriteItems == null) return;

    const favouritedWeatherData = new Array<CurrentWeather>;
    for (const item of favouriteItems) {
        const itemWeather = await getCurrentWeather(item.lat, item.lon);
        favouritedWeatherData.push(itemWeather);
    }

    return favouritedWeatherData;
}

export function WeatherCards({favourites, toggleView, toggleFavourites}: {favourites: Array<Number>, toggleView: React.MouseEventHandler, toggleFavourites: React.MouseEventHandler}) {
    const [weatherData, setWeatherData] = useState(new Array<CurrentWeather>);


    if (weatherData.length != favourites.length) {
        fetchFavouritedWeatherData()
        .then((result) => {
            result != null && setWeatherData(result);
        })
    }
    
    const favouriteWeatherItems = weatherData.map((item) => {
        return (
            <WeatherCard key={item.id} open={false} weatherData={item} toggleView={toggleView} toggleFavourites={toggleFavourites} favouritedItems={favourites}>
            </WeatherCard>
        )
    })

    return (
        <>
            {favouriteWeatherItems}
        </>
    )
}


export default function WeatherCard({open, weatherData, toggleView, toggleFavourites, favouritedItems}: {open: Boolean, weatherData: CurrentWeather, toggleView: React.MouseEventHandler, toggleFavourites: React.MouseEventHandler, favouritedItems: Array<Number>}) {
    const [isOpen, setIsOpen] = useState(open);

    /**
     * Toggle Card Click handler which updates the isOpen state of the card
     */
    function toggleCard() {
        setIsOpen(!isOpen);
    }

    const description = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;
    
    const currentDate = weatherData.date || new Date();
    const rain = weatherData?.rain != null ? weatherData?.rain["1h"] : 0;
    const snow = weatherData?.snow != null ? weatherData?.snow["1h"] : 0;
    const windDirection = fetchWindDirection(weatherData.wind.deg);
    const visibility = weatherData.visibility/1000;
    const isFavourited = favouritedItems.indexOf(weatherData.id) != -1 ? true : false;

    return(
        <div className='weather-card' data-id={weatherData.id} data-location={weatherData.name} data-lat={weatherData.coord?.lat} data-lon={weatherData.coord?.lon} data-favourited={isFavourited}>
            <div className="card-header">
                { isOpen == true ? (
                    <span className="card-header-info">
                        <p>{currentDate.toDateString()}, {currentDate.getHours()}:{currentDate.getMinutes()}</p>
                        <h3>{weatherData.name}</h3>
                        <p>Feels Like {Math.round(weatherData.main.feels_like)}°C, {description}</p>
                    </span>
                ) : (
                    <span className="card-header-info" data-is-open="false">
                        <h3>{weatherData.name}</h3>
                        <span>
                            <img src={`http://openweathermap.org/img/wn/${iconCode}.png`}></img>
                            <p>{Math.round(weatherData.main.temp)}°C</p>
                        </span>
                    </span>
                ) }
                <span className="card-header-buttons">
                    <button className="icon-btn" onClick={toggleCard}><FaChevronDown /></button>
                    <button className="icon-btn heart" onClick={toggleFavourites}><FaHeart /></button>
                </span>
            </div>
            { isOpen == true ? (
                <div className="card-body">
                <div className="card-body-highlight">
                    <img src={`http://openweathermap.org/img/wn/${iconCode}.png`}></img>
                    <p>{Math.round(weatherData.main.temp)}°C</p>
                </div>
                <div className="card-body-info">
                    {rain !== 0 ? (
                        <span className="card-body-info-panel">
                            <p>Expected amount of rain</p>
                            <h4>{rain}mm/h</h4>
                            <FaCloudRain />
                        </span>
                    ) : null}
                    {snow !== 0 ? (
                        <span className="card-body-info-panel">
                            <p>Expected amount of snow</p>
                            <h4>{snow}mm/h</h4>
                            <FaRegSnowflake />
                        </span>
                    ) : null}
                    <span className="card-body-info-panel">
                        <p>Wind speed & direction</p>
                        <h4>{weatherData.wind.speed}m/s {windDirection}</h4>
                        <FaWind />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Pressure</p>
                        <h4>{weatherData.main.pressure}hPa</h4>
                        <FaGaugeHigh />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Humidity</p>
                        <h4>{weatherData.main.humidity}%</h4>
                        <FaDroplet />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Visibility</p>
                        <h4>{visibility}km</h4>
                        <FaEye />
                    </span>
                </div>
            </div>
            ) : null}
            { isOpen == true ? (
                <div className="card-footer"><button onClick={toggleView}>5 Day Forecast</button></div>
            ) : null }
        </div>
    )
}