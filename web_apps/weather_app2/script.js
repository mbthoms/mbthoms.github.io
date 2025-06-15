const tomorrowApiKey = '0RYFOTedMjha6KZ4dr49yAvhky9UzlHg';

const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const spinner = document.getElementById('loadingSpinner');
const weatherResult = document.getElementById('weatherResult');
const forecastContainer = document.getElementById('forecastContainer');
const forecastSection = document.getElementById('forecastSection');

getWeatherBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') getWeather();
});

async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('City not found. Please check the name and try again.');
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { lat: latitude, lon: longitude, name, country };
}

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    alert('Please enter a city name.');
    resetUI();
    return;
  }

  spinner.style.display = 'block';
  cityInput.disabled = true;
  getWeatherBtn.disabled = true;
  resetUI();

  try {
    const { lat, lon, name, country } = await getCoordinates(city);

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
        'weatherCodeMin'
      ].join(',')
    });

    const forecastUrl = `https://api.tomorrow.io/v4/weather/forecast?${params.toString()}`;

    const forecastResponse = await fetch(forecastUrl, {
      headers: { apikey: tomorrowApiKey }
    });

    const forecastData = await forecastResponse.json();

    if (forecastData.error) throw new Error(forecastData.error.message);

    const days = forecastData.timelines?.daily ?? [];
    if (!days.length) throw new Error('No forecast data available.');

    updateCurrentWeather(days[0], name, country);
    updateForecast(days);

    forecastSection.style.display = 'block';
  } catch (err) {
    console.error(err);
    weatherResult.innerHTML = `<p class="text-danger">${err.message}</p>`;
    forecastSection.style.display = 'none';
  } finally {
    spinner.style.display = 'none';
    cityInput.disabled = false;
    getWeatherBtn.disabled = false;
    cityInput.focus();
  }
}

function resetUI() {
  weatherResult.innerHTML = '';
  forecastContainer.innerHTML = '';
  forecastSection.style.display = 'none';
}

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

function updateCurrentWeather(day, city, country) {
  const temp = Math.round(day.values.temperatureAvg ?? 0);
  const humidity = Math.round(day.values.humidityAvg ?? 0);
  const code = day.values.weatherCodeMax ?? 1000;
  const iconUrl = getTomorrowIoIconUrl(code);
  const description = getWeatherDescription(code);

  weatherResult.innerHTML = `
    <h2>${city}, ${country}</h2>
    <div class="my-2">
      <img src="${iconUrl}" alt="${description}" width="64" height="64" class="weather-icon" />
    </div>
    <h3>${temp}°C</h3>
    <p>Humidity: ${humidity}%</p>
    <p>${description}</p>
  `;
}

function updateForecast(days) {
  forecastContainer.innerHTML = '';

  const prefersDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

  days.slice(1).forEach(day => {
    const date = new Date(day.time).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const max = Math.round(day.values.temperatureMax ?? 0);
    const min = Math.round(day.values.temperatureMin ?? 0);
    const code = day.values.weatherCodeMax ?? 1000;
    const iconUrl = getTomorrowIoIconUrl(code);
    const description = getWeatherDescription(code);

    const div = document.createElement('div');
    div.className = 'forecast-card';

    if (!prefersDarkMode) {
      div.classList.add('bg-white', 'text-dark', 'shadow-sm');
    }

    div.innerHTML = `
      <div><strong>${date}</strong></div>
      <img src="${iconUrl}" alt="${description}" class="weather-icon" />
      <div style="font-size: 0.85rem;">${description}</div>
      <div>${min}° / ${max}°C</div>
    `;

    forecastContainer.appendChild(div);
  });
}