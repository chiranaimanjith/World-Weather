const apiKey = '924e4fc92e9b4002ac0152359243008'; 
const form = document.getElementById('weatherForm');
const weatherDataDiv = document.getElementById('weatherData');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const location = document.getElementById('locationInput').value;
    fetchWeather(location);
});

async function fetchWeather(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert('Unable to retrieve weather data. Please try again.');
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
    description.textContent = `Condition: ${data.current.condition.text}`;
    humidity.textContent = `Humidity: ${data.current.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} kph`;

    weatherDataDiv.style.display = 'block';
}
