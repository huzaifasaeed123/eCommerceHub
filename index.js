const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listings");
const Reviews=require("./models/Reviews");
const path=require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync =require('./utils/WrapAsync');
const ExpressError =require('./utils/ExpressError');
const ListingSchema =require('./utils/ListingSchema');
const ReviewsSchema =require('./utils/ReviewsSchema');

const session = require('express-session');
const flash = require('connect-flash');
//dotENV
require('dotenv').config()
//console.log(process.env)
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT; 
const dbname=process.env.DB_NAME;

const mongourl = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbname}?authSource=admin`;

const listingRoutes=require("./routes/listingsRoutes");
const ReviewsRoutes=require("./routes/ReviewsRoutes");
const UserRoutes=require("./routes/UserRoutes.js");

const passport =require("passport");
const LocalStragety=require("passport-local");
const User= require("./models/user.js");



const SessionOption={
    secret: 'your-secret-key', // a secret key used to sign the session ID cookie
    resave: false,             // do not save the session if it hasn't been modified
    saveUninitialized: true,    // save a session even if it is uninitialized
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true,
    }
  }
//Session MiddleWare that control and generate all session
app.use(session(SessionOption));
  //Flash_Message MiddleWare
app.use(flash());

//Passport MiddleWare To initilize Passpost For Our Session
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStragety(User.authenticate()));



///middleWare to set flast as a global and acces at any ejs template and any route
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
   // console.log(res.locals.currUser);
    next();
})

app.engine('ejs', engine); 

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,"/public")));

//Set EJS AS DEFAULT ENGINE
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
//Set incoming Request Body data to enable JSON FORM
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.use("/listings",listingRoutes);
app.use("/listings/:id/reviews",ReviewsRoutes);
app.use("/user",UserRoutes);

//Error Handler FOr All Page Not Found

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

//Middle Ware To handle Error
app.use((err,req,res,next)=>{
    let {statusCode=505,message="Something Went Wrong"}=err;
    // console.log(message+"huzaifa saeed");
    // res.status(statusCode).send(message);
    // res.send("Something Wrong Occur,Please Try Again And Error MEssage is:: "+err.message);

    // render Error.ejs
    res.status(statusCode).render("error.ejs",{message});
});



//mongoose Basic Setup

// main().then(()=>{
//     console.log("DataBase Connection Created");
// })
// .catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongourl);
}
app.get("/",(req,res)=>{
    res.send("hi I am root APIS");
});
//Server SListning Code
app.listen(27017,()=>{
    console.log("server has been started");
});

