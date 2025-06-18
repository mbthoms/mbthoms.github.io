// placeholder_script.js
// –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// This script replaces script.js for demo purposes. It uses hardcoded
// placeholder data for "New York" (7-day + 12-hour forecasts) instead of
// calling any external APIs.

// DOM elements
const getWeatherBtn    = document.getElementById('getWeatherBtn');
const cityInput        = document.getElementById('cityInput');
const spinner          = document.getElementById('loadingSpinner');
const weatherResult    = document.getElementById('weatherResult');
const forecastContainer= document.getElementById('forecastContainer');
const forecastSection  = document.getElementById('forecastSection');
const hourlySection    = document.getElementById('hourlySection');
const mainRow          = document.getElementById('mainRow');
const rightColumn      = document.getElementById('rightColumn');

let firstSearch = true;

// Wire up events
getWeatherBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keydown', e => { if (e.key === 'Enter') getWeather(); });

// ─── Placeholder Data Generators ───────────────────────────────────────────────

// Generates 7 days of sample data starting from today
function generatePlaceholderDays() {
  const now = Date.now();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(now + i * 24*60*60*1000);
    const iso  = date.toISOString();
    const min  = 8 + i * 2;          // just ramping up by 2°C/day
    const max  = min + 6;            // a 6°C spread
    return {
      time: iso,
      values: {
        temperatureAvg: Math.round((min + max) / 2),
        humidityAvg:    45 + i * 3,  // 45%, 48%, …
        windSpeedAvg:   10 + i,      // 10 km/h, 11, …
        precipitationSum: i % 3 === 0 ? 0 : 1,
        temperatureMax: max,
        temperatureMin: min,
        weatherCodeMax: [1000,1101,1102,2000,4001,5001,8000][i % 7]
      }
    };
  });
}

// Generates 12 hours of sample data starting from now
function generatePlaceholderHours() {
  const now = Date.now();
  return Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(now + i * 60*60*1000);
    return {
      time: date.toISOString(),
      values: {
        temperature: 14 + i,  // 14°C, 15°C, …
        weatherCode: [1000,1101,2000,4001,4201,5001,6001,4200,2100,8000,1100,1001][i % 12]
      }
    };
  });
}

// ─── Main “getWeather” Handler ────────────────────────────────────────────────

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    alert('Please enter a city name.');
    resetUI();
    return;
  }

  // On first search, reveal right column
  if (firstSearch) {
    mainRow.classList.remove('justify-content-center');
    rightColumn.style.display = '';
    firstSearch = false;
  }

  spinner.style.display       = 'block';
  cityInput.disabled          = true;
  getWeatherBtn.disabled      = true;
  resetUI();

  // Only support New York in this placeholder build
  if (city.toLowerCase() !== 'new york') {
    spinner.style.display  = 'none';
    cityInput.disabled     = false;
    getWeatherBtn.disabled = false;
    weatherResult.innerHTML = `<p class="text-danger">Placeholder only supports New York.</p>`;
    return;
  }

  // Simulate async delay
  setTimeout(() => {
    const name    = 'New York';
    const country = 'USA';
    const days    = generatePlaceholderDays();

    updateCurrentWeather(days[0], name, country);
    updateForecast(days);

    const hours = generatePlaceholderHours();
    updateHourlyForecast(hours);

    forecastSection.style.display = '';
    spinner.style.display         = 'none';
    cityInput.disabled            = false;
    getWeatherBtn.disabled        = false;
    cityInput.focus();
  }, 500);
}

// ─── UI Helper Functions (unchanged from script.js) ────────────────────────────

// Reset UI elements (clear results)
function resetUI() {
  weatherResult.innerHTML    = '';
  forecastContainer.innerHTML= '';
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
  return `icons/${iconMap[code] || 'cloudy'}.svg`;
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
  const temp          = Math.round(day.values.temperatureAvg ?? 0);
  const humidity      = Math.round(day.values.humidityAvg ?? 0);
  const wind          = Math.round(day.values.windSpeedAvg ?? 0);
  const precipitation = Math.round(day.values.precipitationSum ?? 0);

  // Store current temp globally for pill
  window.currentTempC = temp;

  const code        = day.values.weatherCodeMax ?? 1000;
  const iconUrl     = getTomorrowIoIconUrl(code);
  const description = getWeatherDescription(code);

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
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

  days.slice(0, 7).forEach((day, idx) => {
    const date = new Date(day.time).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric'
    });
    const max = Math.round(day.values.temperatureMax ?? 0);
    const min = Math.round(day.values.temperatureMin ?? 0);
    const humidity = Math.round(day.values.humidityAvg ?? 0);
    const wind     = Math.round(day.values.windSpeedAvg ?? 0);
    const precipitation = Math.round(day.values.precipitationSum ?? 0);
    const code = day.values.weatherCodeMax ?? 1000;
    const iconUrl     = getTomorrowIoIconUrl(code);
    const description = getWeatherDescription(code);

    const div = document.createElement('div');
    div.className = 'forecast-card glass-card p-3 text-white text-center';
    if (!prefersDark) div.classList.remove('text-dark');
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

    // Render the pill
    if (typeof TemperaturePill !== 'undefined') {
      TemperaturePill.render(div, {
        minTemp: min,
        maxTemp: max,
        currentTemp: window.currentTempC ?? (min + max)/2,
        width: '100%',
        height: 8,
        dotSize: 12,
        showDot: idx === 0
      });
    }
  });
}

// Display 12-hour forecast cards
function updateHourlyForecast(hours) {
  const container = document.getElementById('hourlyContainer');
  const section   = document.getElementById('hourlySection');
  if (!hours.length) {
    section.style.display = 'none';
    return;
  }
  container.innerHTML = '';
  section.style.display = 'block';

  hours.slice(0, 12).forEach(hour => {
    const time         = new Date(hour.time).toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const temp         = Math.round(hour.values.temperature ?? 0);
    const code         = hour.values.weatherCode ?? 1000;
    const iconUrl      = getTomorrowIoIconUrl(code);
    const description  = getWeatherDescription(code);

    const div = document.createElement('div');
    div.className = 'forecast-card text-white text-center p-2 flex-shrink-0';
    div.style.minWidth = '90px';
    div.innerHTML = `
      <div>${time}</div>
      <img src="${iconUrl}" alt="${description}" class="weather-icon mb-1" />
      <div class="small">${temp}°C</div>
    `;
    container.appendChild(div);
  });
}
