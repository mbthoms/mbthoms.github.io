// script.js

// Placeholder for your real API key (don't need it while using fake data)
const apiKey = 'b646630091961a6ec9773844104b1cd5'; 

// Main function that runs when the user clicks "Get Weather"
async function getWeather() {
  // Get the city from the input box
  const city = document.getElementById('cityInput').value.trim();

  // If user types "test", use fake data to simulate a real API call
  if (city.toLowerCase() === "test") {
    const fakeData = {
      name: "New York",
      main: {
        temp: 22,
        humidity: 60
      },
      weather: [
        { description: "clear sky" }
      ]
    };

    document.getElementById('weatherResult').innerHTML = `
      <h2>${fakeData.name}</h2>
      <p>Temperature: ${fakeData.main.temp}°C</p>
      <p>Weather: ${fakeData.weather[0].description}</p>
      <p>Humidity: ${fakeData.main.humidity}%</p>
    `;

    return;
  }

  // Once your API key is active, this part will work for real city names
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  console.log("City:", city);
  console.log("Encoded URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("API response:", data);

    if (data.cod === 200) {
      document.getElementById('weatherResult').innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
    } else {
      document.getElementById('weatherResult').innerHTML = `<p>${data.message}</p>`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById('weatherResult').innerHTML = `<p>Error fetching data</p>`;
  }
}
