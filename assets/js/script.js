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
var geoCall='http://api.opneweathermap.org/data/weather?q='
// create search history array
var searchHist = [];

// page load, here we go
$(document).ready(function(){
    $('#weather-grid').addClass('invisible');
    $('#history-grid').addClass('invisible');
    $('#city-grid').addClass('invisible');
    $('#error-msg').innerHtml('');
    showHistory();
});


$('#search-button').click(function(){
    if (citySearch = null) {
        $('#weather-grid').removeClass('invisible');
        $('#history-grid').removeClass('invisible');
        $('#city-grid').removeClass('invisible');
        $('#error-msg').innerHtml('');
        citySearch = $("#search-input")
            .val()
            .trim(); 
    } else {
        $('#error-msg').text('Please enter a valid city.');
        $('#error-msg').css('color','red');
    }
})

