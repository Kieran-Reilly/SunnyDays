import { FaChevronDown, FaHeart, FaCloudRain, FaWind, FaGaugeHigh, FaDroplet, FaEye, FaRegSnowflake } from "react-icons/fa6";
import { CurrentWeather, windDirections} from "../types/weatherTypes";
import { useState } from "react";


function fetchWindDirection(degrees: number) {
    const index = Math.round(degrees/11.25);
    return windDirections[index];
}

export default function WeatherCard(headerInfo: CurrentWeather) {
    const [isOpen, setIsOpen] = useState(true);

    /**
     * Toggle Card Click handler which updates the isOpen state of the card
     */
    function toggleCard() {
        setIsOpen(!isOpen);
    }

    /**
     * Add To Favourites Click handler which will add/remove this location from favourites
     */
    function addToFavourites(event: React.MouseEvent) {
        console.log("added to favourites", event);
    }

    /**
     * Show five day forecast button handler which will launch the fiveDayForecast component for the specific location
     */
    function showFiveDayForecast(event: React.MouseEvent) {
        console.log("showing five day forecast", event);
    }

    const main = headerInfo.weather[0].main;
    const description = headerInfo.weather[0].description;
    const iconCode = headerInfo.weather[0].icon;
    
    const currentDate = headerInfo.date || new Date();
    const rain = headerInfo?.rain != null ? headerInfo?.rain["1h"] : 0;
    const snow = headerInfo?.snow != null ? headerInfo?.snow["1h"] : 0;
    const windDirection = fetchWindDirection(headerInfo.wind.deg);
    const visibility = headerInfo.visibility/1000;

    return(
        <>
            <div className="card-header">
                { isOpen == true ? (
                    <span className="card-header-info">
                        <p>{currentDate.toDateString()}, {currentDate.getHours()}:{currentDate.getMinutes()}</p>
                        <h3>{headerInfo.name}</h3>
                        <p>Feels Like {headerInfo.main.feels_like}°C, {description}</p>
                    </span>
                ) : (
                    <span className="card-header-info" data-is-open="false">
                        <h3>{headerInfo.name}</h3>
                        <span>
                            <img src={`http://openweathermap.org/img/wn/${iconCode}.png`}></img>
                            <p>{headerInfo.main.temp}°C</p>
                        </span>
                    </span>
                ) }
                <span className="card-header-buttons">
                    <button><FaChevronDown onClick={toggleCard}/></button>
                    <button><FaHeart onClick={addToFavourites}/></button>
                </span>
            </div>
            { isOpen == true ? (
                <div className="card-body">
                <div className="card-body-highlight">
                    <img src={`http://openweathermap.org/img/wn/${iconCode}.png`}></img>
                    <p>{headerInfo.main.temp}°C</p>
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
                        <h4>{headerInfo.wind.speed}m/s {windDirection}</h4>
                        <FaWind />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Pressure</p>
                        <h4>{headerInfo.main.pressure}hPa</h4>
                        <FaGaugeHigh />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Humidity</p>
                        <h4>{headerInfo.main.humidity}%</h4>
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
                <div className="card-body"><button onClick={showFiveDayForecast}>5 Day Forecast</button></div>
            ) : null }
        </>
    )
}