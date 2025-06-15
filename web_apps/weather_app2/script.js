// Your API key for accessing Tomorrow.io weather data
const tomorrowApiKey = '0RYFOTedMjha6KZ4dr49yAvhky9UzlHg';

// DOM element references
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const spinner = document.getElementById('loadingSpinner');
const weatherResult = document.getElementById('weatherResult');
const forecastContainer = document.getElementById('forecastContainer');
const forecastSection = document.getElementById('forecastSection');

// Event listener for button click to fetch weather
getWeatherBtn.addEventListener('click', getWeather);

// Allow pressing "Enter" in input field to trigger weather fetch
cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') getWeather();
});

// Fetch geographical coordinates for a given city using Open-Meteo's geocoding API
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();

  // Handle case where city is not found
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found. Please check the name and try again.');
  }

  // Return latitude, longitude, and display name of the location
  const { latitude, longitude, name, country } = data.results[0];
  return { lat: latitude, lon: longitude, name, country };
}

// Main function to fetch and display weather information
async function getWeather() {
  const city = cityInput.value.trim();

  // Validate input
  if (!city) {
    alert('Please enter a city name.');
    resetUI();
    return;
  }

  // Show loading spinner and disable inputs
  spinner.style.display = 'block';
  cityInput.disabled = true;
  getWeatherBtn.disabled = true;
  resetUI();

  try {
    // Get location coordinates
    const { lat, lon, name, country } = await getCoordinates(city);

    // Prepare query parameters for Tomorrow.io API
    const params = new URLSearchParams({
      location: `${lat},${lon}`,
      timesteps: '1d',
      units: 'metric',
      fields: [
        'temperatureMax',
        'temperatureMin',
        'temperatureAvg',
        'humidityAvg',
        'weatherCodeMax',
        'weatherCodeMin',
        'windSpeedAvg',
        'precipitationSum'
      ].join(',')
    });

    // Fetch forecast data
    const forecastUrl = `https://api.tomorrow.io/v4/weather/forecast?${params.toString()}`;
    const forecastResponse = await fetch(forecastUrl, {
      headers: { apikey: tomorrowApiKey }
    });

    const forecastData = await forecastResponse.json();

    // Handle API error response
    if (forecastData.error) throw new Error(forecastData.error.message);

    const days = forecastData.timelines?.daily ?? [];
    if (!days.length) throw new Error('No forecast data available.');

    // Display current weather and forecast
    updateCurrentWeather(days[0], name, country);
    updateForecast(days);
    forecastSection.style.display = 'block';

  } catch (err) {
    // Handle errors and display message to user
    console.error(err);
    weatherResult.innerHTML = `<p class="text-danger">${err.message}</p>`;
    forecastSection.style.display = 'none';

  } finally {
    // Reset UI state
    spinner.style.display = 'none';
    cityInput.disabled = false;
    getWeatherBtn.disabled = false;
    cityInput.focus();
  }
}

// Clears weather and forecast output from the page
function resetUI() {
  weatherResult.innerHTML = '';
  forecastContainer.innerHTML = '';
  forecastSection.style.display = 'none';
}

// Maps Tomorrow.io weather code to icon filenames
function getTomorrowIoIconUrl(code) {
  const iconMap = {
    1000: 'clear_day',
    1001: 'cloudy',
    1100: 'mostly_clear_day',
    1101: 'partly_cloudy_day',
    1102: 'mostly_cloudy',
    2000: 'fog',
    2100: 'fog_light',
    4000: 'drizzle',
    4001: 'rain',
    4200: 'rain_light',
    4201: 'rain_heavy',
    5000: 'snow',
    5001: 'flurries',
    5100: 'snow_light',
    5101: 'snow_heavy',
    6000: 'freezing_drizzle',
    6001: 'freezing_rain',
    6200: 'freezing_rain_light',
    6201: 'freezing_rain_heavy',
    7000: 'ice_pellets',
    7101: 'ice_pellets_heavy',
    7102: 'ice_pellets_light',
    8000: 'tstorm'
  };
  const filename = iconMap[code] || 'cloudy';
  return `icons/${filename}.svg`;
}

// Maps Tomorrow.io weather code to human-readable description
function getWeatherDescription(code) {
  const descriptions = {
    1000: "Clear",
    1001: "Cloudy",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
  };
  return descriptions[code] || "Unknown";
}

// Updates the UI with current weather details
function updateCurrentWeather(day, city, country) {
  const temp = Math.round(day.values.temperatureAvg ?? 0);
  const humidity = Math.round(day.values.humidityAvg ?? 0);
  const wind = Math.round(day.values.windSpeedAvg ?? 0);
  const precipitation = Math.round(day.values.precipitationSum ?? 0);
  const code = day.values.weatherCodeMax ?? 1000;
  const iconUrl = getTomorrowIoIconUrl(code);
  const description = getWeatherDescription(code);

  // Inject weather data into the DOM
  weatherResult.innerHTML = `
    <h2>${city}, ${country}</h2>
    <div class="my-2">
      <img src="${iconUrl}" alt="${description}" width="64" height="64" class="weather-icon" />
    </div>
    <h3>${temp}°C</h3>
    <p>${description}</p>
    <p><i class="fa-solid fa-droplet"></i> Humidity: ${humidity}%</p>
    <p><i class="fa-solid fa-wind"></i> Wind: ${wind} km/h</p>
    <p><i class="fa-solid fa-cloud-rain"></i> Precipitation: ${precipitation} mm</p>
  `;
}

// Populates the 7-day forecast UI cards
function updateForecast(days) {
  forecastContainer.innerHTML = '';

  // Check if user's system prefers dark mode
  const prefersDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

  // Skip the first day (already displayed) and iterate over remaining days
  days.slice(1).forEach(day => {
    const date = new Date(day.time).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const max = Math.round(day.values.temperatureMax ?? 0);
    const min = Math.round(day.values.temperatureMin ?? 0);
    const humidity = Math.round(day.values.humidityAvg ?? 0);
    const wind = Math.round(day.values.windSpeedAvg ?? 0);
    const precipitation = Math.round(day.values.precipitationSum ?? 0);
    const code = day.values.weatherCodeMax ?? 1000;
    const iconUrl = getTomorrowIoIconUrl(code);
    const description = getWeatherDescription(code);

    // Create forecast card element
    const div = document.createElement('div');
    div.className = 'forecast-card';

    // Add light mode styles if applicable
    if (!prefersDarkMode) {
      div.classList.add('bg-white', 'text-dark', 'shadow-sm');
    }

    // Inject forecast data into card
    div.innerHTML = `
      <div><strong>${date}</strong></div>
      <img src="${iconUrl}" alt="${description}" class="weather-icon" />
      <div style="font-size: 0.85rem;">${description}</div>
      <div>L:${min}<sup>°</sup></div>
      <div>H:${max}<sup>°</sup></div>
      <div><i class="fa-solid fa-droplet"></i>   ${humidity}%</div>
      <div><i class="fa-solid fa-wind"></i>    ${wind} km/h</div>
      <div><i class="fa-solid fa-cloud-rain"></i>    ${precipitation} mm</div>
    `;

    forecastContainer.appendChild(div);
  });
}