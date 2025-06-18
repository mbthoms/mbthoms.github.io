// Your Tomorrow.io API key
const tomorrowApiKey = '0RYFOTedMjha6KZ4dr49yAvhky9UzlHg';

// DOM elements
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const spinner = document.getElementById('loadingSpinner');
const weatherResult = document.getElementById('weatherResult');
const forecastContainer = document.getElementById('forecastContainer');
const forecastSection = document.getElementById('forecastSection');
const hourlySection = document.getElementById('hourlySection');
const mainRow = document.getElementById('mainRow');
const rightColumn = document.getElementById('rightColumn');

let firstSearch = true;

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

  // on first search, switch layout
  if (firstSearch) {
    mainRow.classList.remove('justify-content-center');
    rightColumn.style.display = '';
    firstSearch = false;
  }

  spinner.style.display = 'block';
  cityInput.disabled = true;
  getWeatherBtn.disabled = true;
  resetUI();

  try {
    const { lat, lon, name, country } = await getCoordinates(city);

    // daily forecast via Timelines endpoint
    const timelineBody = {
      location: { lat, lon },
      fields: ['temperatureMax','temperatureMin','temperatureAvg','humidityAvg','weatherCodeMax','weatherCodeMin','windSpeedAvg','precipitationSum'],
      timesteps: ['1d'],
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      units: 'metric'
    };
    const timelineResponse = await fetch('https://api.tomorrow.io/v4/timelines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: tomorrowApiKey
      },
      body: JSON.stringify(timelineBody)
    });
    const timelineData = await timelineResponse.json();
    if (timelineData.errors) throw new Error(timelineData.errors.map(e=>e.message).join(', '));
    let days = (timelineData.data?.timelines?.find(t=>t.timestep==='1d')?.intervals ?? []).map(i => ({
      time: i.startTime,
      values: i.values
    }));
    if (!days.length) {
      console.warn('Timeline response empty, falling back to Forecast endpoint');
      // Fallback to Forecast endpoint
      const fallbackParams = new URLSearchParams({
        location: `${lat},${lon}`,
        timesteps: '1d',
        units: 'metric',
        fields: ['temperatureMax','temperatureMin','temperatureAvg','humidityAvg','weatherCodeMax','weatherCodeMin','windSpeedAvg','precipitationSum'].join(',')
      });
      const forecastUrl = `https://api.tomorrow.io/v4/weather/forecast?${fallbackParams.toString()}`;
      const forecastResponse = await fetch(forecastUrl, { headers: { apikey: tomorrowApiKey } });
      const forecastData = await forecastResponse.json();
      const forecastDays = forecastData.timelines?.daily ?? [];
      if (!forecastDays.length) {
        throw new Error('No forecast data available.');
      }
      // Map forecastDays to expected format
      days = forecastDays.map(d => ({
        time: d.time,
        values: d.values
      }));
    }

    updateCurrentWeather(days[0], name, country);
    updateForecast(days);

    // hourly forecast
    const hourlyParams = new URLSearchParams({
      location: `${lat},${lon}`,
      timesteps: '1h',
      units: 'metric',
      fields: ['temperature','weatherCode'].join(','),
      startTime: new Date().toISOString()
    });
    const hourlyUrl = `https://api.tomorrow.io/v4/weather/forecast?${hourlyParams.toString()}`;
    const hourlyResponse = await fetch(hourlyUrl, { headers: { apikey: tomorrowApiKey } });
    const hourlyData = await hourlyResponse.json();
    const hours = hourlyData.timelines?.hourly ?? [];
    updateHourlyForecast(hours);

    forecastSection.style.display = '';
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

  // Store current temp globally for later use in the pill
  window.currentTempC = temp;

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

  // Loop through the next 7 forecast days (including today)
  days.slice(0, 7).forEach((day, idx) => {
    const date = new Date(day.time).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const max = Math.round(day.values.temperatureMax ?? 0);
    const min = Math.round(day.values.temperatureMin ?? 0);
    // const avg = Math.round(day.values.temperatureAvg ?? (min + max) / 2); // Removed as per instructions
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

    if (typeof TemperaturePill !== 'undefined') {
      TemperaturePill.render(div, {
        minTemp: min,
        maxTemp: max,
        currentTemp: window.currentTempC ?? (min + max) / 2,
        width: '100%',
        height: 8,
        dotSize: 12,
        showDot: idx === 0
      });
    }
  });
}

function updateHourlyForecast(hours) {
  const container = document.getElementById('hourlyContainer');
  const section = document.getElementById('hourlySection');

  if (!hours.length) {
    section.style.display = 'none';
    return;
  }

  container.innerHTML = '';
  section.style.display = 'block';

  hours.slice(0, 12).forEach(hour => {
    const time = new Date(hour.time).toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const temp = Math.round(hour.values.temperature ?? 0);
    const code = hour.values.weatherCode ?? 1000;
    const iconUrl = getTomorrowIoIconUrl(code);
    const description = getWeatherDescription(code);

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