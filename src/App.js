import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import moment from "moment";
const { DateTime } = require("luxon");

function App() {

  var date = Date();

  const api = {
    key: "c689226726c66056c7e27a6cf24a57ff",
    base: "http://api.openweathermap.org/data/2.5/"
  }
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [pollution, setPollution] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const startDateTimestamp = startDate / 1000 | 0;
  const endDateTimestamp = endDate / 1000 | 0;

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
        });
    }
  }

  const getCurrentPollution = async () => {
    fetch(`${api.base}air_pollution?lat=${weather.coord.lat}&lon=${weather.coord.lon}&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setPollution(result);
      });
  }

  const getDateRangePollution = async () => {
    fetch(`${api.base}air_pollution/history?lat=${weather.coord.lat}&lon=${weather.coord.lon}&start=${startDateTimestamp}&end=${endDateTimestamp}&APPID=${api.key}`)
      .then(res => res.json())
      .then(resultRange => {
        setPollution(resultRange);
      });

    pollution.list.forEach(element => {
      date = new Date(element.dt * 1000);
      var formattedDate = date;
      Object.assign(element, { date: formattedDate });
    });

    console.log(pollution);
  }

  const data = pollution;

  const formatXAxis = tickItem => {
        return moment(tickItem).format('DD/MM/YY HH:mm');
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
        <div>
          <LineChart
            width={600}
            height={300}
            data={data.list}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="components.co" stroke="#8884d8" />
            <XAxis
              dataKey="dt"
              tickFormatter={formatXAxis}
              domain={['dataMin', 'dataMax']}
              type="number"
            />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
        <div className="pollution-data">
          <button onClick={getCurrentPollution}>Get Current pollution</button>
        </div>
        <div className="date-time-picker-start">
          Start Date
          <DatePicker
            onChange={setStartDate}
            value={startDate}
            name={"Start Date"}
            calendarType={'ISO 8601'}
          />
        </div>
        <div className="date-time-picker-end">
          End Date
          <DatePicker
            onChange={setEndDate}
            value={endDate}
            name={"End Date"}
          />
        </div>
        <div className="pollution-data">
          <button onClick={getDateRangePollution}>Get pollution in date range</button>
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
            <div className="pollution-current-box">
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
