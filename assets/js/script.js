/* var weatherApi = 'api.openweathermap.org/data/2.5/forecast?q={city name}&appid={22179a2464e0f26983d2332ad50360fd}' */

var searchHistory = JSON.parse(localStorage.getItem("citySearch")) || [];

let weather = {
  "apiKey": "22179a2464e0f26983d2332ad50360fd",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + this.apiKey
    )

    .then((response) => response.json())
    .then((response) => this.displayWeather(data));
  },
  displayWeather: function(data) {
    const {name} = data;
    const {icon, description} = data.weather[0];
    const {temp, humidity} = data.main;
    const {speed} = data.wind;
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city").innerText = `Weather in ${name}:`;
    document.querySelector(".weather-icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").innerText = `${description}`;
    document.querySelector(".temp").innerText = `${temp}F`;
    document.querySelector(".humidity").innerText = `Humidity: ${name}%`;
    document.querySelector(".wind").innerText = `Wind Speed: ${speed} mph`;

    if (!searchHistory.includes(name)) {
      searchHistory.push(name)
      localStorage.setItem("citySearch",JSON.stringify(searchHistory))
      var btn = document.createElement('button')
      btn.setAttribute("class", "btn")
      btn.textContent = name
      btn.onclick = this.onClick;
      document.querySelector(".city-list").append(btn)
    }
  },
  search: function() {
    this.fetchWeather(document.querySelector("#search-input").value);
  },
  onClick: function(event) {
    console.log(event.target.textContent)
    weather.fetchWeather(event.target.textContent)
  }
};

document.getElementById("search-btn").addEventListener("click", function() {
  weather.search();

  function displayTime() {
    var todaysDate = dayjs().format('dddd, MMMM DD, YYYY');
    currentDayEl.text(todaysDate);
  }
  displayTime();
  setInterval(displayTime);
});


for (var i = 0; i < searchHistory.length; i++) {
  var btn = document.createElement('button')

  btn.setAttribute("class", "btn")

  btn.textContent = searchHistory[i]
  btn.onclick = weather.onClick
  document.querySelector(".city-list").append(btn)
}
