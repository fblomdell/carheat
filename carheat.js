var weatherUrl = "http://api.openweathermap.org/data/2.5/weather";  

var dbUrl =  "databas.php";
var closest = "hej";

$(document).ready(function(){

    //hämtar data från openweathermap
    $.ajax({
        url: weatherUrl,
        dataType: "json",
        data: {q: 'johannesburg', appid: '8345570b2dad5976394a640c07f03766', units: 'imperial' },

        //sparar temperaturen från openweathermap när den hämtat klart
        success:function(data){
            var temperatur = data.main.temp;
            var weather = data.weather["0"].main
            var wind = data.wind.speed;
            //kalla på nästa funktion som ska använda temperatur och skicka med temperatur
            dispCondition(weather, temperatur, wind);
            getTemp(temperatur);
        },

        error:function(err){
        console.log(err);
        }
    });

    
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
    function dispCondition(weather, temperatur, wind){
        $("#weatherCondition").text(weather);
        
        var tempCelcius = Math.round((temperatur - 32) * (5 / 9));
        $("#outsideTemp").text(Math.round(temperatur) + 'F / ' + tempCelcius + "C");
        
        //ADD WIND
        //$("#weatherCondition").text(weather);
    }
    
    function displayWeather(temprise){
        
        $("#ten").text(temprise.tenmin);
        $("#twenty").text(temprise.twentymin);
        $("#thirty").text(temprise.thirtymin);
        $("#forty").text(temprise.fortymin);
        $("#fifty").text(temprise.fiftymin);
        $("#sixty").text(temprise.sixtymin); 
    };
    
});