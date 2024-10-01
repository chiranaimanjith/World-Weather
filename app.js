const API_KEY = '924e4fc92e9b4002ac0152359243008';
        const searchBar = document.getElementById('search-bar');
        const suggestionsContainer = document.getElementById('suggestions');
        const weatherContainer = document.getElementById('weather-container');
        const themeToggle = document.getElementById('theme-toggle');

        let debounceTimer;

        // Automatically track
        window.onload = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeatherByCoords(lat, lon);
                });
            } else {
                fetchWeather('London');
            }
        };

        searchBar.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = searchBar.value;
                if (query.length > 2) {
                    fetchCitySuggestions(query);
                } else {
                    suggestionsContainer.innerHTML = '';
                }
            }, 300);
        });

        themeToggle.addEventListener('click', toggleTheme);

        async function fetchCitySuggestions(query) {
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`);
                const data = await response.json();
                displaySuggestions(data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching city suggestions:', error);
            }
        }

        function displaySuggestions(suggestions) {
            suggestionsContainer.innerHTML = '';
            suggestions.forEach(city => {
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.textContent = `${city.name}, ${city.country}`;
                div.addEventListener('click', () => {
                    searchBar.value = city.name;
                    suggestionsContainer.innerHTML = '';
                    fetchWeather(city.name);
                });
                suggestionsContainer.appendChild(div);
            });
        }

        async function fetchWeather(city) {
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`);
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }

        async function fetchWeatherByCoords(lat, lon) {
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5`);
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                console.error('Error fetching weather data by coordinates:', error);
            }
        }

        function displayWeather(weather) {
            const html = `
                <div class="weather-card">
                    <div class="weather-header">
                        <div>
                            <h2>${weather.location.name}, ${weather.location.country}</h2>
                            <p>${new Date(weather.location.localtime).toLocaleString()}</p>
                        </div>
                        <div>
                            <h1>${weather.current.temp_c}°C</h1>
                            <p>${weather.current.condition.text}</p>
                        </div>
                    </div>
                    <div class="weather-details">
                        <div class="weather-item">
                            <span class="weather-icon">💧</span>
                            <span>Humidity: ${weather.current.humidity}%</span>
                        </div>
                        <div class="weather-item">
                            <span class="weather-icon">💨</span>
                            <span>Wind: ${weather.current.wind_kph} km/h</span>
                        </div>
                        <div class="weather-item">
                            <span class="weather-icon">🌅</span>
                            <span>Sunrise: ${weather.forecast.forecastday[0].astro.sunrise}</span>
                        </div>
                        <div class="weather-item">
                            <span class="weather-icon">🌇</span>
                            <span>Sunset: ${weather.forecast.forecastday[0].astro.sunset}</span>
                        </div>
                    </div>
                </div>
                <div class="weather-card">
                    <h3>5 Day Forecast</h3>
                    <div class="forecast">
                        ${weather.forecast.forecastday.map(day => `
                            <div class="forecast-item">
                                <p>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                                <p>${day.day.avgtemp_c}°C</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            weatherContainer.innerHTML = html;
        }

        function toggleTheme() {
            document.body.classList.toggle('light-theme');
            themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
        }