
const router = require("express").Router();
const bcrypt=require("bcrypt");
const User = require("../Models/users");
// create user 
router.post("/create", async (req, res) => {
    try {
      //generate new password
      console.log(req.body);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
  
      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
        console.log(err);
      res.status(500).json(err)
    }
  });
//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });
//  get followers of a user 
router.get("/:id/getFollowers",async (req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        const {followers}=user._doc;
        // console.log(user);
        const followersDoc=await User.find({_id:{$in:followers}});
        res.status(200).json(followersDoc);
    } catch (error) {
        return res.status(500).json(error);
    }
})
//  get followings of a user 
router.get("/:id/getFollowings",async (req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        const {followings}=user._doc;
        const followingsDoc=await User.find({_id:{$in:followings}});
        res.status(200).json(followingsDoc);
    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports = router;