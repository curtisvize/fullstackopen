import axios from 'axios'

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (lat, lon) => {
    const request = axios.get(`${baseUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    return request.then(response => response.data)
}

export default { getWeather }