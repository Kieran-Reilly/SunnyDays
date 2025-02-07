// import WeatherCard from "./components/weather_card";
// import { CurrentWeather} from "./types/weatherTypes";

// export default function app(weather: CurrentWeather) {
//     const currentDate = new Date();
//     const headerInfo = {date: currentDate, ...weather};
//     return (
//         <WeatherCard {...headerInfo} />
//     );
// }

import FiveDayForecast from "./components/five_day_forecast";
import { Forecast } from "./types/weatherTypes";

export default function app(weather: Forecast) {
    const currentDate = new Date();
    const forecastInfo = {date: currentDate, ...weather};
    return (
        <FiveDayForecast forecastInfo={forecastInfo} />
    );
}



//TODO have a state which controls which component's 5 day forecast view gets shown
