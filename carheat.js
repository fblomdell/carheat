var weatherUrl = "http://api.openweathermap.org/data/2.5/weather";  

var dbUrl =  "databas.php";


$(document).ready(function(){
    var carTempClone = $("#carTemp").clone();
    $("#carTemp").hide();
    console.log(carTempClone);
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
        data: {q: searchString, appid: '8345570b2dad5976394a640c07f03766', units: 'metric' },

        //sparar temperaturen från openweathermap när den hämtat klart
        success:function(data){
            var temperatur = data.main.temp;
            var weather = data.weather["0"].main;
            var wind = data.wind.speed;
            var icon = data.weather["0"].icon;
            var iconUrl = "http://openweathermap.org/img/w/"+icon+".png"
            //kalla på nästa funktion som ska använda temperatur och skicka med temperatur
            var location = data.name +", " +data.sys.country;
            var tempF = Math.round((temperatur * (9 / 5) +32));
            console.log(location);
            dispCondition(weather, temperatur, wind, location, iconUrl, tempF);
            
            if (tempF < 65){
                $("#carTemp").html("<h2>Temp too low for accurate tempchange in car.</h2>");
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

    
    //hämtar data från databasen
    function getTemp(temperatur){
        $.ajax({
            
            type: "GET",
            url: dbUrl + "/zeromin",
            dataType: "json",
            
            
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
            type: "GET",
            url: dbUrl + "/" + closest,
            dataType: "json",
            

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
        
       // console.log(iconUrl);
        
        //ADD WIND
        //$("#weatherCondition").text(weather);
    }
    
    
    
    function displayWeather(temprise){
        
        $("#zero").text(calculateCelsius(temprise.zeromin) + "°C");
        $("#ten").text(calculateCelsius(temprise.tenmin) + "°C");
        $("#twenty").text(calculateCelsius(temprise.twentymin) + "°C");
        $("#thirty").text(calculateCelsius(temprise.thirtymin) + "°C");
        $("#forty").text(calculateCelsius(temprise.fortymin) + "°C");
        $("#fifty").text(calculateCelsius(temprise.fiftymin) + "°C");
        $("#sixty").text(calculateCelsius(temprise.sixtymin) + "°C");

        
    }
    
    function calculateCelsius(valInFarenheit){
        return Math.round(((valInFarenheit -32) * (5 / 9) ))
    }

    
});