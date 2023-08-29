//jshint esversion:6
// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
// import ejs from ejs;
// const ejs = require("ejs");
const app = express();
const port = 3000;
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

console.log(process.env.API);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});


const User = new mongoose.model("User",userSchema);



app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});


app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets");
});

app.post("/login",(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email:username}).then((founduser)=>{
        if(!founduser){
            console.log("No User Exist");
        }else{
            if(founduser){
                if(founduser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});






app.listen(port,(req,res)=>{
    console.log(`server is running at ${port}.`);
});
