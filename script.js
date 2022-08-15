// Variables 
var apiKey = "d4336a7fa9f7843bf43a971a6d63d529";

var searchButton = $(".searchButton");

// local storage counting city names
var cityCount = 0;


// city names being loading onto HTML page using Forloop
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);

    var cityName = $(".list-cities");

    cityName.append("<li>" + city + "</li>");
}

// Search button feature
searchButton.click(function () {

    var searchCity = $(".searchCity").val();
    

    // live weather
    var currentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&Appid=" + apiKey + "&units=imperial";
    // 5 day forecast
    var cityFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&Appid=" + apiKey + "&units=imperial";


    if (searchCity == "") {
        // console.log(searchCity);
    } else {
        $.ajax({
            method: "GET",
            url: currentWeather
           
        }).then(function (response) {
            // console.log(response.name);
            var cityName = $(".list-cities");
            cityName.append("<li>" + response.name + "</li>");
            // Local storage
            var local = localStorage.setItem(cityCount, response.name);
            cityCount = cityCount + 1;

            // current weather data 
            var currentForecast = $(".currentForecast").append("<div>");
            currentForecast.empty();
            var currentCity = currentForecast.append("<p>");
            currentForecast.append(currentCity);

            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentCity.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentCity.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // temperature input
            var liveTemp = currentCity.append("<p>");
            currentCity.append(liveTemp);
            liveTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            // humidity input
            liveTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // // wind speed added
            liveTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

            // ultraviolet index URL
            var uvIndex = `https://api.openweathermap.org/data/2.5/uvi?appid=d4336a7fa9f7843bf43a971a6d63d529&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // Ultraviolet Index
            $.ajax({
                method: "GET",
                url: uvIndex,
                
            }).then(function (response) {

                var liveUV = liveTemp.append("<p>" + "UV Index: " + response.value + "</p>");
                liveUV;
                liveTemp.append(liveUV);
            });

        });

        // 5-day forecast 
        $.ajax({
            url: cityFiveDay,
            method: "GET"
        }).then(function (response) {
            // 5 day display forecast array
            var day = [0, 8, 16, 24, 32];
            var fiveDayForecast = $(".fiveDayForecast");
            var fiveDayDisplay = $(".fiveDayOne");
            fiveDayDisplay.empty();
            // weather forecast and dates for the next 5 days
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                fiveDayDisplay.append("<div class= fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` 
                + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" 
                + "<p>" + "Wind Speed: " + response.list[i].wind.speed + "</p>" + "</div>");


            })

        });
    }
});