var weatherUrl = "http://api.openweathermap.org/data/2.5/weather";  

var dbUrl =  "databas.php";


$(document).ready(function(){
    
    //use enter-key to search
    $("#search-location-input").keyup(function(event){
    if(event.keyCode == 13){
        $("#search-location-button").click();
    }
});
    
    var carTempClone = $("#carTemp").clone();
    $("#carTemp").hide();
    console.log(carTempClone);
    document.getElementById("search-location-button").addEventListener("click", function(){
        var searchString = document.getElementById("search-location-input").value;
        
        //console.log(searchString);
        getWeatherData(searchString);
});
    
    //fetch weather data from openweathermap.org
    function getWeatherData(searchString){
          
    $.ajax({
        url: weatherUrl,
        dataType: "json",
        
        data: {q: searchString, appid: '8345570b2dad5976394a640c07f03766', units: 'metric' },

        //save temp from openweathermap if success
        success:function(data){
            var temperatur = data.main.temp;
            var weather = data.weather["0"].main;
            var wind = data.wind.speed;
            var icon = data.weather["0"].icon;
            var iconUrl = "http://openweathermap.org/img/w/"+icon+".png"
            
            var location = data.name +", " +data.sys.country;
            var tempF = Math.round((temperatur * (9 / 5) +32));
            console.log(location);
            dispCondition(weather, temperatur, wind, location, iconUrl, tempF);
            //show error message if outside temp is too low
            if (tempF < 65){
                $("#carTemp").html("<p id='lowTemp'>Accurate car temperatures require minimum outside temp of 18°C</p>");
            }
            else{
                $("#carTemp").show();
                $("#carTemp").replaceWith(carTempClone.clone());
                getTemp(tempF);
            }
            
        },

        error:function(err){
        console.log(err);
        }
    });
        
    }

    
    //get all zeromin values from DB
    function getTemp(temperatur){
        $.ajax({
            
            type: "GET",
            url: dbUrl + "/zeromin",
            dataType: "json",
            
            
            //save data in array
            success:function(data){
                
                var zerominArray = [];
                console.log(data);
                $(data).each(function(index, value){

                    zerominArray.push(parseInt(value.zeromin));


                });



                //compare openweathermap temp with zeromin array (from db) and return closest value (return is in Farenheit)
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
    
    //get tempchange data based on outside temp
    function getTemprise(closest){
        $.ajax({
            type: "GET",
            url: dbUrl + "/" + closest,
            dataType: "json",
            

            
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
    function dispCondition(weather, temperatur, wind, cityName, iconUrl, tempF){
        $("#weatherCondition").text(weather);
        console.log(temperatur);
        //* 9 / 5 + 32;
        
        $("#outsideTemp").text(Math.round(temperatur) + '°C / ' + tempF + "°F");
        
        $("#weatherInCity").text(cityName);
        $("#windSpeed").text(wind +" m/s");
        $("#weatherIcon").attr("src", iconUrl);
        $("#weatherIcon").attr("style", "inline");
        $("#weatherInfo").attr("style", "inline");
        $("#carTemp").attr("style", "inline");
        
    }
    
    
    //display tempchange in car
    function displayWeather(temprise){
        
        $("#zero").text(calculateCelsius(temprise.zeromin) + "°C");
        $("#ten").text(calculateCelsius(temprise.tenmin) + "°C");
        $("#twenty").text(calculateCelsius(temprise.twentymin) + "°C");
        $("#thirty").text(calculateCelsius(temprise.thirtymin) + "°C");
        $("#forty").text(calculateCelsius(temprise.fortymin) + "°C");
        $("#fifty").text(calculateCelsius(temprise.fiftymin) + "°C");
        $("#sixty").text(calculateCelsius(temprise.sixtymin) + "°C");

        
    }
    
    //convert Frenheit to Celcius
    function calculateCelsius(valInFarenheit){
        return Math.round(((valInFarenheit -32) * (5 / 9) ))
    }

    
});