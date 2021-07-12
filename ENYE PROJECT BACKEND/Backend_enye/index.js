// You have been tasked with 
// -creating a service integration to a public API and exposing a RESTful endpoint. 
// - application must integrate with [Exchange Rate API](https://api.exchangeratesapi.io/latest) to proxy requests 
// 
// ### Tasks
// 1. Create an endpoint that accepts a `GET` request to `/api/rates`
// 2. The `/api/rates` endpoint must accept the following request query parameter strings
//     1. **base**: the home currency rates to be quoted against (i.e. `CZK`)
//     2. **currency**: the specific exchange rates based on a comma-separated symbols parameter (i.e. `EUR,GBP,USD`).
// 3. You can assume standard HTTP status codes on the response. If a request is unsuccessful, your application must properly handle it accordingly with the appropriate status codes
// 4. Upon a successful API response, transform the fetched payload into an object containing the following keys:
//     1. **results**: JSON object containing the results from the API
//     2. **base**: the requested home rate from the request URL query strings
//     3. **date**: the current date 
//     4. **rates**: An Object containing the requested currency in the request URL query strings
// 5. Your application server must be written with Node using an Express server ([https://expressjs.com/](https://expressjs.com/))
// 6. You **must** deploy your backend code


// A successful response for the above request should return the following schema (of course with a more up-to-date values)

// ```jsx
// {
//     "results": {
//         "base": "CZK",
//         "date": "2020-11-17",
//         "rates": {
//             "EUR": 0.0377244605,
//             "GBP": 0.033795458,
//             "USD": 0.044824204
//         }
//     }
// }
// ```
// ### Submission
// You must submit a link to the client(postman) and to the Github code **7 days** after applying to the program. 
// - [Submission Link](https://airtable.com/shrZUGXL4dCK9v05c)

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//STILL WORKING ON THIS, NOT CORRECT
app.get("/api/rates", function(req, res){
    const query = req.body.base; 
    const apiKey = " "; 

    const url = "https://api.exchangeratesapi.io/latest?q=" + query + "&appid=" + apiKey; //??

    https.get(url, function(response){
            console.log(response);
            console.log(response.statusCode);
    
                response.on("data", function(data){
                    const results = JSON.parse(data);
                    const base = results.base; 
                    const date = results.date; 
                    const rates = results.rates 
                    res.write("<h1>The 3 currency rate for" + base + "<h1>"); 
                    res.write("<p>The rate on" + date + "is" + rates + "<p>");
                res.send() 
                })
            })
        })
            app.listen(3000, function() {
                console.log("Server is running on port 3000"); 
        })
        
    
 
