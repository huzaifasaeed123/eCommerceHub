const Listing = require("../models/listings")

module.exports.index = async (req, res) => {
    let allListing = await Listing.find();
    //console.log(allListing);
    res.render("./listing/listing.ejs", { allListing });
};

module.exports.myListings=async (req,res)=>{
     let allListingP=await Listing.find({}).populate({
        path: 'owner',
        match: { username: req.user.username }, // Filter by the owner's username
        select: 'username' // Optional: Only select the 'username' field from the owner
      });
      let allListing=[];
    for(let listings of allListingP)
    {
        if(listings.owner!=null){
            if(listings.owner.username==req.user.username){

                allListing.push(listings)
    
            }
        }
       

    }
      
    // let listings = await Listing.find({
    //     'owner.username': { $regex: req.user.username, $options: 'i' }
    //   });
     
    //console.log(allListing);
    res.render("./listing/listing.ejs", { allListing });
   // res.send(listings);
}
module.exports.NewListingsForm = (req, res) => {
    console.log(req.user);
    res.render("./listing/newForm.ejs")
    //res.render("newForm.ejs",{})
}


module.exports.AddNewListings = async (req, res, next) => {
    console.log(req.body);
    //ADD DATA TO DATABASE
    if (typeof req.file !== "undefined") {
        let path = req.file.path;
        let filename = req.file.originalname;
        //console.log(req.body);
        let newData = new Listing({
            ...req.body,
            image: {
                filename: filename,
                url: path,
            },
            owner: req.user._id,
        });

        await newData.save().then(() => {
            // console.log("new Data saved");
        })

    }
    else {
        let newData = new Listing({
            ...req.body,
            owner: req.user._id,
        });
        await newData.save().then(() => {
            // console.log("new Data saved");
        })
    }
    

    req.flash("success", "Listing Has Been Created succesfully");
    res.redirect("/listings");
};


module.exports.EditListingsForm = async (req, res) => {
    let id = req.params.id;
    let SingleList = await Listing.findOne({ _id: id }).populate("reviews").populate("owner");
    //console.log(SingleList);
    //Check Whther list exist or not for that specific id provided by user
    if (!SingleList) {
        req.flash("error", "Listings You Want to Edit Has Been Deleted");
        return res.redirect("/listings");
    }
    else {
        return res.render("./listing/editForm.ejs", { SingleList });
    }

};

module.exports.EditListings = async (req, res) => {
    let id = req.params.id;

    // console.log(req.file);
    // console.log(req.body);
    if (typeof req.file !== "undefined") {
        console.log("Huzaifa");
        console.log(req.body);
        let path = req.file.path;
        let filename = req.file.originalname;
        let updateList = {
            ...req.body,
            image: {
                filename: filename,
                url: path,
            }

        }
        await Listing.findByIdAndUpdate(id, updateList);

    }
    else {

        let prevLst = await Listing.findById(id);

        await Listing.findByIdAndUpdate(id, {
            ...req.body,
            image: {
                filename: prevLst.image.filename,
                url: prevLst.image.url
            }
        });
    }


    req.flash("success", "Updated succesfully");
    return res.redirect("/listings/" + id);
};


module.exports.DeleteListings = async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Delete Listing succesfully");
    return res.redirect("/listings");
};


module.exports.ShowList = async (req, res) => {
    let id = req.params.id;
    let SingleList = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'ReviewAuthor',
                model: 'User' // Replace 'User' with the actual model name of your User schema
            }
        })
        .populate('owner');
    // console.log(SingleList.owner.username);
    // console.log(res.locals.currUser);
    if (!SingleList) {
        req.flash("error", "Listings You Want to View Has Been Deleted");
        res.redirect("/listings");
    }
    //console.log(SingleList);
    //res.send(SingleList);
    else {
        //console.log(SingleList);
        res.render("./listing/SingleList.ejs", { SingleList });
    }
};
