const express=require("express");
const router=express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../utils/MiddleWare")

const UserController=require("../controller/userController");

//GET REQUEST TO RENDER SignUp FORM
router.get("/signUp",UserController.SignUpForm);
//POST REQUEST TO SUBMIT USER DATA mean signup
router.post("/signUp",WrapAsync(UserController.AddUserData));
//GET REQUEST TO RENDER LOGIN FORM
router.get("/login",UserController.LoginForm);

//POST REQUEST TO LOGIN OR VALIDATION
router.post("/login",saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/user/login' ,failureFlash:true }),WrapAsync(UserController.ValidateLogin));
//LogOUt GET REQUEST

router.get("/logout",UserController.logoutUser);


module.exports=router;