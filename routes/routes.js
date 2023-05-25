const express = require('express');
const UserModel = require('../models/user-model');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../auth");

const corsOptions = {
    origin: '*', // Replace with the allowed origin(s)
    methods: ['GET', 'POST' , 'PUT' , 'DELETE' , 'PATCH' , 'OPTIONS'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify the allowed headers
  };
  

const router = express.Router()

router.use(cors(corsOptions));


//Home Route
router.get('/',(req,res)=>{
    let responseText = "Hello World";
    res.send(responseText);
});

//Register a user Method
router.post('/register',async (req,res)=>{
    const data = new UserModel({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        password:req.body.password
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

// Login a user
router.post('/login', async (request, response) => {
    try {
      // check if email exists
      const user = await UserModel.findOne({ email: request.body.email });
  
      if (!user) {
        return response.status(404).send({
          message: "Email not found",
          code:404
        });
      }
  
      // compare the password entered and the hashed password
      user.comparePassword(request.body.password, function (error, passwordCheck) {
        if (error) {
          return response.status(500).send({
            message: "Error comparing passwords",
          });
        }
  
        // check if password matches
        if (!passwordCheck) {
          return response.status(400).send({
            message: "Passwords do not match",
            code : 400
          });
        }
  
        // create JWT token
        const token = jwt.sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        );
  
        response.status(200).send({
          message: "Login Successful",
          email: user.email,
          token,
        });
      });
    } catch (error) {
      response.status(500).send({
        message: "Error finding user",
        error,
      });
    }
  });
  
  
//get all method
router.get('/getAll', (req,res) => {
    res.send("Get all API");
})

//Get by ID Method
router.get('/getOne/:id',(req,res)=>{
    res.send('Get by ID API');
})

//Update by ID Method
router.patch('/update/:id',(req,res)=>{
    res.send("Update by ID API");
})

//Delete by ID method
router.delete('/delete/:id',(req,res)=>{
    res.send("Delete by ID API");
})

module.exports = router