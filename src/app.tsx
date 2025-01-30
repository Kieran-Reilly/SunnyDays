import { useState } from "react";

import WeatherCard from "./components/weather_card";

export default function app() {
    return (
        <WeatherCard date={new Date()} location="Krung Thep Maha Nakhon" feelsLike="30°C" description="light rain" tempreture="28°C"/>
    );
}