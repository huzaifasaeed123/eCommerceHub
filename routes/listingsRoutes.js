const express=require("express");
const router=express.Router();
const wrapAsync =require('../utils/WrapAsync');

//Multer To parss Image/File Data

const {storage}=require("../CloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })

const {authenticationCheck,isOwner,validationFormData}=require("../utils/MiddleWare");

const listingController=require('../controller/listingContoller')







//Listing INdex Route To Display All listing
router.get("/",wrapAsync(listingController.index));

//Show data  That User which login
router.get("my/Listings",authenticationCheck,wrapAsync(listingController.myListings));
//Create Route Form Get Request To render Form
router.get("/new",authenticationCheck,listingController.NewListingsForm);
//Add Route To add listing
router.post("/",authenticationCheck,upload.single('image'),validationFormData,wrapAsync(listingController.AddNewListings));
//Update/Patch Request to edit Form
router.patch("/:id",authenticationCheck,isOwner,upload.single('image'),validationFormData,wrapAsync(listingController.EditListings));
//Get Request To render Edit Form
router.get("/:id/edit",authenticationCheck,isOwner,wrapAsync(listingController.EditListingsForm));
//Delete Route to delete single Listing
router.delete("/:id",authenticationCheck,isOwner,wrapAsync(listingController.DeleteListings));
//Show Route To Show Data of Individual List
router.get("/:id",wrapAsync(listingController.ShowList));

module.exports=router;