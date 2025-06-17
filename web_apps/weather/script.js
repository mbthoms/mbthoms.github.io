// Your Tomorrow.io API key
const tomorrowApiKey = '0RYFOTedMjha6KZ4dr49yAvhky9UzlHg';

// Get DOM elements for interaction
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const spinner = document.getElementById('loadingSpinner');
const weatherResult = document.getElementById('weatherResult');
const forecastContainer = document.getElementById('forecastContainer');
const forecastSection = document.getElementById('forecastSection');

// Event listener: Trigger weather fetch on button click
getWeatherBtn.addEventListener('click', getWeather);

// Allow user to press Enter to trigger weather fetch
cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') getWeather();
});

// Fetch geographic coordinates for a given city name
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();

  // Handle case where no city is found
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found. Please check the name and try again.');
  }

  // Extract and return lat/lon and location details
  const { latitude, longitude, name, country } = data.results[0];
  return { lat: latitude, lon: longitude, name, country };
}

// Main weather fetching function
async function getWeather() {
  const city = cityInput.value.trim();

  // Validate input
  if (!city) {
    alert('Please enter a city name.');
    resetUI();
    return;
  }

  // Show spinner and disable UI while loading
  spinner.style.display = 'block';
  cityInput.disabled = true;
  getWeatherBtn.disabled = true;
  resetUI();

  try {
    // Get city coordinates
    const { lat, lon, name, country } = await getCoordinates(city);

    // Set query parameters for the weather API
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

    // Fetch forecast from Tomorrow.io
    const forecastUrl = `https://api.tomorrow.io/v4/weather/forecast?${params.toString()}`;
    const forecastResponse = await fetch(forecastUrl, {
      headers: { apikey: tomorrowApiKey }
    });

    const forecastData = await forecastResponse.json();

    // Handle error from API
    if (forecastData.error) throw new Error(forecastData.error.message);

    const days = forecastData.timelines?.daily ?? [];
    if (!days.length) throw new Error('No forecast data available.');

    // Update UI with weather data
    updateCurrentWeather(days[0], name, country);
    updateForecast(days);

    forecastSection.style.display = 'block';

  } catch (err) {
    // Handle any errors
    console.error(err);
    weatherResult.innerHTML = `<p class="text-danger">${err.message}</p>`;
    forecastSection.style.display = 'none';
  } finally {
    // Re-enable UI
    spinner.style.display = 'none';
    cityInput.disabled = false;
    getWeatherBtn.disabled = false;
    cityInput.focus();
  }
}

// Reset UI elements (clear results)
function resetUI() {
  weatherResult.innerHTML = '';
  forecastContainer.innerHTML = '';
  forecastSection.style.display = 'none';
}

// Map weather code to icon file name
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

// Map weather code to description text
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

// Display current weather info on the page
function updateCurrentWeather(day, city, country) {
  const temp = Math.round(day.values.temperatureAvg ?? 0);
  const humidity = Math.round(day.values.humidityAvg ?? 0);
  const wind = Math.round(day.values.windSpeedAvg ?? 0);
  const precipitation = Math.round(day.values.precipitationSum ?? 0);
  const code = day.values.weatherCodeMax ?? 1000;
  const iconUrl = getTomorrowIoIconUrl(code);
  const description = getWeatherDescription(code);

  // Inject weather data into HTML
  weatherResult.innerHTML = `
    <h2>${city}, ${country}</h2>
    <div class="my-2">
      <img src="${iconUrl}" alt="${description}" width="64" height="64" class="weather-icon" />
    </div>
    <h3>${temp}<sup>°C</sup></h3>
    <p>${description}</p>
    <p><i class="fa-solid fa-droplet"></i> Humidity: ${humidity}%</p>
    <p><i class="fa-solid fa-wind"></i> Wind: ${wind} km/h</p>
    <p><i class="fa-solid fa-cloud-rain"></i> Precipitation: ${precipitation} mm</p>
  `;
}

// Display 7-day forecast cards
function updateForecast(days) {
  forecastContainer.innerHTML = '';

  const prefersDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

  // Loop through forecast days (skip today)
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

    // Create a forecast card
    const div = document.createElement('div');
    div.className = 'forecast-card glass-card p-3 text-white text-center';

    // Ensure white text even in light mode
    if (!prefersDarkMode) {
      div.classList.remove('text-dark');
    }

    // Populate forecast card with weather data
    div.innerHTML = `
      <div class="fw-bold mb-2">${date}</div>
      <img src="${iconUrl}" alt="${description}" class="weather-icon mb-2" />
      <div class="small mb-2">${description}</div>
      <div>Low: ${min}°</div>
      <div>High: ${max}°</div>
      <div><i class="fa-solid fa-droplet"></i> ${humidity}%</div>
      <div><i class="fa-solid fa-wind"></i> ${wind} km/h</div>
      <div><i class="fa-solid fa-cloud-rain"></i> ${precipitation} mm</div>
    `;

    forecastContainer.appendChild(div);
  });
}