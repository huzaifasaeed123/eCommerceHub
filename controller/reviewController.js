const Listing=require("../models/listings");
const Reviews=require("../models/Reviews");


module.exports.AddReviews=async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
    // console.log(req.body);
    // console.log(req.user);
    const newReview=new Reviews({
        ...req.body,
        ReviewAuthor: req.user._id,
    });
    //console.log(newReview);
    const listExist=await Listing.findById(req.params.id);
    //console.log(listExist);

    await listExist.reviews.push(newReview);

    await newReview.save();
    await listExist.save().then(()=>{console.log("Reviews Has Been Submitted")});
    req.flash("success","Comment Has Been Created succesfully");
    res.redirect("/listings/"+id);
};


module.exports.DeleteReviews=async (req,res)=>{
    let {id,reviewId}=req.params;
    //Check Whther user is owner of comment or not
    let reviewOwner=await Reviews.findById(reviewId).populate("ReviewAuthor");
    if(req.user.username==reviewOwner.ReviewAuthor.username){
        let list=await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Comment Deleted succesfully");
     return res.redirect("/listings/"+id);
    }
    else{
        req.flash("error","You Dont Have Access to Delete This Comment")
        return res.redirect("/listings/"+id);
    }
   
}