// variable declarations
// url for "onecall"
var weatherCall='http://api.openweathermap.org/data/2.5/onecall?'
// excludes
var apiExcludes= '&exclude=current,minutely,hourly,alerts'
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
var searchHistArray = [];

// page load, here we go
$(document).ready(function(){
    clickedSearch();
    // hide empty grid pieces
    $('#weather-grid').addClass('invisible');
    $('#history-grid').addClass('invisible');
    $('#city-grid').addClass('invisible');
    // reset error message
    $('#error-msg').text('');
    showHistory();
    eraseHistory();
    touchHistory();
});

// search button handling
function clickedSearch(){
$('#search-button').click(function(){
    citySearch = $("#search-input")
    .val().toLowerCase()
    .trim();
    console.log("City search is: " + citySearch)

    if (citySearch != "") {
        $('#history-grid').removeClass('invisible');
        $('#search-input').val('');
        getWeather(citySearch);
        showHistory();
    } else {
        $('#error-msg').text('Please enter a valid city.');
        $('#error-msg').css('color','red');
    }
})
}

// cheat code to enable elements for styling
$('#jumbotron').click(function(){
    $('#weather-grid').removeClass('invisible');
    $('#history-grid').removeClass('invisible');
    $('#city-grid').removeClass('invisible');

    $('#city-name').text("City Name" + " (" + "currDate" + ") "  );
    // set the weather icon
    $('#city-icon').attr('src', 'http://openweathermap.org/img/wn/10d@2x.png');
    // string the country, lat and lon together
    $('#city-loc').html("country" + ", Lat: " + "lat" + ", Lon: " + "lon");
    // show the temperature
    $('#temp-result').html("Temperature: " + "temperature");
    // show the wind speed
    $('#wind-result').html("Wind: " + "windSpeed");
    // show the humidity
    $('#humidity-result').text("Humidity: " + "humidity");
    $('#uv-result').html("UV Index: " + 
    '<span class="badge badge-pill badge-light" id="uv-color">'
    + "uvi"
    +'</span>'
    );
    $('#uv-color').css('background-color', 'red');
    $('#uv-color').css('color', 'white');
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

        // name all the things
        // name the response
        var results = response;
        // get the name
        var name = results.name;
        // get the temperature
        var temperature = Math.floor(results.main.temp);
        // get the humidity
        var humidity = results.main.humidity;
        // get the wind speed
        var windSpeed = results.wind.speed;
        // get the current date
        var currDate = new Date(results.dt * 1000).toLocaleDateString('en-US');
        // get the icon
        var icon = results.weather[0].icon;
        // get the icon and make it bigger
        var iconPath = weatherIcon + icon +'@2x.png';
        // get the latitude
        var lat = response.coord.lat;
        // get the longitude
        var lon = response.coord.lon;
        // get the country
        var country = response.sys.country;
        // set up second api call
        // the irony of this is :chefskiss:
        var oneCallUrl = 
            weatherCall 
            + "&lat="
            + lat
            + "&lon="
            + lon
            + apiExcludes
            + apiUnits
            + apiLang
            + apiKey;
        
        saveHistory(name);

        $.ajax({
            url: oneCallUrl,
            method: 'GET'
        }).then(function(oneCallTell){
            var oneCallResults = oneCallTell;
            var uvi = oneCallTell.daily[0].uvi

            $('#uv-result').html("UV Index: " + 
            '<span class="badge badge-pill badge-light" id="uv-color">'
            + uvi
            +'</span>'
            );

            //UVI color coding
            if (uvi < 3) {
                $('#uv-color').css('background-color', 'blue');
                $('#uv-color').css('color', 'white');
            } else if (uvi < 6) {
                $('#uv-color').css('background-color', 'yellow');
                $('#uv-color').css('color', 'black');
            } else if (uvi < 8) {
                $('#uv-color').css('background-color', 'orange');
                $('#uv-color').css('color', 'white');
            } else if (uvi < 11) {
                $('#uv-color').css('background-color', 'red');
                $('#uv-color').css('color', 'white');
            } else {
                $('#uv-color').css('background-color', 'lightgray');
                $('#uv-color').css('color', 'black');
            }

            var fcastGroup = [];
            //use same call to make cards
            for (var i = 1; i < 6; i++){
                var fcastObject = {};
                var resultsDate = oneCallTell.daily[i].dt;
                var fcastDate = new Date(resultsDate*1000).toLocaleDateString('en-US');
                var fcastTemp = oneCallTell.daily[i].temp.day
                var fcastWind = oneCallTell.daily[i].wind_speed;
                var fcastHumid = oneCallTell.daily[i].humidity;
                var fcastIcon = oneCallTell.daily[i].weather[0].icon

                fcastObject['list'] = {};
                fcastObject['list']['date'] = fcastDate;
                fcastObject['list']['temp'] = fcastTemp;
                fcastObject['list']['wind'] = fcastWind;
                fcastObject['list']['humidity'] = fcastHumid;
                fcastObject['list']['icon'] = fcastIcon;

                fcastGroup.push(fcastObject);
                
            }
            console.log(fcastGroup);

            for (var c = 0; c < 5; c++) {
                var fcastCardDate = fcastGroup[c].list.date;
                var fcastCardIcon = 
                    weatherIcon + fcastGroup[c].list.icon + '.png';
                var fcastCardTemp = Math.floor(fcastGroup[c].list.temp);
                var fcastCardHumid = fcastGroup[c].list.humidity;
                var fcastCardWind = fcastGroup[c].list.wind;

                $('#card-date-' + (c+1)).text(fcastCardDate);
                $('#card-icon-' + (c+1)).attr('src', fcastCardIcon);
                $('#card-temp-' + (c+1)).text('Temp: ' + Math.floor(fcastCardTemp) + ' °F');
                $('#card-humidity-' + (c+1)).text('Humidity: ' + fcastCardHumid + '%');
                $('#card-wind-' + (c+1)).text('Wind: ' + fcastCardWind + 'MPH');
            }
            $('#weather-grid').removeClass('invisible');
        });

        // show all the things
        // string the name and date together
        $('#city-name').text(name + " (" + currDate + ") "  );
        // set the weather icon
        $('#city-icon').attr('src', iconPath);
        // string the country, lat and lon together
        $('#city-loc').html(country + ", Lat: " + lat + ", Lon: " + lon);
        // show the temperature
        $('#temp-result').html("Temperature: " + temperature);
        // show the wind speed
        $('#wind-result').html("Wind: " + windSpeed);
        // show the humidity
        $('#humidity-result').text("Humidity: " + humidity);

    });
}

// local storage junk
function saveHistory(citySearch) { //storeHistory
    // make an object to hold stuff
    var saveHistObject = {};

    // if there is nothing in savedHistory (local storage), save current city search to object, push to array, then json string to localstorage
    if (searchHistArray === 0) {
        saveHistObject['city'] = citySearch;
        console.log(saveHistObject);
        searchHistArray.push(saveHistObject);
        localStorage.setItem('savedHistory', JSON.stringify(searchHistArray));
    } else {
        // if there is /something/ in savedHistory, see if it is already there
        var checkHist = searchHistArray.find(
            ({ city }) => city === citySearch
        );

        // if it isn't and we have less than five entries, add it to the array
        if (searchHistArray.length < 5) {
            if (checkHist === undefined) {
                saveHistObject['city'] = citySearch;
                searchHistArray.push(saveHistObject);
                localStorage.setItem('savedHistory', JSON.stringify(searchHistArray));
                };
        // if it isn't and we have five or more entries, drop kick one out and then add to array
            } else {
                if (checkHist === undefined) {
                    searchHistArray.shift();
                    saveHistObject['city'] = citySearch;
                    searchHistArray.push(saveHistObject);
                    localStorage.setItem(
                        'savedHistory', JSON.stringify(searchHistArray)
                    );
                }
            }
        }
    $('ul li').remove();
    //show the history
    showHistory();
};

function showHistory() { //display History
    var getLocalSaved = localStorage.getItem('savedHistory');
    var localSavedHist = JSON.parse(getLocalSaved);

    if (getLocalSaved === null) {
        makeHistory();
        getLocalSaved = localStorage.getItem('savedHistory');
        localSavedHist = JSON.parse(getLocalSaved);
    }

    for (var i = 0; i < localSavedHist.length; i++) {
        var histListItem = $('<li>');
        histListItem.addClass('list-group-item');
        histListItem.text(localSavedHist[i].city);
        $('#history-list').prepend(histListItem);
        $('#history-grid').removeClass('invisible');
    }
    return (searchHistArray = localSavedHist);
}

function makeHistory() { //create History
    searchHistArray.length=0;
    localStorage.setItem('savedHistory', JSON.stringify(searchHistArray));
}

function eraseHistory() { //clear History
    $('#clear-history').on('click', function(){
        $('ul li').remove();
        $('#history-grid').addClass('invisible')
        localStorage.removeItem('savedHistory');
        makeHistory();
    });
}

function touchHistory() { //click history
    $('#history-entries').on('click','li', function(){
        var histCitySearch = $(this).text();
        getWeather(histCitySearch);
    });
}
