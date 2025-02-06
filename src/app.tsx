import WeatherCard from "./components/weather_card";
import { CurrentWeather} from "./types/weatherTypes";

export default function app(weather: CurrentWeather) {
    const currentDate = new Date();
    const headerInfo = {date: currentDate, ...weather};
    return (
        <WeatherCard {...headerInfo} />
    );
}

// import FiveDayForecast from "./components/five_day_forecast";
// import { CurrentWeather} from "./types/weatherTypes";

// export default function app(weather: CurrentWeather) {
//     const currentDate = new Date();
//     const headerInfo = {date: currentDate, ...weather};
//     return (
//         <FiveDayForecast {...headerInfo} />
//     );
// }