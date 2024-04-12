import { useEffect, useState } from 'react'
import './App.css'

function App() {
  /*
    * 실시간 날씨 조회 앱 *
    1. 앱이 실행되자마자 현재 위치 기반의 날씨가 보인다.
    2. 날씨 정보에는 도시, 섭씨, 화씨, 날씨상태가 조회된다.
    3. 5개의 버튼이 있다. (1개는 현재 위치, 4개는 다른 도시)
    4. 도시 버튼을 클릭할 때 마다 도시별 날씨가 나온다.
    5. 현재 위치 버튼을 누르면 다시 현재 위치 기반의 날씨가 나온다.
    6. 데이터를 들고 오는 동안 로딩 스피너가 돈다.
  */
  const [weatherInfo, setWeatherInfo] = useState({});
  const [currentInfo, setCurrentInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(showPosition) : null
    
    function showPosition(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apiId = "d090564bf804fbeaa9a1826d250f19ca";
      const cityName = "Current Location";

      weatherApiCall({
        latitude , 
        longitude ,
        apiId ,
        cityName ,
      }, saveCurrentInfo(latitude, longitude));
    }
  }, []);
  
  const handleClickWeather  = (e) => {
    const cityName = e.target.textContent;
    const apiId = "d090564bf804fbeaa9a1826d250f19ca";

    weatherApiCall({
      cityName , 
      apiId ,
    });

  };

  const weatherApiCall = (params) => {
    console.log(params);
    setIsLoading(!isLoading);
    let url = "";
    let latitude = params.latitude ? params.latitude : currentInfo.latitude;
    let longitude = params.longitude ? params.longitude : currentInfo.longitude;

    if(params.cityName === "Current Location"){
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=current&appid=${params.apiId}&lang=kr&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${params.cityName}&appid=${params.apiId}`
    }

    fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
      const city = data.name;
      const celsius = Math.round(data.main.temp);
      const fahrenheit = Math.round(((celsius * 9) / 5 + 32).toFixed(2));
      const weather = data.weather[0].description;
      setIsLoading(!isLoading);

      setWeatherInfo({
        city ,
        celsius ,
        fahrenheit ,
        weather ,
      });
    });
  };

  const saveCurrentInfo = (latitude, longitude) => {
    setCurrentInfo({
      latitude , 
      longitude ,
    });
  };

  return (
    !isLoading ? 
    <>
      <h1 className='title'>Global Current Weather</h1>
      <div className='weather-container'>
        <span>{weatherInfo.city}</span>
        <span>{weatherInfo.celsius} °C</span>
        <span>{weatherInfo.fahrenheit} °F</span>
        <span>{weatherInfo.weather}</span>
      </div>
      <div className='button-cotainer'>
        <button onClick={handleClickWeather}>Current Location</button>
        <button onClick={handleClickWeather}>paris</button>
        <button onClick={handleClickWeather}>new york</button>
        <button onClick={handleClickWeather}>tokyo</button>
        <button onClick={handleClickWeather}>seoul</button>
      </div>
    </>
    : ''
  )
}

export default App
