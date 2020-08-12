//jshint esversion:6
require('dotenv').config();
const exp=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const encrypt= require('mongoose-encryption');


const app= exp();

app.use(bodyParser.urlencoded({extended:true}));
app.use(exp.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });


const userSchema= new mongoose.Schema ({
  email: String,
  password: String
});

//authentication code

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});


const userModel=mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser=new userModel({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});


app.post("/login", function(req,res){

    const username=req.body.username;
    const password=req.body.password;
    userModel.findOne({email:username},function(err, result){
      if(err){
        console.log(err);
      }else{
        if(result){
          if(result.password === password){
            res.render("secrets");
          }else{
            res.send("error");
          }
        }
      }
    });
});




app.listen(3000);
