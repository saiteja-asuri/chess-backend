let express = require('express');
const cors = require('cors');
require('dotenv').config();
const auth = require("./auth");

//Importing the routes
const routes = require('./routes/routes');

//Using Mongoose to connect with the db
let mongoose = require('mongoose');

const mongoString = process.env.URI

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error' , (error)=>{
    console.log(error)
})

database.once('connected',()=>{
    console.log('Database Connected');
})


//Routes

const corsOptions = {
    origin: '*', // Replace with the allowed origin(s)
    methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify the allowed headers
  };

let app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use('/',routes);


app.listen(5000,()=>{
    console.log(`Server running on ${"http://localhost:5000/"}`);
});