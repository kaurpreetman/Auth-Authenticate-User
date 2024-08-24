const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();

const userModel=require("./models/userModel")
const bcrypt=require('bcrypt');
const path=require('path');
const jwt=require('jsonwebtoken');
app.use(cookieParser());
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
   res.render("index");
})
app.post("/create",(req,res)=>{
    let {username,password,email,age}=req.body;
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async (err,hash)=>{
                const user=await userModel.create({
                    username,
                    password:hash,
                    email,
                    age
                })
               let token= jwt.sign({email},"secretkey");
               res.cookie("token",token);
                res.render("login");
            })
        })
        
    
 })

app.post("/logout",(req,res)=>{
    res.cookie("token","");
    res.render("/");
})
app.post("/login",async (req,res)=>{
   let {email,password}=req.body;
   let user= await userModel.findOne({email});
   if(!user) return res.send("Email or Password is wrong");

   bcrypt.compare(password,user.password,(err,result)=>{
    if(result){
        let token= jwt.sign({email:user.email},"secretkey");
        res.cookie("token",token);
        return res.send("Logged in");
    }
     return res.send("Wrong");
   });

    
})
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})