import { FaChevronDown, FaHeart, FaCloudRain, FaWind, FaGaugeHigh, FaDroplet, FaRegSun, FaTemperatureLow, FaEye } from "react-icons/fa6";

interface weatherCardHeaderInfo {
    date: Date, 
    location: string, 
    feelsLike: string, 
    description: string,
    tempreture: string
}

export default function WeatherCard({date, location, feelsLike, description, tempreture}: weatherCardHeaderInfo) {
    //TODO: bring in API to begin configuring how the component will interact with the data
    let forecastBtnText = "5 Day Forecast";

    const expectedRain = "0.16mm (26%)";
    const windSpeed = "100m/s";
    const windDirection = "W";
    const pressure = "1003hPa";
    const humidity = "74%";
    const uv = 1;
    const dewPoint = "3°C";
    const visibility = "10.0km";

    return(
        <>
            <div className="card-header">
                <span className="card-header-info">
                    <p>{date.toDateString()}, {date.getHours()}:{date.getMinutes()}</p>
                    <h3>{location}</h3>
                    <p>Feels Like {feelsLike}, {description}</p>
                </span>
                <span className="card-header-buttons">
                    <button><FaChevronDown /></button>
                    <button><FaHeart /></button>
                </span>
            </div>
            <div className="card-body">
                <div className="card-body-highlight">
                    <span>weather icon</span>
                    <p>{tempreture}</p>
                </div>
                <div className="card-body-info">
                    <span className="card-body-info-panel">
                        <p>Expected amount of rain</p>
                        <h4>{expectedRain}</h4>
                        <FaCloudRain />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Wind speed & direction</p>
                        <h4>{windSpeed}{windDirection}</h4>
                        <FaWind />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Pressure</p>
                        <h4>{pressure}</h4>
                        <FaGaugeHigh />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Humidity</p>
                        <h4>{humidity}</h4>
                        <FaDroplet />
                    </span>
                    <span className="card-body-info-panel">
                        <p>UV</p>
                        <h4>{uv}</h4>
                        <FaRegSun />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Dew point</p>
                        <h4>{dewPoint}</h4>
                        <FaTemperatureLow />
                    </span>
                    <span className="card-body-info-panel">
                        <p>Visibility</p>
                        <h4>{visibility}</h4>
                        <FaEye />
                    </span>
                </div>
            </div>
            {/* <div className="card-body"><button>{forecastBtnText}</button></div> */}
        </>
    )
}