var APIkey = "9c0ee32f38e44e8ad2ff55ceec5d1b2f"
var cityhistory = []

cityhistory = JSON.parse(localStorage.getItem("weather"))
if (!cityhistory) {
  cityhistory = []
}
else {
  renderList()
  searchWeather(cityhistory[cityhistory.length - 1])
  searchForecast(cityhistory[cityhistory.length - 1])

}

$("#search").on("click", function () {
  event.preventDefault()
  var city = $("#city").val()
  searchWeather(city)
  searchForecast(city)


})

function renderList() {
  console.log("render", cityhistory)
  $("#cityhistory").empty()
  for (var i = 0; i < cityhistory.length; i++) {
    $("#cityhistory").append(`<li class="citysearch" city=${i}>${cityhistory[i]}</li>`)
  }
  $(".citysearch").on("click", function () {
    console.log(this)
    var index = $(this).attr("city")
    searchWeather(cityhistory[index])
    searchForecast(cityhistory[index])

  })
}

function searchWeather(city) {

  var apiQuery = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units="imperial"`
  console.log(apiQuery)
  $.get(apiQuery).then(function (result) {

    saveLocalStorage(city)
    console.log(result)

 

    // show the info on the HTML
    var icon = "https://openweathermap.org/img/w/" + result.weather[0].icon + ".png"
    var card = `
<div class="card cardForcast mb-5" style="width: 14rem; height: 20rem">
  <img src=${icon} class="card-img-top" alt="..." </img>
  <div class="card-body">
    <h5 class="card-title">${result.name}</h5>
   
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Wind Speed: ${result.wind.speed}</li>
    <li class="list-group-item">Temperature: ${((result.main.temp - 273.15) * 1.80 + 32).toFixed(2)}</li>
    <li class="list-group-item">Humidity:${result.main.humidity}</li>
    <li class="list-group-item">UVIndex: <span id="UVINDEX"></span></li>
  </ul>

</div>`
    console.log(card)
    // var tempF = (result.main.temp - 273.15) * 1.80 + 32;
    //  $(".tempF").text("Temperature (Kelvin) " + tempF);



    $("#current").empty()
    $("#current").append(card)

    calculateuv(result.coord.lon, result.coord.lat)
  })

}

function saveLocalStorage(city) {
  if (cityhistory.indexOf(city) === -1) {
    cityhistory.push(city)
    localStorage.setItem("weather", JSON.stringify(cityhistory))
    renderList()
  }
}
function searchForecast(city) {

  var apiQuery = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units="imperial"`
  console.log(apiQuery)
  $.get(apiQuery).then(function (result) {

    console.log(result)
    $("#forecast").empty()

    for (var i = 0; i < result.list.length; i++) {
      var day = result.list[i].dt_txt.split(" ")[0]
      var hour = result.list[i].dt_txt.split(" ")[1]
      if (hour === "12:00:00") {
        var icon = "https://openweathermap.org/img/w/" + result.list[i].weather[0].icon + ".png"
        console.log(icon)
        var card = `

    <div class="col mb-4 mt-4">
      <div class="card cardForcast" style="width: 14rem; height: 20rem"  >
        <img src=${icon} class="card-img-top" alt="..."></img>
        <div class="card-body">
          <h5 class="card-title">${day}</h5>
          <ul class="list-group list-group-flush">
          <li class="list-group-item">Wind Speed: ${result.list[i].wind.speed}</li>
          <li class="list-group-item">Temperature: ${((result.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2)}</li>
          <li class="list-group-item">Humidity:${result.list[i].main.humidity}</li>
        </ul>
        </div>
     
    </div>`


        $("#forecast").append(card)

      }
      // build the cards for the 5 days
    }
  })
}

function calculateuv(lon, lat) {
  $.ajax({
    type: "GET",
    url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon,


  }).then(function (resUV) {
    console.log("-->", resUV, resUV.value)
   $("#UVINDEX").text(resUV.value)
  })
}
