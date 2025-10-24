import { useEffect, useState } from "react";
import weatherService from "../services/weatherService";

const Weather = ({ city }) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        weatherService.current({ city }).then((weather) => setWeather(weather));
    }, [city]);

    if (!weather) {
        return <></>;
    }

    return (
        <div>
            <h2>Weather in {city}</h2>
            <p>
                <strong>Temperature: </strong>
                {weather.current.temp_c}&deg;C
            </p>

            <img
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
                title={weather.current.condition.text}
            />

            <p>
                <strong>Wind: </strong>
                {(weather.current.wind_kph / 3.6).toFixed(1)} m/s
            </p>
        </div>
    );
};

export default Weather;
