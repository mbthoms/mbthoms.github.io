var api = "https://fcc-weather-api.glitch.me/api/current?";
var lat, lon;
var tempUnit = 'C';
var currentTempInCelsius;

$( document ).ready(function(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = "lat=" + position.coords.latitude;
      var lon = "lon=" + position.coords.longitude;
      getWeather(lat, lon);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  $("#tempunit").click(function () {
    var currentTempUnit = $("#tempunit").text();
    var newTempUnit = currentTempUnit == "C" ? "F" : "C";
    $("#tempunit").text(newTempUnit);
    if (newTempUnit == "F") {
      var fahTemp = Math.round(parseInt($("#temp").text()) * 9 / 5 + 32);
      $("#temp").text(fahTemp + " " + String.fromCharCode(176));
    } else {
      $("#temp").text(currentTempInCelsius + " " + String.fromCharCode(176));
    }
  });
  
})

function getWeather(lat, lon) {
  var urlString = api + lat + "&" + lon;
  $.ajax({
    url: urlString, success: function (result) {
      $("#city").text(result.name + ", ");
      $("#country").text(result.sys.country);
      currentTempInCelsius = Math.round(result.main.temp * 10) / 10;
      $("#temp").text(currentTempInCelsius + " " + String.fromCharCode(176));
      $("#tempunit").text(tempUnit);
      $("#desc").text(result.weather[0].main);
      IconGen(result.weather[0].main);
    }
  });
}

function IconGen(desc) {
  var desc = desc.toLowerCase()
  switch (desc) {
    case 'drizzle':
      addIcon(desc)
      document.body.style.backgroundImage = "url('img/rain.jpg')";
      break;
    case 'clouds':
      addIcon(desc)
      document.body.style.backgroundImage = "url('img/cloudy.jpg')";
      break;
    case 'rain':
      addIcon(desc)
      document.body.style.backgroundImage = "url('img/rain.jpg')";
      break;
    case 'snow':
      addIcon(desc)
      document.body.style.backgroundImage = "url('img/snow.jpg')";
      break;
    case 'clear':
      addIcon(desc)
      document.body.style.backgroundImage = "url('img/clear.jpg')";
      break;
    case 'thunderstom':
      addIcon(desc)
      document.body.style.backgroundImage = "url('img/thunder.jpg')";
      break;
    default:
      $('div.clouds').removeClass('hide');
  }
}

function addIcon(desc) {
  $('div.' + desc).removeClass('hide');
}

