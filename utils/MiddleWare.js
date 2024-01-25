
const ExpressError =require('./ExpressError');
const ListingSchema =require('./ListingSchema');
const ReviewsSchema =require('./ReviewsSchema');
const Listing=require("../models/listings");
const WrapAsync = require('./WrapAsync');

module.exports.authenticationCheck= (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.session.redirectURL2=req.originalUrl;
        // console.log(res.session.redirectURL2);
        // console.log(req.originalUrl);
        req.flash("error","You Must Be Logged In To Access");
        res.redirect("/user/login");
    }
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectURL2){
        res.locals.redirectURL2=req.session.redirectURL2;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let id=req.params.id;
    let SingleList=await Listing.findOne({_id:id}).populate("reviews").populate("owner");
    
    //console.log(SingleList);
    //Check whther user created this list or not
    if(req.user && SingleList.owner.username== req.user.username){
        next();
    }else{
        req.flash("error","You Dont Have Acces to Edit List because You have not created");
        res.redirect("/listings/"+id)
    }
};

//Form Data Validation Function BY JOI Libraray at server side validation(not in database)
module.exports.validationFormData=WrapAsync(async(req,res,next)=>{
    let validation=ListingSchema.validate(req.body);
    // console.log(validation);
    if(validation.error){
        throw new ExpressError(404,validation.error);
    }
    else{
        next();
    }
});
//Review Data Validation Function BY JOI Libraray at server side
module.exports.validationReviewsData=(req,res,next)=>{
    let validation=ReviewsSchema.validate(req.body);
    // console.log(validation);
    if(validation.error){
        throw new ExpressError(404,validation.error);
    }
    else{
        next();
    }
};