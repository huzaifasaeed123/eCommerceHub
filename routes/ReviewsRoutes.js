const express=require("express");
const router=express.Router({mergeParams:true});
const {authenticationCheck,validationReviewsData}=require("../utils/MiddleWare");
const reviewController=require("../controller/reviewController");

//Route To Add Reviews in Specific List
router.post("/",authenticationCheck,validationReviewsData,reviewController.AddReviews);
//Route To delete Review From Specific List
router.delete("/:reviewId",authenticationCheck,reviewController.DeleteReviews);
module.exports=router;