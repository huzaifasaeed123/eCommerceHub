

const User=require("../models/user");

module.exports.SignUpForm=async(req,res)=>{
    res.render("./user/signUp.ejs");
}

module.exports.LoginForm=async(req,res)=>{
    res.render("./user/login.ejs");
};

module.exports.AddUserData=async(req,res,next)=>{

    //console.log(req.body);
    try{
        let newUser=new User({
            email: req.body.email,
            username: req.body.username,
        });
        let registeredUser= await User.register(newUser,req.body.password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            else{
                req.flash("success","User Have Been Created Suucessfully");
                res.redirect("/listings");
            }
        })   
    }
    catch(err){
        req.flash("error","Username Already Exist");
        console.log(err);
        res.redirect("/user/signUp");
    } 
};

module.exports.ValidateLogin=async(req,res)=>{
    console.log("Succesfully login");
        req.flash("success","WelCome Back To Website,You Are LOGIN Succesfully");
        //console.log(res.locals.redirectURL2);
        if(!res.locals.redirectURL2){
           return  res.redirect("/listings");
        }
        res.redirect(res.locals.redirectURL2);   
}


module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else
        {
            req.flash("success","You Are Succesfully LogOut");
            res.redirect("/listings");
        }
    })
};