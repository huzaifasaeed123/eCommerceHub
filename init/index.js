const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/ecommerence";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {

  let updatedInitData= initData.data.map((obj)=>({...obj, owner:"658e5af566758aee9db155ba"}));
  await Listing.deleteMany({});
  await Listing.insertMany(updatedInitData);
  console.log("data was initialized");
};

initDB();