import { FaChevronDown, FaHeart, FaCloudRain, FaWind, FaGaugeHigh, FaDroplet, FaEye, FaRegSnowflake } from "react-icons/fa6";
import { CurrentWeather} from "../types/weatherTypes";


/*
    Each direction is 11.25 (360 / 32) degrees farther than the previous. 
    For example, N (north) is 0 degrees, NbE (north by east) is 11.25 degrees, 
    NNE (north-northeast) is 22.5 degrees, etc.

    so given the degrees, simply divide by 11.25 and round to the nearest int to find 
    corresponding direction i.e. 180 / 11.25 = 16 -> windDirections[16] = S
*/
const windDirections = [
    "N",
    "NbE",
    "NNE",
    "NEbN",
    "NE",
    "NEbE",
    "ENE",
    "EbN",
    "E",
    "EbS",
    "ESE",
    "SEbE",
    "SE",
    "SEbS",
    "SSE",
    "SbE",
    "S",
    "SbW",
    "SSW",
    "SWbS",
    "SW",
    "SWbW",
    "WSW",
    "WbS",
    "W",
    "WbN",
    "WNW",
    "NWbW",
    "NW",
    "NWbN",
    "NNW",
    "Nb"
]

function fetchWindDirection(degrees: number) {
    const index = Math.round(degrees/11.25);
    return windDirections[index];
}

export default function WeatherCard(headerInfo: CurrentWeather) {
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
                <span className="card-header-info">
                    <p>{currentDate.toDateString()}, {currentDate.getHours()}:{currentDate.getMinutes()}</p>
                    <h3>{headerInfo.name}</h3>
                    <p>Feels Like {headerInfo.main.feels_like}°C, {description}</p>
                </span>
                <span className="card-header-buttons">
                    <button><FaChevronDown /></button>
                    <button><FaHeart /></button>
                </span>
            </div>
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
            {/* <div className="card-body"><button>{forecastBtnText}</button></div> */}
        </>
    )
}