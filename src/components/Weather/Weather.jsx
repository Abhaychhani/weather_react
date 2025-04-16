import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { FaTemperatureHigh } from "react-icons/fa6";
import { GiSunrise } from "react-icons/gi";
import { GiSunset } from "react-icons/gi";

import "./weather.css";
import clear from "../../../public/clear.png";
function Weather() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  async function fetchWeather(loc) {
    setLoading(true);
    const url = `https://open-weather13.p.rapidapi.com/city/${loc}/EN&units=metric`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "a35153764bmsh77a746ba7aa80c8p10234djsn2a1669cade94",
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (result.cod !== 200) {
        setError(result.message);
        setLoading(false);
        return;
      }
      let sunrise = convertTime(result.sys.sunrise);
      let sunset = convertTime(result.sys.sunset);
      setData({
        icon: result.weather[0].icon,
        main: result.weather[0].main,
        humidity: result.main.humidity,
        wind: result.wind.speed,
        country: result.sys.country,
        temp: result.main.temp,
        sunrise: sunrise,
        sunset: sunset,
        loc: result.name,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.error(error);
    }
  }

  function convertTime(time) {
    const converted = new Date(time * 1000)
      .toLocaleString()
      .split(" ")[1]
      .split(":");
    return `${converted[0]}:${converted[1]}`;
  }

  function handleKeyPress(e) {
    setData({});
    setError(null);
    if (e.key === "Enter" && !loading) {
      fetchWeather(location);
    }
  }

  if (loading) {
    return (
      <>
        <div className="container">
          <h1 style={{ color: "white" }}>loading...</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        {data && (
          <>
            <p className="location">
              <SlLocationPin size={22} color="white" />
              <span>
                {data.loc || "Location"} {data?.country}
              </span>
            </p>
            <div className="search-container">
              <input
                type="text"
                placeholder="Enter Location/City Name"
                className="search-input"
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  handleKeyPress(e);
                }}
              />
              <BsSearch
                className="search-icon"
                onClick={() => {
                  if (!location) return;
                  setData({});
                  setError(null);
                  fetchWeather(location);
                }}
              />
            </div>
            <div className="main-info">
              <div>
                <h3>{data.main || "clear"}</h3>
                <span>
                  <FaTemperatureHigh color="white" size={18} />
                  {data.temp || "0°"}
                </span>
              </div>
              <img
                src={
                  data.icon
                    ? `http://openweathermap.org/img/w/${data.icon}.png`
                    : clear
                }
                alt="weather-icon"
                className="weather-icon"
              />
            </div>

            <div className="weather-details">
              <div className="row">
                <div className="card" title="Sunrise">
                  <p>
                    <GiSunrise size={18} />
                    <span>{data.sunrise || "00:00"}</span>
                  </p>
                </div>
                <div className="card" title="Sunset">
                  <p>
                    <GiSunset size={18} />
                    <span>{data.sunset || "00:00"}</span>
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="humidity card">
                  <h2>Humidity</h2>
                  <p>
                    <WiHumidity size={18} />
                    <span>{data.humidity}%</span>
                  </p>
                </div>
                <div className="wind card">
                  <h2>Wind</h2>
                  <p>
                    <FaWind size={18} />
                    <span>{data.wind} m/s</span>
                  </p>
                </div>
              </div>
            </div>
            {error ? (
              <div
                style={{
                  marginTop: "1rem",
                  position: "relative",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <h2
                  style={{
                    color: "#f00",
                    textShadow: "2px 2px 3px #222",
                    textTransform: "capitalize",
                    fontFamily: "cursive",
                  }}
                >
                  {error}
                </h2>
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}

export default Weather;
