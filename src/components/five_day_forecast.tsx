import { FaChevronDown, FaChevronUp, FaHeart, FaCloudRain, FaWind, FaGaugeHigh, FaDroplet, FaEye, FaRegSnowflake } from "react-icons/fa6";
import { Forecast, ForecastData,  } from "../types/weatherTypes";
import { useState } from "react";
import { fetchWindDirection, getDayOfWeek, getMonth, getNextDay } from "../types/weatherUtils";

function ForecastCardBody({item, date, dayOfTheWeek, month, weatherInfoIcon, toggleTabs}: {item: ForecastData, date: Date, dayOfTheWeek: string, month: string, weatherInfoIcon: string, toggleTabs: React.MouseEventHandler}) {
    const rain = item?.rain != null ? item?.rain["3h"] : 0;
    const snow = item?.snow != null ? item?.snow["3h"] : 0;
    const windDirection = fetchWindDirection(item.wind.deg);
    const visibility = item.visibility/1000;
    
    return (
        <>
            <div className="forecast-body-header">
                <h3>{dayOfTheWeek}, {month} {date.getDate()}</h3>
                <button className="icon-btn" onClick={toggleTabs}><FaChevronUp /></button>
            </div>
            <div className="forecast-body-main">
                <img src={`http://openweathermap.org/img/wn/${weatherInfoIcon}.png`}></img>
                { item.main.max_day_temp != null && item.main.min_day_temp != null ? (
                    <p>High of {Math.round(item.main.max_day_temp)}°C, Low of {Math.round(item.main.min_day_temp)}°C</p>
                ) : null}
            </div>
            <div className="forecast-body-details">
                {rain !== 0 ? (
                    <span className="forecast-body-line">
                        <FaCloudRain />
                        <h4>Expected amount of rain: </h4>
                        <p>{rain}mm/h</p>
                    </span>
                ) : null}
                {snow !== 0 ? (
                    <span className="forecast-body-line">
                        <FaRegSnowflake />
                        <h4>Expected amount of snow: </h4>
                        <p>{snow}mm/h</p>
                    </span>
                ) : null}
                <span className="forecast-body-line">
                    <FaWind />
                    <h4>Wind speed & direction: </h4>
                    <p>{item.wind.speed}m/s {windDirection}</p>
                </span>
                <span className="forecast-body-line">
                    <FaGaugeHigh />
                    <h4>Pressure: </h4>
                    <p>{item.main.pressure}hPa</p>
                </span>
                <span className="forecast-body-line">
                    <FaDroplet />
                    <h4>Humidity: </h4>
                    <p>{item.main.humidity}%</p>
                </span>
                <span className="forecast-body-line">
                    <FaEye />
                    <h4>Visibility: </h4>
                    <p>{visibility}km</p>
                </span>
            </div>
        </>
    )
}


function ForecastCard({ forecastData, toggleTabs, activeTab}: { forecastData: ForecastData[], toggleTabs: React.MouseEventHandler, activeTab: Number }) {
    const forecastDataItems = forecastData.map(item => {
        const date = new Date(item.dt * 1000); 
        const weatherInfo = item.weather[0];

        const dayOfTheWeek = getDayOfWeek(date.getDay());
        const month = getMonth(date.getMonth());
        const tabIndex = forecastData.indexOf(item);

        return (
            <div key={item.dt} className="forecast-tab" data-index={tabIndex} data-active={activeTab === tabIndex ? true : undefined} >
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
                        <button className="icon-btn"  onClick={toggleTabs}><FaChevronDown /></button>
                    </span>
                </div>
                <div className="forecast-tab-body">
                    <ForecastCardBody item={item} date={date} dayOfTheWeek={dayOfTheWeek} month={month} weatherInfoIcon={weatherInfo.icon} toggleTabs={toggleTabs}></ForecastCardBody>
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

export default function FiveDayForecast({ forecastInfo, toggleView, toggleFavourites, favouritedItems}: { forecastInfo: Forecast, toggleView: React.MouseEventHandler, toggleFavourites: React.MouseEventHandler, favouritedItems: Array<Number>}) {
    const [activeTab, setActiveTab] = useState(-1);

    function toggleTabs(event: React.MouseEvent) {
        const target = event.target as HTMLElement;
        const selectedTab = target.parentElement?.parentElement?.parentElement;
        const selectedTabIndex = Number(selectedTab!.dataset.index);

        if (selectedTabIndex != activeTab) {
            setActiveTab(selectedTabIndex);
            return;
        }

        setActiveTab(-1);
    }

    const forecastData = buildForecastData(forecastInfo);
    const favourited = favouritedItems.indexOf(forecastInfo.city.id) != -1 ? true : false;
    
    return(
        <div className="forecast-info"  data-id={forecastInfo.city.id} data-location={forecastInfo.city.name} data-lat={forecastInfo.city.coord?.lat} data-lon={forecastInfo.city.coord?.lon} data-favourited={favourited}>
            <div className="forecast-header">
                <span className="forecast-header-info">
                    <h1>{forecastInfo.city.name}</h1>
                    <button className="icon-btn heart" onClick={toggleFavourites}><FaHeart /></button>
                </span>
                <h4>5-Day Forecast</h4>
            </div>
            <div className="forecast-tabs">
                <ForecastCard forecastData={forecastData} toggleTabs={toggleTabs} activeTab={activeTab}/>
            </div>
            <div className="forecast-footer">
                <button onClick={toggleView}>Return</button>
            </div>
        </div>
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
        //find highest and lowest temps for the day
        setMinMaxTemps(item, itemDate, forecastInfo);

        if (itemDate.getTime() == nextDay.getTime()) {
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

/**
 * Given a specific ForecastData item, finds the min and max temps for dates within the data for that particular day
 * @param item {ForecastData} - a ForecastData item containing weather information for a particular day within a 5-day forecast
 * @param itemDate {Date} - the date of a particular forecast data item
 * @param forecastInfo {Forecast} - forecast information made up of ForecastData items for a 5-day forecast
 */
function setMinMaxTemps(item: ForecastData, itemDate: Date, forecastInfo: Forecast) {
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
}