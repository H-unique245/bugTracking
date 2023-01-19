const express = require("express")
const mongoose= require("mongoose");
const UserModel= require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt= require("jsonwebtoken");
const cors = require("cors");
const app = express();
const saltRounds = 10;
require("../db")

app.use(express.json())
app.use(cors());
//normal start 
app.get("/", (req, res) => {
    res.send("Welcome to bugs Backend")
})

// signup route
app.post("/signup", async (req, res) => {
    const {email, password} = req.body;
    const checkUser = await UserModel.findOne({email})
   if(checkUser){
    res.send("User is already registered!")
   }
    try{
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            const user = await new UserModel({email,password:hash})
            user.save()
            res.send("Sign up Successfully!!")
        });
    }
   catch(err){
        console.log(err)
        res.send("Something went wrong, pls try again later")
   }
})


// login route
app.post("/login", async(req,res)=>{
    const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });

        if (user != null) {
        //   console.log("User", user, password);
          const check_Pass = await bcrypt.compare(password, user.password);
          if (user.email === email && check_Pass) {
            // console.log("reg_user",email,password)
            let token = jwt.sign(
              {
                userID: user?._id,
                email: user?.email,
              },
              "UNI245",
              { expiresIn: "7d" }
            );
            res.status(200).send({ message: "User Logged in Succefully!!", token: token });
          } else {
            res.status(401).send({ message: "Incorrect! Enter correct password!!" });
          }
        } else {
          res.status(405).send({ message: "User not found with this email, need to register!" });
        }
      }
})

// mongoose.connect("mongodb://0.0.0.0:27017/bugsTracker").then(() => {
mongoose.connect(DB_URL).then(() => {
  app.listen(8080, () => {
    console.log(`Server Started @ http://localhost:8080`);
  });
});