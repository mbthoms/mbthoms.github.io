// Your Tomorrow.io API key used to authenticate requests to their weather service
const tomorrowApiKey = '0RYFOTedMjha6KZ4dr49yAvhky9UzlHg';

// Add event listener to the "Search" button to trigger the weather fetch
document.getElementById('getWeatherBtn').addEventListener('click', getWeather);

// Allow pressing Enter in the input field to trigger the weather fetch
document.getElementById('cityInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') getWeather();
});

// Function to fetch geographic coordinates (latitude and longitude) based on city name
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('City not found');
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { lat: latitude, lon: longitude, name, country };
}

// Main function that runs when the user searches for a city
async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();

  if (!city) {
    alert('Please enter a city name.');
    document.getElementById('weatherResult').innerHTML = '';
    document.getElementById('forecastContainer').innerHTML = '';
    document.getElementById('forecastSection').style.display = 'none';
    return;
  }

  try {
    const { lat, lon, name, country } = await getCoordinates(city);

    const forecastUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&timesteps=1d&units=metric&fields=temperatureMax,temperatureMin,temperatureAvg,humidityAvg,weatherCodeMax,weatherCodeMin`;

    const forecastResponse = await fetch(forecastUrl, {
      headers: { apikey: tomorrowApiKey }
    });

    const forecastData = await forecastResponse.json();

    if (forecastData.error) throw new Error(forecastData.error.message);

    console.log(JSON.stringify(forecastData, null, 2));

    updateCurrentWeather(forecastData.timelines.daily[0], name, country);
    updateForecast(forecastData.timelines.daily);

    document.getElementById('forecastSection').style.display = 'block';

  } catch (err) {
    console.error(err);
    document.getElementById('weatherResult').innerHTML = `<p class="text-danger">${err.message}</p>`;
    document.getElementById('forecastContainer').innerHTML = '';
    document.getElementById('forecastSection').style.display = 'none';
  }
}

// Map Tomorrow.io weather codes to local SVG icon paths
function getTomorrowIoIconUrl(code) {
  switch (code) {
    case 1000: return 'icons/clear_day.svg';                   // Clear
    case 1001: return 'icons/cloudy.svg';                      // Cloudy
    case 1100: return 'icons/mostly_clear_day.svg';            // Mostly Clear
    case 1101: return 'icons/partly_cloudy_day.svg';           // Partly Cloudy
    case 1102: return 'icons/mostly_cloudy.svg';               // Mostly Cloudy
    case 2000: return 'icons/fog.svg';                         // Fog
    case 2100: return 'icons/fog_light.svg';                   // Light Fog
    case 4000: return 'icons/drizzle.svg';                     // Drizzle
    case 4001: return 'icons/rain.svg';                        // Rain
    case 4200: return 'icons/rain_light.svg';                  // Light Rain
    case 4201: return 'icons/rain_heavy.svg';                  // Heavy Rain
    case 5000: return 'icons/snow.svg';                        // Snow
    case 5001: return 'icons/flurries.svg';                    // Flurries
    case 5100: return 'icons/snow_light.svg';                  // Light Snow
    case 5101: return 'icons/snow_heavy.svg';                  // Heavy Snow
    case 6000: return 'icons/freezing_drizzle.svg';            // Freezing Drizzle
    case 6001: return 'icons/freezing_rain.svg';               // Freezing Rain
    case 6200: return 'icons/freezing_rain_light.svg';         // Light Freezing Rain
    case 6201: return 'icons/freezing_rain_heavy.svg';         // Heavy Freezing Rain
    case 7000: return 'icons/ice_pellets.svg';                 // Ice Pellets
    case 7101: return 'icons/ice_pellets_heavy.svg';           // Heavy Ice Pellets
    case 7102: return 'icons/ice_pellets_light.svg';           // Light Ice Pellets
    case 8000: return 'icons/tstorm.svg';                      // Thunderstorm
    default: return 'icons/cloudy.svg';                        // Fallback
  }
}



// Function to update the UI with current weather data
function updateCurrentWeather(day, city, country) {
  const temp = Math.round(day.values.temperatureAvg);
  const humidity = Math.round(day.values.humidityAvg);

  const code = day.values.weatherCodeMax ?? 1000;
  const iconUrl = getTomorrowIoIconUrl(code);

  document.getElementById('weatherResult').innerHTML = `
    <h2>${city}, ${country}</h2>
    <div style="margin: 10px 0;">
      <img src="${iconUrl}" alt="Weather icon" style="width:64px; height:64px;" />
    </div>
    <h3>${temp}°C</h3>
    <p>Humidity: ${humidity}%</p>
  `;

  if (temp < 10) {
    document.body.style.background = 'linear-gradient(to right, #007cf0, #00dfd8)';
  } else if (temp >= 10 && temp <= 20) {
    document.body.style.background = 'linear-gradient(to right, #00c851, #33b5e5)';
  } else if (temp > 20 && temp <= 30) {
    document.body.style.background = 'linear-gradient(to right, #ffbb33, #ff4444)';
  } else {
    document.body.style.background = 'linear-gradient(to right, #d50000, #ff6f00)';
  }
}

// Function to update the 7-day weather forecast UI
function updateForecast(days) {
  const forecastContainer = document.getElementById('forecastContainer');
  forecastContainer.innerHTML = '';

  days.forEach(day => {
    const date = new Date(day.time).toLocaleDateString(undefined, { weekday: 'short' });
    const max = Math.round(day.values.temperatureMax);
    const min = Math.round(day.values.temperatureMin);

    const code = day.values.weatherCodeMax ?? 1000;
    const iconUrl = getTomorrowIoIconUrl(code);

    const div = document.createElement('div');
    div.className = 'p-2 text-center border rounded bg-light';
    div.style.width = '100px';
    div.innerHTML = `
      <div>${date}</div>
      <div><img src="${iconUrl}" alt="Forecast icon" style="width:32px; height:32px;" /></div>
      <div>${min}° / ${max}°C</div>
    `;

    forecastContainer.appendChild(div);
  });
}
