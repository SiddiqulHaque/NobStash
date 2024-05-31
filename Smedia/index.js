const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
dotenv.config();
try {
    mongoose.connect(process.env.MONGODB_URI, {
        
      });
      console.log("connected successfully");
} catch (error) {
    console.log("unable to connect");
    return error;
}

app.use(express.json());
app.use("/api/users",userRoute );
app.listen(8000, () => {
  console.log("server is listening on port 8000");
});
