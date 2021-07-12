const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// 1 -testing
// create https.get to an external Api within app.get to display just one country weather info
//this is for testing, check below for complete APP 
//NO FONTend where you can input request for a particular country

/* app.get("/", function(req, res){
    const query = London;
    const apiKey = "e6fe2a804bd2abbfe4c303a53ffd3910";
    const unit = "metric"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey +"&units=" + unit;

    https.get(url, function(response){
            console.log(response);
            console.log(response.statusCode);
    
                response.on("data", function(data){
                    const weatherData = JSON.parse(data);
                    const temp = weatherData.main.temp;
                    const weatherDescription = weatherData.weather[0].description
                    const icon = weatherData.weather[0].icon
                    // const imageURL = "http://openweathermap.org/img/wn/10d@2x.png";
                    const imageURL = "http://openweathermap.org/img/wn/" + icon+"@2x.png";
                    res.write("<p>The weather is currently" + weatherDescription + "<p>");
                    res.write("<h1>The temperature in London is  " + temp + "degrees Celcius.<h1>"
                    res.write("<img src=" + imageURL + " >");
                res.send()
                })
            })
        })
            app.listen(3000, function() {
                console.log("Server is running on port 3000"); 
        })
    
 */  


        // 2 complete app code
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");//HTTP
});

// SENDING users POST request
app.post("/", function(req,  res){
    console.log(req.body)
    const query = req.body.cityName;
    const query = req.body.cityName;
    const apiKey = "e6fe2a804bd2abbfe4c303a53ffd3910";
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey +"&units=" + unit;
    

    https.get(url, function(response){ //HTTP
    console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);//get stringifydata & change it to parse & save it in weatherData
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
            // example for image with icon 10d2x.png == http://openweathermap.org/img/wn/10d@2x.png  ||icon =10d
            res.write("<p>The weather is currently" + weatherDescription + "<p>");
            res.write("<h1>The temperature in" + query + "is" + temp + "degrees Celcius.<h1>");
            res.write("<img src=" + imageURL + ">");
            // res.write("<img src=" + imageURL + "alt="" " ">");

        res.send();

        });
    });
})
    app.listen(3000, function() {
        console.log("Server is running on port 3000");
    
})
