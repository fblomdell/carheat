var weatherUrl = "http://api.openweathermap.org/data/2.5/weather";  

var dbUrl =  "databas.php";
var closest = "hej";


$(document).ready(function(){
    
    document.getElementById("search-location-button").addEventListener("click", function(){
    var searchString = document.getElementById("search-location-input").value;
        //console.log(searchString);
        getWeatherData(searchString);
});
    
    
    function getWeatherData(searchString){
          //hämtar data från openweathermap
    $.ajax({
        url: weatherUrl,
        dataType: "json",
        //ÄNDRA TILLBAKA TILL: Q: SEARCHSTRING
        data: {q: "malmoe", appid: '8345570b2dad5976394a640c07f03766', units: 'metric' },

        //sparar temperaturen från openweathermap när den hämtat klart
        success:function(data){
            var temperatur = data.main.temp;
            var weather = data.weather["0"].main;
            var wind = data.wind.speed;
            var icon = data.weather["0"].icon;
            var iconUrl = "http://openweathermap.org/img/w/"+icon+".png"
            //kalla på nästa funktion som ska använda temperatur och skicka med temperatur
            var location = data.name +", " +data.sys.country;
            console.log(location);
            dispCondition(weather, temperatur, wind, location, iconUrl);
            getTemp(temperatur);
        },

        error:function(err){
        console.log(err);
        }
    });
        
    }

    
    //hämtar data från databasen
    function getTemp(temperatur){
        $.ajax({
            type: "POST",
            url: dbUrl,
            dataType: "json",
            data: {tempMinute: "zeromin"},

            //när den hämtat allt så läggs alla värden från kolumnerna zeromin i en ny array
            success:function(data){

                var zerominArray = [];
                console.log(data);
                $(data).each(function(index, value){

                    zerominArray.push(parseInt(value.zeromin));


                });


                //jämför openweather temp med zerominarrayen och tar närmsta värdet, ÄR I FARENHEIT!!!!!!
                var closest = null;
                $.each(zerominArray, function(index, value){
                  if (closest == null || Math.abs(this - temperatur) < Math.abs(closest - temperatur)) {
                    closest = value;
                  }
                });
                console.log(closest);
                getTemprise(closest);

            },

            error:function(err){
            console.log(err);
            }
        });    
    }
    

    function getTemprise(closest){
        $.ajax({
            type: "POST",
            url: dbUrl,
            dataType: "json",
            data: {getTemprise: closest},

            //när den hämtat allt så läggs alla värden från kolumnerna zeromin i en ny array
            success:function(data){
                var temprise = data['0'];
                displayWeather(temprise);
            },

            error:function(err){
            console.log(err);
            }
        });

    };
    
    //display weather condition
    function dispCondition(weather, temperatur, wind, cityName, iconUrl){
        $("#weatherCondition").text(weather);
        console.log(temperatur);
        //* 9 / 5 + 32;
        var tempF = Math.round((temperatur * (9 / 5) +32));
        $("#outsideTemp").text(Math.round(temperatur) + '°C / ' + tempF + "°F");
        
        $("#weatherInCity").text(cityName);
        $("#windSpeed").text(wind +" m/s");
        $("#weatherIcon").attr("src", iconUrl);
       // console.log(iconUrl);
        
        //ADD WIND
        //$("#weatherCondition").text(weather);
    }
    
    function displayWeather(temprise){
        
        $("#zero").text(temprise.zeromin + "°F");
        $("#ten").text(temprise.tenmin + "°F");
        $("#twenty").text(temprise.twentymin + "°F");
        $("#thirty").text(temprise.thirtymin + "°F");
        $("#forty").text(temprise.fortymin + "°F");
        $("#fifty").text(temprise.fiftymin + "°F");
        $("#sixty").text(temprise.sixtymin + "°F"); 
    };
    
});