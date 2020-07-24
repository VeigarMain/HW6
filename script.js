$(document).ready(function () {
    //search button feature
    $("#search-button").on("click", function () {
        var searchTerm = $("#search-value").val();
        $("#search-value").val("");
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });

    var history = JSON.parse(localStorage.getItem("history")) || [];
        //  storage.clear(); 
        //  this was to clear the local storage after I had too many cities appending to the page..

    if (history.length > 0) {
        weatherFunction(history[history.length - 1]);
    }
    for (let i = 0; i < history.length; i++) {
        createLine(history[i]);
    }   





    function createLine(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }
    



    $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });
    function weatherFunction(searchTerm) {
            // ajax call to pull an object in the dom, to pull my data for specific weather api...
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=7f47f18baaa1e65c4663101f0c98b450&units=imperial",

        }).then(function (data) {
            if (history.indexOf(searchTerm) === -1) {
                history.push(searchTerm);
                localStorage.setItem("history", JSON.stringify(history));
            }
            $("#today").empty();
            

            var date =  moment().format("MMMM Do YYYY");
            var dateP = $("<p></p>").text(date);
            var cityName = $("<h4></h4>").text(data.name);
            

             
            
            var windSpeed = $("<p></p>").text(data.wind.speed)
            
            $("#today").append(dateP, windSpeed, cityName);
            

                // ajax call to gather UV index data..
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?&lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=7f47f18baaa1e65c4663101f0c98b450"
                




            }).then(function (response) {
                console.log(response);

                
                var uvResponse = response.value;
                
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
                var cardBody = $("<div>").addClass("card-body").text
                var uvIndex = $("<p>").text("UV Index: ");
                var uvSpan = $("<span>").text(uvResponse);
                uvSpan.removeClass("red green purple");
                    if (uvResponse < 5) {
                        uvSpan.addClass("green");

                    } else if (uvResponse < 10) {
                        uvSpan.addClass("red"); 
                    } else {
                        uvSpan.addClass("purple");
                    }
                    

                
                uvIndex.append(uvSpan);
                $("#today").append(uvIndex);


                if (uvResponse < 2) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 8) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-trouble");
                }

                cardBody.append(uvIndex);
                $("#today").append(cardBody.append(btn));
                    console.log(cardBody);
            });

           
            console.log(data);
        });
    }
    


    // ajax api call to grab searchterms..

    
    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=7f47f18baaa1e65c4663101f0c98b450&units=imperial",

        }).then(function (data) {
            // console.log(data); 
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
                    console.log("#forecast");
            for (var i = 0; i < data.list.length; i++) {
                        console.log(data.list.length);
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        // console.log(list[i];)
                    var titleOne = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgOne = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    
                    var colOne = $("<div>").addClass("col-md-2");
                    var cardOne = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyOne = $("<div>").addClass("card-body p-2");
                    var humidOne = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempOne = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
                    
                    
                    colOne.append(cardOne.append(cardBodyOne.append(titleOne, imgOne, tempOne, humidOne)));
                    
                    $("#forecast .row").append(colOne);
                    // console.log(colOne);
                }
            }
       });
     }

 });