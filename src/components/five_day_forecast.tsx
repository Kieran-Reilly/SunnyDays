import { FaChevronDown, FaHeart, FaCloudRain, FaWind, FaGaugeHigh, FaDroplet, FaEye, FaRegSnowflake } from "react-icons/fa6";
import { Forecast, ForecastData, getNextDay, getDayOfWeek, getMonth } from "../types/weatherTypes";
import { useState } from "react";


function ForecastCard({ forecastData }: { forecastData: ForecastData[] }) {
    function toggleCard(event: React.MouseEvent) {
        console.log("toggling tab", event);
    }

    const forecastDataItems = forecastData.map(item => {
        const date = new Date(item.dt * 1000); 
        const weatherInfo = item.weather[0];

        const dayOfTheWeek = getDayOfWeek(date.getDay());
        const month = getMonth(date.getMonth());

        return (
            <div key={item.dt} className="forecast-tab">
                <div className="forecast-tab-header">
                    <p className="forecast-tab-header-date">{dayOfTheWeek}, {month} {date.getDate()}</p>
                    <span className="forecast-tab-header-temps">
                        <img src={`http://openweathermap.org/img/wn/${weatherInfo.icon}.png`}></img>
                        <p>{Math.round(item.main.temp_max)} / {Math.round(item.main.temp_min)}°C</p>
                    </span>
                    <span className="forcast-tab-header-main">
                        <p>{item.weather[0].main}</p>
                        <button className="icon-btn"><FaChevronDown onClick={toggleCard}/></button>
                    </span>
                </div>
                <div className="forecast-tab-body">

                </div>
            </div>
        )
    });

    return (
        <>
            {forecastDataItems}
        </>
    )
}

export default function FiveDayForecast({ forecastInfo }: { forecastInfo: Forecast }) {
    /**
     * Add To Favourites Click handler which will add/remove this location from favourites
     */
    function addToFavourites(event: React.MouseEvent) {
        //TODO hook up favourites
        console.log("added to favourites", event);
    }

    const forecastData = buildForecastData(forecastInfo);
    

    return(
        <>
            <div className="forecast-header">
                <span className="forecast-header-info">
                    <h1>{forecastInfo.city.name}</h1>
                    <button className="icon-btn"><FaHeart onClick={addToFavourites}/></button>
                </span>
                <h4>5-Day Forecast</h4>
            </div>
            <ForecastCard forecastData={forecastData} />
        </>
    )
}

/**
 * Builds up data for a 5-day forecast which will be used to populate the individual forecast-content
 * @param forecastInfo {Forecast} - an instance of the Forecast interface containing forecast data
 * @return forecastData {ForecastData[]} - an array of ForecastData instances, 1 for each day for the next 5 days after the current day 
 */
function buildForecastData(forecastInfo: Forecast) {
    const forecastData = [];
    
    //get tomorrow at 12
    const currentDate = new Date();
    currentDate.setUTCHours(12,0,0,0);
    let nextDay = getNextDay(currentDate);

    for (const item of forecastInfo.list) {
        const itemDate = new Date(item.dt * 1000);

        if (itemDate.getTime() == nextDay.getTime()) {
            //add this item to forecastData
            forecastData.push(item);
            nextDay = getNextDay(nextDay);
        }

        if (forecastInfo.list.indexOf(item) === forecastInfo.list.length - 1 && forecastData.length == 4) {
            //add last data point
            forecastData.push(item);
        }
    }

    return forecastData;
}

// const [isOpen, setIsOpen] = useState(true);

// /**
//  * Toggle Card Click handler which updates the isOpen state of the card
//  */
// function toggleCard() {
//     setIsOpen(!isOpen);
// }

// return (
//     <div className="card-header">
//         { isOpen == true ? (
//             <span className="card-header-info">
//                 <p>{currentDate.toDateString()}, {currentDate.getHours()}:{currentDate.getMinutes()}</p>
//                 <h3>{headerInfo.name}</h3>
//                 <p>Feels Like {headerInfo.main.feels_like}°C, {description}</p>
//             </span>
//         ) : (
//             <span className="card-header-info" data-is-open="false">
//                 <h3>{headerInfo.name}</h3>
//                 <span>
//                     <img src={`http://openweathermap.org/img/wn/${iconCode}.png`}></img>
//                     <p>{headerInfo.main.temp}°C</p>
//                 </span>
//             </span>
//         ) }
//         <span className="card-header-buttons">
//             <button className="icon-btn"><FaChevronDown onClick={toggleCard}/></button>
//             <button className="icon-btn"><FaHeart onClick={addToFavourites}/></button>
//         </span>
//     </div>
// )