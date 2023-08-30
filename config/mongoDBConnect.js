const mongoose = require("mongoose");

const mongoDBConnect = async function() {
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Connected to", dbConnect.connection.name);
  } 
  catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = mongoDBConnect;