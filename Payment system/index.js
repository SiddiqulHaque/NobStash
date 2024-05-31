const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const ProductRoute=require("./Routes/Products");
const PaymentRoute=require("./Routes/Payment")
try {
    mongoose.connect(process.env.MONGODB_URI, {
        
      });
      console.log("connected successfully");
} catch (error) {
    console.log("unable to connect");
    return error;
}

app.use(express.json());
app.use("/api/product",ProductRoute)
app.use("/api/payment",PaymentRoute);
app.listen(8000, () => {
  console.log("server is listening on port 8000");
});
