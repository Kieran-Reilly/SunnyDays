// import { FaGithub, FaLinkedin  } from "react-icons/fa6";
// import WeatherCard from "./components/weather_card";
// import { CurrentWeather} from "./types/weatherTypes";

// export default function app(weather: CurrentWeather) {
//     const currentDate = new Date();
//     const headerInfo = {date: currentDate, ...weather};
//     return (
//         <>
//             <div className="app-header">
//                 Some Logo
//             </div>
//             <WeatherCard {...headerInfo} />
//             <div className="app-footer">
//                 <p>Developed by Kieran Reilly</p>
//                 <button className="icon-btn"><FaGithub /></button>
//                 <button className="icon-btn"><FaLinkedin /></button>
//             </div>
//         </>
//     );
// }

import { FaGithub, FaLinkedin  } from "react-icons/fa6";
import FiveDayForecast from "./components/five_day_forecast";
import { Forecast } from "./types/weatherTypes";

export default function app(weather: Forecast) {
    const currentDate = new Date();
    const forecastInfo = {date: currentDate, ...weather};
    return (
        <>
            <div className="app-header">
                Some Logo
            </div>
            <FiveDayForecast forecastInfo={forecastInfo} />
            <div className="app-footer">
                <p>Developed by Kieran Reilly</p>
                <button className="icon-btn"><FaGithub /></button>
                <button className="icon-btn"><FaLinkedin /></button>
            </div>
        </>
    );
}



//TODO have a state which controls which component's 5 day forecast view gets shown
