feather.replace();

const searchParam = new URLSearchParams(location.search)
let KEY = localStorage.getItem(`key`) ?? searchParam.get(`key`)
if (!KEY) {
  KEY = prompt(`Enter API KEY`)
}
console.log(KEY)
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
    document.querySelector(`.moonsun-value`).innerText = `${data.current.is_day ? `☀️` : `🌙`}` 
    document.querySelector(`.uv-value`).innerText = `${data.current.uv} (${UVWORD(data.current.uv)})` 
    document.querySelector(`.vis-value`).innerText = `${data.current.vis_km} km` 
  })
  .catch(err => {
    console.log(err)
  })

}
fetchData()
document.querySelector(`.location-button`).addEventListener(`click`,fetchData)