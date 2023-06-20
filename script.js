feather.replace();

const searchParam = new URLSearchParams(location.search)
let KEY = searchParam.get(`key`) || localStorage.getItem(`key`) 
let NINJAAPIKEY = searchParam.get(`ninjakey`) || localStorage.getItem(`ninjakey`)
while (!KEY) {
  KEY = prompt(`Enter API KEY`)
}
while (!NINJAAPIKEY) {
  NINJAAPIKEY = prompt(`Enter NINJA API KEY`)
}
console.log(KEY)
console.log(NINJAAPIKEY)

const q = searchParam.get(`geo`) ?? `13.761661,100.56969`

const UVWORD = (UVINDEX) => {
  if (UVINDEX < 3) {
    return `Low`
  } else if (UVINDEX < 6) {
    return `Moderate`
  } else if (UVINDEX < 8) {
    return `High`
  } else if (UVINDEX < 11) {
    return `Very High`
  } else {
    return `Extreme`
  }
}

const fetchData = () => {
  const m = moment();
  
  document.querySelector(`.date-dayname`).innerText = m.format(`dddd`);
  document.querySelector(`.date-day`).innerText = m.format(`DD MMM YYYY`);
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/current.json",
    params: {
      q,
    },
    headers: {
      "X-RapidAPI-Key": KEY,
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };
  console.log(options)
  axios
  .request(options)
  .then((res) => res.data)
  .then((data) => {
    console.log(data.location);
    console.log(data.location.name);
    axios.get(`https://api.api-ninjas.com/v1/weather?city=${data.location.name}`,{
      headers: { 'X-Api-Key': NINJAAPIKEY},
      contentType: 'application/json',
    })
    .then(res => res.data)
    .then(weatherData => {
      console.log(weatherData)
      document.querySelector(`.sunrise-value`).innerText = new Date(weatherData.sunrise*1000).toLocaleTimeString()
      document.querySelector(`.sunset-value`).innerText = new Date(weatherData.sunset*1000).toLocaleTimeString()
    })
    axios.get(`https://api.api-ninjas.com/v1/airquality?city=${data.location.name}`,{
      headers: { 'X-Api-Key': NINJAAPIKEY},
      contentType: 'application/json',
    })
    .then(res => res.data)
    .then(AQdata => {
        console.log(AQdata)
        document.querySelector(`.PM2_5-value`).innerText = `${AQdata[`PM2.5`].aqi}` 
        document.querySelector(`.PM10-value`).innerText = `${AQdata[`PM10`].aqi}` 
        document.querySelector(`.SO2-value`).innerText = `${AQdata[`SO2`].aqi}` 
        document.querySelector(`.CO-value`).innerText = `${AQdata[`CO`].aqi}` 
        document.querySelector(`.NO2-value`).innerText = `${AQdata[`NO2`].aqi}` 
        document.querySelector(`.O3-value`).innerText = `${AQdata[`O3`].aqi}` 
    })
    .catch(err => {
      console.log(err)
    })
    console.log(data.current)
    document.querySelector(`.location`).innerText = `${data.location.name}, ${data.location.country}` 
    document.querySelector(`.localtime`).innerText = `${data.location.localtime}` 
    document.querySelector(`.weather-temp`).innerText = `${data.current.temp_c}°C` 
    // document.querySelector(`.weather-tempF`).innerText = `${data.current.temp_f}°F` 
    document.querySelector(`.weather-img-icon`).src = `${data.current.condition.icon}` 
    document.querySelector(`.weather-desc`).innerText = `${data.current.condition.text}` 
    document.querySelector(`.cloud-value`).innerText = `${data.current.cloud} %` 
    document.querySelector(`.humidity-value`).innerText = `${data.current.humidity} %` 
    document.querySelector(`.wind-value`).innerText = `${data.current.wind_kph} km/h` 
    document.querySelector(`.wind-direction-value`).innerText = `${data.current.wind_dir}` 
    // document.querySelector(`.moonsun-value`).innerText = `${data.current.is_day ? `☀️` : `🌙`}` 
    // document.querySelector(`.uv-value`).innerText = `${data.current.uv} (${UVWORD(data.current.uv)})` 
    document.querySelector(`.vis-value`).innerText = `${data.current.vis_km} km` 
  })
  .catch(err => {
    console.log(err)
  })

}
fetchData()
document.querySelector(`.location-button`).addEventListener(`click`,fetchData)