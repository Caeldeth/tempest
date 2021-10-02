// variable declarations
// url for "onecall"
var weatherCall='http://api.openweathermap.org/data/2.5/forecast?q='
// api key
var apiKey='&appid=12ebc88119d79674184a055011cb0300';
// set results to imperial like a barbarian
var apiUnits='&units=imperial';
// set results to english... like a barbarian
var apiLang='&lang=en';
// shortcut for getting weather icon
var weatherIcon='http://openweathermap.org/img/wn/';
// url for current weather call to get lat/lon
var geoCall='http://api.openweathermap.org/data/2.5/weather?q='
// create search history array
var searchHist = [];

// page load, here we go
$(document).ready(function(){
    // hide empty grid pieces
    $('#weather-grid').addClass('invisible');
    $('#history-grid').addClass('invisible');
    $('#city-grid').addClass('invisible');
    // reset error message
    $('#error-msg').text('');
    //show history if any
    // showHistory();
});

// search button handling
$('#search-button').click(function(){
    citySearch = $("#search-input")
    .val().toLowerCase()
    .trim();
    console.log("City search is: " + citySearch)

    if (citySearch != null) {
    //    $('#weather-grid').removeClass('invisible');
    //    $('#history-grid').removeClass('invisible');
    //    $('#city-grid').removeClass('invisible');
    //    $('#error-msg').text('');
        
        getWeather(citySearch);
    } else {
        $('#error-msg').text('Please enter a valid city.');
        $('#error-msg').css('color','red');
    }
})

function getWeather(search) {
    var callWeatherUrl = 
        geoCall
        + search
        + apiKey
        + apiUnits
        + apiLang;
    console.log(callWeatherUrl);

    $.ajax({
        url: callWeatherUrl,
        method: 'GET',
        statusCode: {
            404: function() {
                $('#error-msg').text('City not found!  Please try again.');
                $('#error-msg').css('color','red');
            }
        }
    }).then(function(response){
        $('#error-msg').text('');
        $('#city-grid').removeClass('invisible');
        $('#deets-holder').removeClass('invisible');
        
        var results = response;
        var name = results.name;
        var temperature = Math.floor(results.main.temp);
        var humidity = results.main.humidity;
        var windSpeed = results.wind.speed;
        var currDate = new Date(results.dt * 1000).toLocaleDateString('en-US');
        var icon = results.weather[0].icon;
        var iconPath = weatherIcon + icon +'@2x.png';
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var country = response.sys.country;

        $('#city-name').text(name + " (" + currDate + ") "  );
        $('#city-icon').attr('src', iconPath);
        $('#city-loc').html(country + ", Lat: " + lat + ", Lon: " + lon);
        $('#temp-result').html("Temperature: " + temperature);
        $('#wind-result').html("Wind: " + windSpeed);
        $('#humidity-result').text("Humidity: " + humidity);

        console.log(iconPath);
    });


}
