const mongoose = require("mongoose");
const Reviews=require("./Reviews");
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default:"Default FileName"
        },

        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) => {
                return v === "" ?
                    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    : v;

            }

        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
    }
});
// MiddleWare that trigger when findByIdAndDelete query excuted.this function trigger middleware consist of FindOneAndDelete function
//Place All middleWare after Models
listSchema.post("findOneAndDelete",async (list)=>{
    console.log("Post MiddleWare Ecuted");
    if(list.reviews.length!=0){
        await Reviews.deleteMany({_id:{$in:list.reviews}});
        console.log("After deleteion of All Reviews");
   }
})
const Listing = mongoose.model("Listing", listSchema);
module.exports = Listing;