var apiEndpoint = "https://api.openweathermap.org/data/2.5/forecast";
var apiKey = "22179a2464e0f26983d2332ad50360fd";

// Define variables for the search form and search history
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var searchHistoryEl = document.querySelector("#search-history");

// Get a reference to the HTML elements
var cityNameElements = document.querySelectorAll(".city-name");
var currentWeatherElements = document.querySelectorAll(".current-weather");
var weatherIconElements = document.querySelectorAll(".weather-icon");
var descriptionElements = document.querySelectorAll(".description");
var tempElements = document.querySelectorAll(".temp");
var humidityElements = document.querySelectorAll(".humidity");
var windElements = document.querySelectorAll(".wind");


Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

// Load search history from local storage and render it on page load
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
renderSearchHistory();
function renderSearchHistory() {
  searchHistoryEl.innerHTML = "";
  searchHistory.forEach(function (city) {
    const historyItemEl = document.createElement("button");
    historyItemEl.classList.add("btn", "btn-outline-secondary");
    historyItemEl.textContent = city;
    historyItemEl.addEventListener("click", function () {
      getWeatherData(city);
    });
    searchHistoryEl.prepend(historyItemEl);
  });
}

// Add an event listener to the search form
searchFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = searchInputEl.value.trim();
  if (city) {
    getWeatherData(city);
    searchInputEl.value = "";
  }
});

// Function to get weather data from OpenWeather API
function getWeatherData(city) {
  const apiKey = "22179a2464e0f26983d2332ad50360fd";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&cnt={5}&units=imperial`;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      updateCurrentWeather(data);
      getFiveDayForecast(city);
      saveToSearchHistory(city);
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

// Function to update the current weather section with data from the OpenWeather API
function updateCurrentWeather(weatherData) {
  var cityName = weatherData.name;
  var date = dayjs().format("M/D/YYYY");
  var weatherIconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  var temperature = weatherData.main.temp;
  var humidity = weatherData.main.humidity;
  var windSpeed = weatherData.wind.speed;

  document.querySelector(".city").textContent = cityName;
  document.querySelector("#currentDay").textContent = `(${date})`;
  document.querySelector(".description").textContent = weatherData.weather[0].description;
  document.querySelector(".temp").textContent = `Temperature: ${temperature} °F`;
  document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
  document.querySelector(".wind").textContent = `Wind Speed: ${windSpeed} MPH`;
  document.querySelector(".weather-icon").setAttribute("src", weatherIconUrl);
}

// Function to save a search to the search history and local storage
function saveToSearchHistory(city) {
  if (searchHistory.indexOf(city) === -1) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}

// Function to get the 5-day forecast data from the OpenWeather API
function getFiveDayForecast(city) {
  const apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      handleFiveDay(data.list); 
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

function handleFiveDay(data){
  for(let i = 6; i < data.length; i+=8){
    let icon = data[i].weather[0].icon;
    let iconURL = "https://openweathermap.org/img/wn/" + icon +".png";
    let iconElement = $('<img>').attr('src', iconURL).attr('width', '45').attr('height', '45');
    $(`#forecast-date-${i}`).text(dayjs(data[i].dt_txt.split(" ")[0]).format("MMM-DD-YYYY"));
    $(`#forecast-temp-${i}`).text(`${data[i].main.temp} °F`);
    $(`#forecast-wind-${i}`).text(`${data[i].wind.speed} mph`);
    $(`#forecast-humid-${i}`).text(`${data[i].main.humidity} %`);
    $(`#status-${i}`).text(`${data[i].weather[0].description.capitalize()}`).append(iconElement);
  }
}

// When the page loads, get the weather data for the last searched city (if available)
if (searchHistory.length > 0) {
  const lastSearchedCity = searchHistory[searchHistory.length - 1];
  getWeatherData(lastSearchedCity);
  getFiveDayForecast(lastSearchedCity);
}
