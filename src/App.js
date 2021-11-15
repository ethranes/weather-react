import React, {useState} from 'react';
import * as d3 from 'd3';

function App() {

  const api = {
    key: "c689226726c66056c7e27a6cf24a57ff",
    base: "http://api.openweathermap.org/data/2.5/"
  }

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [pollution, setPollution] = useState({});
  
  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        });
    }
  }
  
  const getPollution = async() =>{
    fetch(`${api.base}air_pollution?lat=${weather.coord.lat}&lon=${weather.coord.lon}&APPID=${api.key}`)
    .then(res => res.json())
    .then(result => {
      setPollution(result);
      console.log(result);
    });
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        <div className="pollution-data">
          <button onClick = {getPollution}>Get pollution</button>
        </div>
        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="location">{weather.coord.lat}, {weather.coord.lon}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        </div>
        ) : ('')}
        {(typeof pollution.list != "undefined") ? (
        <div>
          <div className="pollution-box">
            <div className="pollutionCO">CO: {pollution.list[0].components.co}</div>
            <div className="pollutionNH3">NH3: {pollution.list[0].components.nh3}</div>
            <div className="pollutionNO">NO: {pollution.list[0].components.no}</div>
            <div className="pollutionNO2">NO2: {pollution.list[0].components.no2}</div>
            <div className="pollutionO3">O3: {pollution.list[0].components.o3}</div>
            <div className="pollutionPM2_5">PM2_5: {pollution.list[0].components.pm2_5}</div>
            <div className="pollutionPM10">PM10: {pollution.list[0].components.pm10}</div>
            <div className="pollutionSO2">SO2: {pollution.list[0].components.so2}</div>
          </div>
        </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
