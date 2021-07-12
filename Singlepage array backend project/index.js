require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
app.use(express.json());//conf. middleware

//create an array called users which represents a sample of database/datatable that contains credentials of users
const users = [
{
    "username" :"bukola",
    "password" :"bk123",   
},
{
    "username" :"kola",
    "password" :"kk222"
},
{
    "username": "toyin",
    "password": "$2b$04$etW4qmEqydpccrH/9eU6FuW/TU3YEkAfG8KoWVQg1uAYAYr/4x/U."
}
];


const movies = [
    {
        "title": "24",
        "actor": "Jack Bauer",
        "producer": "Tarantino",
        "rating": 8
    },
    {
        "title": "Super Man",
        "actor": "Alex Young",
        "producer": "Joe Rogan",
        "rating": 9
    }
]


    const rentals = [
        {
            "username": "bukola",
            "receiptNumber":  442,
            "orderNumber":044,
            "movieTitles": ["24", "Super Man"],
            "rentDate":"2/6/20",
            "returnDate":"16/6/20",
            },
        
        {
            "username": "toyin",
            "receiptNumber":  330,
            "orderNumber": 022,
            "movieTitles":"Super Man",
            "rentDate":"6/7/20",
            "returnDate":"20/7/20"
           }
        ]

//////AUTHENTICATION////////////////////////
// authentication- used to verify a user in the client-side trying to access the database or the site.
// the server uses the user's information like the username and password 
// When a User logs in, the server creates a session for the user & stores it in the memory with an  id called session id 
// When the User makes a request to the server, the request is sent along with the cookie+ssession id 
// The server then checks the session id and compares it with the session information saved in its memory. 
// After the verification is completed by the server, the server responds with the data to the User.
// Next, start your server by running -npm run devStart in your terminal.
// Your server starts running,it will show "server listening on port 3000"

//CREATE ROOT ENDPOINT +GET REQUEST///////////////////////
//create a route to root-users-route. 
app.get('/', (req, res) => { 
    res.send("Welcome");  //response with welcome on the home page
});
//CREATE USERS ENDPOINT + GET REQUEST TO SEE ALL USERS
//create a route to users array-object using a GET&convert to json using app.use(express.json()) 
app.get('/users',  authenticateToken, (req, res) => { 
    res.send(users);  //response with all the user
    // or 
    // response.status(200).send(users);
});

// TESTING THE GET REQUEST 
// To test this request, we will be using postman & NO LOGIN ROUTE YET that will encrpt password
// Your server is still running, so you do not have to restart your server because you have nodemon installed.
// Go to postman and on the drop down to the left, choose GET and set your url to http://localhost/3000/ -root route  
// http://localhost/3000/users -users route
// click on the Send button to send the request--You should get a response of the users object.

//USERS ENDPOINT + GET REQUEST TO SEE A SPECIFIC USER OBJ+ AUTHORISATION using username
 app.get('/users', authenticateToken, (req, res) => {
    // const {name} = req.user;
    const username = req.body.username;//i.e username of 1 of the user inside the user array
    
    // const rentalUser = rentals.filter(rental => rentals.name === name);
    const userName = users.filter(user => user.username === username);

    if(!userName) {
        return res.send("Username are not allowed");    
    }
    res.json(userName);
});


//USERS ENDPOINT + POST REQUEST + NO PASSWORD ENCRPT + NO AUTHENTICATION
//create a route to users array-object using a POST& post to users using .push
//To input the value of the users on postman
//set the above array to empty after testing or leave it and add new username& password thru postman
//to freshly enter  username & password i.e create a user that will be added to the empty array(the database)on postman
app.post('/users', (req, res) => {
    const user = { 
        username: req.body.username, 
        password: req.body.password 
    
    };
    users.push(user);
    res.status(201).send(users);
});

//TESTING POST REQUEST
//go to postman and make this POST request to this route http://localhost:3000/users, 
//set the type of request to JSON(application/json) and 
//in the body of the request input users data:(JSON object) username and password
//RESULT IN body response will show username and password in text format but we need to encrypt the password

// The passwords of the users are in plain text in the database which means anyone that gains access to your database
// can have access to all the passwords of your users and be able to do anything with it. 
// To avoid this we use hashing which can be achieved by a library called bcrypt.

// UPDATE
// this api end-point update an existing users object
// for that we get `username` from end-point of users to update
app.put('/users', authenticateToken, (req, res) => { 
    
    let updated;
    let found = users.find(function (user) {
        return user.username === req.body.username;
    });

    // check if user found
    if (found) {
        updated = {
            username: req.body.username, 
            password: req.body.password 
        };

        // find index of found object from array of users
        let targetIndex = users.indexOf(found);
        // replace object from users list with `updated` object
        users.splice(targetIndex, 1, updated);

        res.status(200).send(users);
    } else {
        res.status(404).send("The user you are trying to update does not exist");
    }
});


// DELETE
// this api end-point delete an existing item object from array of users &
//  match by username find user and then delete
app.delete('/users', authenticateToken, (req, res) => { 

    let found = users.find(user => 
    {
        return user.username === req.body.username;

    });

    if (found) {
        let targetIndex = users.indexOf(found);
        users.splice(targetIndex, 1);
        res.status(200).send("The user has been deleted");
    }
    else{ 
        res.status(404).send("The user with the username " + req.body.username + " was not found");
    }
});


//////////////////////////////////////////////////////////////////////
// MOVIES ENDPOINT + only authentication///////////////////////
app.get('/movies', authenticateToken, (req, res) => { 
    res.send(movies);  
    // or 
    // response.status(200).send(users);
});

//returns 1 movie object using title parameter e.g {"title" : "24"} + authentication
app.get('/moviesTitle', authenticateToken, (req, res) => {
    const title = req.body.title;
    
    const movie = movies.filter(movie => movie.title === title);

    // if(!movie) {
    if(movie.length == 0) {
        return res.status(404).send("No movie was found with this title");    
    }
    res.status(200).json(movie);
});

app.post('/movies', (req, res) => {
    const movies = { 
        username: req.body.username, 
        password: req.body.password, 
        title: req.body.title,
        actor: req.body.actor,
        producer: req.body.producer,
        rating: req.body.rating

    };
    movies.push(movie);
    res.status(201).send(movies);
});

// UPDATE
// this api end-point update an existing movie object
// for that we get `title` from end-point of movies to update
app.put('/movies', authenticateToken, (req, res) => { 
    // get item object match by `id`
    let updated;
    let found = movies.find(function (movie) {
        return movie.title === req.body.title;
    });

    // check if movie found
    if (found) {

        updated = {
            title: req.body.title,
            actor: req.body.actor,
            producer: req.body.producer,
            rating: req.body.rating
        };

        // find index of found object from array of movies
        let targetIndex = movies.indexOf(found);
        // replace object from movies list with `updated` object
        movies.splice(targetIndex, 1, updated);

        res.status(200).send(movies);
    } else {
        res.status(404).send("The movie you are trying to update does not exist");
    }
});


// DELETE
// this api end-point delete an existing item object from
// array of movie, match by movietitle find item and then delete
app.delete('/movies', authenticateToken, (req, res) => { 

    let found = movies.find(movie => 
    {
        return movie.title === req.body.title;

    });

    if (found) {
        let targetIndex = movies.indexOf(found);
        movies.splice(targetIndex, 1);
        res.status(200).send("The movie has been deleted");
    }
    else{ 
        res.status(404).send("The movie with the title " + req.body.title + " was not found");
    }
});


 /////////////////////////
//USERSSIGNUP ENDPOINT USING POST REQUEST + ENCRPT/HASHING THE PASSWORD =USERSCREATE
//1.generate a salt using bcrypt in the route handler for the post request
app.post('/usersSignup', async(req, res) => {
    console.log("I am getting here");
    

    try {
        let salt;
        let hashedPassword;
        bcrypt.genSalt(2, function(err,ensalt){
            console.log(ensalt);
            salt= ensalt;
            
        bcrypt.hash(req.body.password, ensalt, function(err, encrypted){
                console.log("The hashed password is : " + encrypted);
                hashedPassword = encrypted
                const user = { username: req.body.username, password: hashedPassword };
                users.push(user);
                res.status(200).send(users);
            });
           
        });
        
        console.log("This would return : " + hashedPassword)
        
        // console.log(salt);
        
        
    } catch {
        res.status(500).send();
    }
});
// Delete the objects in the users array and set it to an empty array. or you may leave it
// When you use the POST request, you will create a user that will be added to the empty array(the database).
// Now create a post request on postman again 
// and see that your response for password is now hashed!

// CREATE LOGIN ROUTE/ENDPOINT TO TEST ENCRPTED PASSWORD ONLY
// next create login route to check/compare the user's information with which was created(authentication) 
//1.first confirm if user exist, then
//2.compare the password with the hashed password

// app.post('/users/login', async(req, res) => {
//     console.log("Login Route")
//     const user = users.find(user => user.username = req.body.username);
//     if(user == null) {
//         console.log("Users does not exist")
//         return res.status(404).send("User does not exist");
//     }
//     console.log("User exists, checking password...")
//     try {
//         // if(await bcrypt.compare(req.body.password, user.password)) {
//         //     res.send("Success");
//         // }
//         if( req.body.password === user.password){
//             res.send("Success");
//         }
//         else{
//             res.status(500).send("user not allowed");
//         }
//     } catch {
//         res.status(500).send("user not allowed");
//     }
// });
// test the above code via postman,
// create a user with the POST request to http://localhost:3000/users-first sign up.
// next, login the user with the POST request to http://localhost:3000/users/login 
// After logging the user it responds with success  
// because the username&password used to log in matches the hashed password that was created when the user was created.
// if you change the password of the user in the body of the login request,It will respond with 'User not allowed'

/////////////////////
// THE IMPLEMENTATION OF JWT FOR AUTHORIZATION IN NODEJS
// authorization a process by which a server determines if the client has permission to access or use a resource on a site. 
// Authorization is usually done using sessions or tokens.
// the authorization of user with JSON WEB TOKEN to enable or disable access to users logged in after authentication&signup
// You will be creating the token in your server/index.js file, in the post request to the /users/login route.
//1. GENERATE TOKEN USING JSON WEB TOKEN
// first thing you need to do is install: a. jsonwebtokens b. dotenv libraries  c. crypto
// to be able to generate tokens and secret keys that will be used to serialize your user object.
//NOTE:jsonwebtokens & dotenv generate accesstoken on postman while crypto generate ACCESS_TOKEN_SECRET on terminal


        //a.install jsonwebtokens
        //b.install dotenv and create a .env file where you will put the acessToken generated by crypto
        //c.For the crypto:In your terminal, while your server is running on one tab, 
        // open another tab and type npm install crypto
        // open a crypto.js file & typpe in: const crypto = require('crypto').randomBytes(64).toString('hex')
        //in terminal run node crypto.js, this will generate the ACCESS_TOKEN_SECRET
        //copy the acesstoken and paste it insinde the .env file  
// set the ACCESS_TOKEN_SECRET environment variable to the secret token in the .env file.
// Then back in your index.js file, return the accessToken as a JSON object in your server. 
//d. verify token

// CREATE LOGIN ROUTE TO COMPARE ENCRPTED PASSWORD + GENERATE AUTHORISATION
app.post('/usersLogin', async(req, res) => {
    const user = users.find(user => user.username === req.body.username);
    console.log("Got to the POST User/LOGIN");
    if(user == null) {
        return res.status(404).send("User does not exist");
    }
    try {
        //if(await bcrypt.compare(req.body.password, user.password)) {
            bcrypt.compare(req.body.password, user.password, function(err, same){
                if(err){
                    console.log(err)
                    res.status(500).send("Soemthing went wrong, please try again");
                }if(same){
                    const username = req.body.username;
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    res.json({ accessToken: accessToken });
                    //res.send("Success");
                }else{
                    res.status(401).send("Username and Password Combination does not match")
                }
            })
    } catch {
        res.status(500).send("user not allowed");
    }
});
//////////////////////////
   //d.VERIFY TOKEN that was sent by creating a MIDDLEWARE that will:
// Middleware is how express handles a sequence of functions, its like a series of functions that you can call.
// So middlewares create this sequence and allows your functions to run one after the other in the order you set.
// They consist of functions that are called every time a request is made to the server & they're executed with app.use() as above.

// get the token from the authorization header in req.headers['authorization']
// check if the token exists and if not return an error of status 401 meaning the token doesn't exist,
//  but if the token exists move unto the next step

// in index.js create two functions: function authenticateToken & jwt.verify
// lastly call the next() function that allows you to use the middleware in your GET request to the /rentals route.
//OR
// create a file/module called middle.js and write these two functions in that file and
// import the functions in your app.js file 

//INSIDE APP.JS OR MIDDLE.JS
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'].split(' ')[1];
    if (authHeader == null) {
       return res.sendStatus(401);
    }
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
       if (err) {
           console.log(err)
           return res.sendStatus(403);
       }
       req.user = user;
       next();
    });
    };
//TESTING TO SEE ACESS TOKEN 
//first create/signup a user with POST request to http://localhost:3000/usersCreate-it will create +hashed password
// Now login user with http://localhost:3000/users/login route with POST request,it should respond with ur access token            



//////////////////////////////
// RENTALS ENDPOINT THAT REQUIRES AUTHORISATION
// For instance, you have a rentals resource on your app that only users that are logged in and authenticated and verified can access that resource.
//  So create and array of objects called rentals that will contain the username of the users logged in and their ordersNumber,
// receiptNumber,movieTitles,rentDate,returnDate in an object.
 // create an array of objects called rentals that will contain the username of users logged in and their orders.

 app.get('/rentals', authenticateToken, (req, res) => { 
    res.send(rentals);  
    
});
// RETURN RENTAL VIA USERNAME & AUTHENTICATION
// Next, create a route that will handle GET requests for the rentals and
//  include the middleware that verifies your token.
app.get('/rentals', authenticateToken, (req, res) => {
        // const {name} = req.user;
        const username = req.body.username;//i.e usename of 1 of the user inside the user array
        
        // const rentalUser = rentals.filter(rental => rentals.name === name);
        const rentalUser = rentals.filter(rental => rental.username === username);

        if(!rentalUser) {
            return res.send("User has no rental");    
        }
        res.json(rentalUser);
    });
//TESTING ACCESS TOKEN that will be used along with GET request from differnt routes 
// To test this code, copy the token returned by the user and on postman 
// create a GET request to this route http://localhost:3000/rentals and 
// in the Headers - key, set it to Authorization and in the value, paste the token and click on Send.
//go to authorization,select type i.e Bearer Token
//paste the token in the token input box
//do GET rquest to localhost:3000/rentals
//click send 
// It should return RESULT below in the body of the response


app.post('/rentals', (req, res) => {
    const rentals = { 
        username: req.body.username, 
        receiptNumber: req.body.receiptNumber, 
        orderNumber: req.body.orderNumber,
        movieTitles: req.body.movieTitles,
        rentDate: req.body.rentDate,
        returnDate: req.body.returnDate
        
    };
    rentals.push(rental);
    res.status(201).send(rentals);
});


// UPDATE
// this api end-point update an existing rental object
// for that we get `username` from end-point of rentals to update
app.put('/rentals', authenticateToken, (req, res) => { 
    
    let updated;
    let found = users.find(function (user) {
        return user.username === req.body.username;
    });

    // check if user found
    if (found) {
        updated = {
        username: req.body.username, 
        receiptNumber: req.body.receiptNumber, 
        orderNumber: req.body.orderNumber,
        movieTitles: req.body.movieTitles,
        rentDate: req.body.rentDate,
        returnDate: req.body.returnDate
        };

        // find index of found object from array of users
        let targetIndex = rentals.indexOf(found);
        // replace object from users list with `updated` object
        rentals.splice(targetIndex, 1, updated);

        res.status(200).send(rentals);
    } else {
        res.status(404).send("The user you are trying to update does not exist");
    }
});


// DELETE
// this api end-point delete an existing rental object from array of rentals &
//  match by username find rental and then delete
app.delete('/rentals', authenticateToken, (req, res) => { 

    let found = rentals.find(user => 
    {
        return user.username === req.body.username;

    });

    if (found) {
        let targetIndex = rentals.indexOf(found);
        rentals.splice(targetIndex, 1);
        res.status(200).send("The rental with the username has been deleted");
    }
    else{ 
        res.status(404).send("The rental with the username " + req.body.username + " was not found");
    }
});



console.log("Server listening on port 3000")
app.listen(3000)

