require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const dotenv = require('dotenv');
// dotenv.config();

app.use(express.json());//conf. middleware instead of bodyparser

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


  //root route      
app.get('/', (req, res) => { 
    res.send("Welcome");  
});

////usersSignup
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
        
    } catch {
        res.status(500).send();
    }
});

/////users/login
app.post('/users/login', async(req, res) => {
    const user = users.find(user => user.username === req.body.username);
    console.log("Got to the POST User/LOGIN");
    if(user == null) {
        return res.status(404).send("User does not exist");
    } try {
            bcrypt.compare(req.body.password, user.password, function(err, same){
                if(err){
                    console.log(err)
                    res.status(500).send("Soemthing went wrong, please try again");
                }
                if(same){
                    const username = req.body.username;
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    res.json({ accessToken: accessToken });
                }else{
                    res.status(401).send("Username and Password Combination does not match")
                }
            })
    } catch {
        res.status(500).send("user not allowed");
    }
});


/////authorization using authenticateToken
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


//////users route
app.post('/users', (req, res) => {
    const user = { 
                username: req.body.username, 
                password: req.body.password 
            };
            users.push(user);
            res.status(201).send(users);
        });


app.get('/users',  authenticateToken, (req, res) => { 
    res.send(users);  //get all users

});


 app.get('/users', authenticateToken, (req, res) => { //get specific users
    const username = req.body.username;//i.e username of 1 of the user inside the user array
    const userName = users.filter(user => user.username === username);//new username
    if(!userName) {
        return res.send("Username are not allowed");    
    }
    res.json(userName);
});



app.put('/users', authenticateToken, (req, res) => { 
    let updated;
    let found = users.find(function (user) {
        return user.username === req.body.username;
    });
    if (found) {
        updated = {
            username: req.body.username, 
            password: req.body.password 
        };
        let targetIndex = users.indexOf(found);
        users.splice(targetIndex, 1, updated);

        res.status(200).send(users);
    } else {
        res.status(404).send("The user you are trying to update does not exist");
    }
});


app.delete('/users', authenticateToken, (req, res) => { 
    let found = users.find(user => {
        return user.username === req.body.username;
    });
    if (found) {
        let targetIndex = users.indexOf(found);
        users.splice(targetIndex, 1);
        res.status(200).send("The user has been deleted");
    }else{ 
        res.status(404).send("The user with the username " + req.body.username + " was not found");
    }
});



// MOVIES 
app.post('/movies', (req, res) => {  //admin
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


app.get('/movies', authenticateToken, (req, res) => { 
    res.send(movies);  
});

app.get('/moviesTitle', authenticateToken, (req, res) => {
    const title = req.body.title;
    const movie = movies.filter(movie => movie.title === title);
    if(movie.length == 0) {
        return res.status(404).send("No movie was found with this title");    
    }
    res.status(200).json(movie);
});

app.put('/movies', authenticateToken, (req, res) => { //admin
    let updated;
    let found = movies.find(function (movie) {
        return movie.title === req.body.title;
    });
    if (found) {
        updated = {
            title: req.body.title,
            actor: req.body.actor,
            producer: req.body.producer,
            rating: req.body.rating
        };
        let targetIndex = movies.indexOf(found);
        movies.splice(targetIndex, 1, updated);

        res.status(200).send(movies);
    } else {
        res.status(404).send("The movie you are trying to update does not exist");
    }
});


app.delete('/movies', authenticateToken, (req, res) => { //admin
    let found = movies.find(movie => {
        return movie.title === req.body.title;
    });
    if (found) {
        let targetIndex = movies.indexOf(found);
        movies.splice(targetIndex, 1);
        res.status(200).send("The movie has been deleted");
    }else{ 
        res.status(404).send("The movie with the title " + req.body.title + " was not found");
    }
});


// RENTALS 
app.post('/rentals', (req, res) => { //admin
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

app.get('/rentals', authenticateToken, (req, res) => { //get all rentals
    res.send(rentals);    
});


app.get('/rentals', authenticateToken, (req, res) => {
        const username = req.body.username;        
        const rentalUser = rentals.filter(rental => rental.username === username);
        if(!rentalUser) {
            return res.send("User has no rental");    
        }
        res.json(rentalUser);
    });


app.put('/rentals', authenticateToken, (req, res) => { 
    let updated;
    let found = users.find(function (user) {
        return user.username === req.body.username;
    });
    if (found) {
        updated = {
        username: req.body.username, 
        receiptNumber: req.body.receiptNumber, 
        orderNumber: req.body.orderNumber,
        movieTitles: req.body.movieTitles,
        rentDate: req.body.rentDate,
        returnDate: req.body.returnDate
        };

        let targetIndex = rentals.indexOf(found);
        rentals.splice(targetIndex, 1, updated);

        res.status(200).send(rentals);
    } else {
        res.status(404).send("The user you are trying to update does not exist");
    }
});


app.delete('/rentals', authenticateToken, (req, res) => { 
    let found = rentals.find(user => {
        return user.username === req.body.username;
    });
    if (found) {
        let targetIndex = rentals.indexOf(found);
        rentals.splice(targetIndex, 1);
        res.status(200).send("The rental with the username has been deleted");
    }else{ 
        res.status(404).send("The rental with the username " + req.body.username + " was not found");
    }
});

//?????
// const port = process.env.PORT;
// console.log("Server listening on port ${PORT}")
// app.listen(${PORT})



console.log("Server listening on port 3000")
app.listen(3000)

