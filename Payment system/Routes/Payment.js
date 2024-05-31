const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Transaction = require("../Models/Transaction");
const Order = require("../Models/Orders");
const Product = require("../Models/Products");

// Setup Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Create Order API
router.post("/create-order", async (req, res) => {
  const { product, quantity } = await req.body;
  const productDoc = await Product.findById(product);
  const totalPrice = productDoc.price * quantity;
  const order = new Order({ product, quantity, totalPrice });

  try {
    await order.save();
    const options = {
      amount: totalPrice * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `order_${order._id}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    console.log(razorpayOrder);
    const transaction = new Transaction({
      order: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPrice,
    });

    await transaction.save();
    res.status(201).json({ razorpayOrderId: razorpayOrder.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Verify Payment API
router.post("/verify-payment", async (req, res) => {
  const { razorpayOrderId } = req.body;
  try {
    const transaction = await Transaction.findOne({ razorpayOrderId });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    transaction.status = "success";
    await transaction.save();

    const order = await Order.findById(transaction.order);
    order.status = "paid";
    await order.save();

    res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
