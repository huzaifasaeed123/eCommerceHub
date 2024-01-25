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

app.engine('ejs', engine); 

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,"/public")));

//Set EJS AS DEFAULT ENGINE
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
//Set incoming Request Body data to enable JSON FORM
app.use(express.urlencoded({extended:true}));
app.use(express.json());


//Form Data Validation Function BY JOI Libraray at server side validation(not in database)
function validationFormData(req,res,next){
    let validation=ListingSchema.validate(req.body);
    // console.log(validation);
    if(validation.error){
        throw new ExpressError(404,validation.error);
    }
    else{
        next();
    }
}
//Review Data Validation Function BY JOI Libraray at server side
function validationReviewsData(req,res,next){
    let validation=ReviewsSchema.validate(req.body);
    // console.log(validation);
    if(validation.error){
        throw new ExpressError(404,validation.error);
    }
    else{
        next();
    }
}

//Listing INdex Route To Display All listing
app.get("/listings",wrapAsync(async(req,res)=>{
    let allListing=await Listing.find();
    //console.log(allListing);
    res.render("./listing/listing.ejs",{allListing});
 }));
//Create Route Form Get Request To render Form
app.get("/listings/new",(req,res)=>{
    res.render("./listing/newForm.ejs")
    //res.render("newForm.ejs",{})
})
//Add Route To add listing
app.post("/listings",validationFormData,wrapAsync(async(req,res,next)=>{
    // console.log(req.body);
        //ADD DATA TO DATABASE
        let newData=new Listing({
            ...req.body,
            image:{
                filename:"DefaultBy Index",
                url: req.body.image,
            }
        });

        await newData.save().then(()=>{
            console.log("new Data saved");
        })
        res.redirect("/listings");
}));
//Update/Patch Request to edit Form
app.patch("/listings/:id",validationFormData,wrapAsync(async(req,res)=>{
    let id=req.params.id;
    let updateList={
        ...req.body,
        image:{
            filename:"DefaultBy Index",
            url: req.body.image,
        }
        
    }
    await Listing.findByIdAndUpdate(id,updateList,{new:true});
    
    res.redirect("/listings/"+id);
    
}));
//Get Request To render Edit Form
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    let SingleList=await Listing.findOne({_id:id});
   res.render("./listing/editForm.ejs",{SingleList});
}));
//Delete Route to delete single Listing
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//Show Route To Show Data of Individual List
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    let SingleList=await Listing.findById(id).populate("reviews");
   //console.log(SingleList);
   //res.send(SingleList);
   res.render("./listing/SingleList.ejs",{SingleList});
    
}));
//Route To Add Reviews in Specific List
app.post("/listings/:id/reviews",validationReviewsData,wrapAsync(async(req,res)=>{
    let id=req.params.id;
    console.log(req.body);
    const newReview=new Reviews(req.body);
    const listExist=await Listing.findById(id);
    console.log(listExist);

    await listExist.reviews.push(newReview);

    await newReview.save();
    await listExist.save().then(()=>{console.log("Reviews Has Been Submitted")});
    res.redirect("/listings/"+id);
}));
//Route To delete Review From Specific List
app.delete("/listings/:id/reviews/:reviewId",async (req,res)=>{
    let {id,reviewId}=req.params;

    let list=await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    res.redirect("/listings/"+id);
   
});
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

main().then(()=>{
    console.log("DataBase Connection Created");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerence');
}
app.get("/",(req,res)=>{
    res.send("hi I am root APIS");
});
//Server SListning Code
app.listen(5050,()=>{
    console.log("server has been started");
});

