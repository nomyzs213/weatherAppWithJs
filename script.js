const apiKey = CONFIG.API_KEY;

navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const fetchURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(fetchURL)
        .then(result => result.json())
        .then(data => {
            if (String(data.cod) !== "200") {
                throw new Error(data.message || "Nieznany błąd API pogodowego.");
            }
            loadWeather(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert(`Nie można pobrać danych pogodowych: ${error.message}`);
        });
}, (error) => {
    console.error("Geolocation error:", error);
    alert("Brak dostępu do lokalizacji. Zezwól na geolokalizację w przeglądarce.");
});

const loadWeather = (data) => {
    const weather = data;
    console.log(weather);
    setInterval( () => {
        const currTime = new Date().toLocaleTimeString('pl-PL');
        document.getElementById("current-time").textContent = currTime;
    } , 1000);
    const sunrise = new Date(weather.sys.sunrise *1000).toLocaleTimeString('pl-PL');
    const sunset = new Date(weather.sys.sunset *1000).toLocaleTimeString('pl-PL');
    const humidity = weather.main.humidity;
    const temp = weather.main.temp;
    const windSpeed = weather.wind.speed
    const cloudness = weather.clouds.all;
    const icon = weather.weather[0].icon;
    const iconPath = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    const location = weather.name?? "Nieznana lokalizacja";
 
    
    const weatherStats = {
        "weather-location": location,
        "temperature": temp.toFixed(1) + "°C",
        cloudness: cloudness + "%",
        humidity: humidity + "%",
        "wind-speed": windSpeed + " m/s",
        "sunrise-time": sunrise,
        "sunset-time": sunset,
    }
    
    for(const [k , v] of Object.entries(weatherStats)){
        const el = document.getElementById(k);
        if(!el){
            console.warn(`Element o id ${k} nie został znaleziony w DOM.`);
            continue;
        }
        el.textContent = v;
    }

    document.getElementById("weather-icon").src = iconPath;
    
}