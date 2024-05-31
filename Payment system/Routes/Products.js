const express = require('express');
const Product = require('../Models/Products');
const router = express.Router();
router.post("/createproduct",async (req,res)=>{
    try {
        const newP=new Product({
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
        })
        const product=await newP.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports=router;