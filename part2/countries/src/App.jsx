import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = ({ filter, change }) => {
  return (
    <div>
      find countries <input value={filter} onChange={change}/>
    </div>
  )
}

const Countries = ({ countries, showCountry, weather }) => {
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (countries.length > 1 && countries.length <= 10) {
    return countries.map(c =>
      <div key={c.name.common}>{c.name.common} <button onClick={() => showCountry(c.name.common)}>Show</button></div>
    )
  }

  // we should have only one country here
  return (
    <div>
      <Country 
        name={countries[0].name.common}
        capital={countries[0].capital[0]}
        area={countries[0].area}
        languages={countries[0].languages}
        flag={countries[0].flags.png}
        weather={weather}
      />
    </div>
  )
}

const Country = ({ name, capital, area, languages, flag, weather }) => {
  return (
    <div>
      <h1>{name}</h1>
      <div>Capital {capital}</div>
      <div>Area {area}</div>
      <h2>Languages</h2>
      <div>
        <ul>
          {Object.entries(languages).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
        </div>
      <div><img src={flag} alt={`Flag of ${name}`} title={`Flag of ${name}`} /></div>

      {weather && (
      <div>
        <h2>Weather in {capital}</h2>
        <div>Temperature {weather.main.temp} Fahrenheit</div>
        <div>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            title={weather.weather[0].description}
          />
        </div>
        <div>Wind {weather.wind.speed} mph</div>
      </div>
      )}
    </div>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')
  const [weather, setWeather] = useState(null)

  // countries API call
  useEffect(() => {
    countryService
      .getAll()
      .then(allCountries => {
        setCountries(allCountries)
      })
    }, [])
  
  const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(countryFilter.toLowerCase()))

  // weather API call
  useEffect(() => {
    const filtered = countries.filter(c => c.name.common.toLowerCase().includes(countryFilter.toLowerCase()))
    if (filtered.length === 1) {
      weatherService
        .getWeather(filtered[0].latlng[0], filtered[0].latlng[1])
        .then(weatherData => {
          setWeather(weatherData)
        })
    } else {
      setWeather(null)
    }
  }, [countryFilter, countries])

  const handleCountryFilterChange = (event) => setCountryFilter(event.target.value)
  const showCountry = (country) => setCountryFilter(country)

  return (
    <div>
      <Filter filter={countryFilter} change={handleCountryFilterChange} />
      {countries.length > 0 && <Countries countries={filteredCountries} showCountry={showCountry} weather={weather} />}
    </div>
  )
}

export default App