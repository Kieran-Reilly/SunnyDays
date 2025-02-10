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
            <div key={item.dt} className="forecast-tab" data-index={forecastData.indexOf(item)} >
                <div className="forecast-tab-header">
                    <p className="forecast-tab-header-date">{dayOfTheWeek}, {month} {date.getDate()}</p>
                    <span className="forecast-tab-header-temps">
                        <img src={`http://openweathermap.org/img/wn/${weatherInfo.icon}.png`}></img>
                        { item.main.max_day_temp != null && item.main.min_day_temp != null ? (
                            <p>{Math.round(item.main.max_day_temp)} / {Math.round(item.main.min_day_temp)}°C</p>
                        ) : null}
                    </span>
                    <span className="forcast-tab-header-main">
                        <p>{item.weather[0].main}</p>
                        <button className="icon-btn"><FaChevronDown onClick={toggleCard}/></button>
                    </span>
                </div>
                <div className="forecast-tab-body">
                    {forecastData.indexOf(item)}
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

    function returnToCurrentForecasts(event: React.MouseEvent) {
         //TODO hook up return button
         console.log("Returning to current forecasts", event);
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
            <div className="forecast-tabs">
                <ForecastCard forecastData={forecastData} />
            </div>
            <button onClick={returnToCurrentForecasts}>Return</button>
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
            //find highest and lowest temps for the day
            let lowestTemp = item.main.temp_min;
            let highestTemp = item.main.temp_max;
            for (const listItem of forecastInfo.list) {
                const listItemDate = new Date(listItem.dt * 1000);
                if (listItemDate.getDate() != itemDate.getDate()) {
                    continue;
                }

                if (listItem.main.temp_min < lowestTemp) {
                    lowestTemp = listItem.main.temp_min;
                };

                if (listItem.main.temp_max > highestTemp) {
                    highestTemp = listItem.main.temp_max;
                }
            }
            
            item.main.max_day_temp = highestTemp;
            item.main.min_day_temp = lowestTemp;

            //add this item to forecastData
            forecastData.push(item);
            nextDay = getNextDay(nextDay);
            continue;
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