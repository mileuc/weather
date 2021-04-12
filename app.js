require('dotenv').config();
const express = require("express");
const https = require("https"); 
const bodyParser = require("body-parser");

const app = express();

//set app's view engine to EJS.
app.set('view engine', 'ejs');

//for our server to serve up static files such as CSS and images
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const city = "Calgary";
const unit = "metric";
const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city.toLowerCase() + "&appid=" + process.env.API_KEY + "&units=" + unit;    

// Between the client browser and our server
app.get('/', function(req, res) {

    https.get(url, function(response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp.toFixed(1);
            const feelsLike = weatherData.main.feels_like.toFixed(1);
            const humidity = weatherData.main.humidity;
            const windSpeed = ((weatherData.wind.speed/1000)*3600).toFixed(0);
            const description = weatherData.weather[0].description;
            const iconID = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png";
            
            res.render("weather", {
                temperature: temp, 
                tempFeelsLike: feelsLike, 
                humidity: humidity,
                speed: windSpeed,
                location: city, 
                description: description, 
                image: imageURL
            });
        });
    });
});

app.post('/', function(req, res) {
    //console.log(req.body.cityName);
    const city = req.body.cityName;
    // const splitCityWords = city.split(" ");
    // for(var i = 0; i < splitCityWords.length; i++) {
    //     splitCityWords[i] = splitCityWords[i][0].toUpperCase() + splitCityWords[i].substr(1);
    // }
    // const query = splitCityWords.join(" "); 
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city.toLowerCase() + "&appid=" + process.env.API_KEY + "&units=" + unit;    

    // Between our server and an external server via an API
    https.get(url, function(response) {
        console.log(response.statusCode);

        if (response.statusCode === 200) {
            response.on("data", function(data) {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp.toFixed(1);
                const feelsLike = weatherData.main.feels_like.toFixed(1);
                const humidity = weatherData.main.humidity;
                const windSpeed = ((weatherData.wind.speed/1000)*3600).toFixed(0);
                const description = weatherData.weather[0].description;
                const iconID = weatherData.weather[0].icon;
                const imageURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png";
                // res.write("<h1>The temperature in " + query + " is " + temp.toFixed(1) + "&#8451;.</h1>");
                // res.write("<h3>" + query + " is currently getting " + description + ".</h3>");
                // res.write("<img src=" + imageURL + ">");
                // res.send();
                res.render("weather", {
                    temperature: temp, 
                    tempFeelsLike: feelsLike, 
                    humidity: humidity,
                    speed: windSpeed,
                    location: city, 
                    description: description, 
                    image: imageURL
                });
            });
        }
        else {
            res.render("weather", {location: null})
        }
        
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function(){
    console.log("Server started on port 3000.");
});
