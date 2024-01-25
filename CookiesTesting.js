const express=require("express");
const app=express();
const session = require('express-session');
const flash = require('connect-flash');


//Session MiddleWare that control and generate all session
app.use(session({
    secret: 'your-secret-key', // a secret key used to sign the session ID cookie
    resave: false,             // do not save the session if it hasn't been modified
    saveUninitialized: true,    // save a session even if it is uninitialized
  }));
  //Flash_Message MiddleWare
app.use(flash());

//We are asving value to our session object in one 
//path andrequest and retirve and use in another path and request
//1st Save a name that send in Query String
app.get("/set",(req,res)=>{
    let {name="Anomnuys"}=req.query;
    req.session.name=name;
    req.flash("success","User registered succesfully");
    res.redirect("/view");
});
//Now retrive and use req.session.name in another path/request
//Clearly see both path show same data and value during one session
app.get("/view",(req,res)=>{
    res.send(req.flash("success"));
})


//Count User Request During One Session Example 
app.get("/cookies",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }
    res.send(req.session.count+" Time A user have been requesting During One Session");
});
//Server SListning Code
app.listen(5050,()=>{
    console.log("server has been started");
});