import { useState } from "react";

import WeatherCard from "./components/weather_card";
import { CurrentWeather} from "./types/weatherTypes";

export default function app(weather: CurrentWeather) {
    const currentDate = new Date();
    const headerInfo = {date: currentDate, ...weather};
    return (
        <WeatherCard {...headerInfo} />
    );
}