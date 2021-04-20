import express from "express";
import data from "../data.js";
import User from "../models/UserModels.js";
import bcrypt from "bcryptjs";
import { generateToken, isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";

const userRouter = express.Router();

userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ "seller.rating": -1 })
      .limit(3);
    res.send(topSellers);
  })
);

//expressAsyncHandler is to show the error message on server side ( localhost:5000)
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //user.password is hashed password
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = await User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(createdUser),
    });
  })
);

userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    // console.log(user);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(updatedUser),
    });
  })
);

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.email === "admin1@example.com") {
        res.status(404).send({ message: "Can not delete Admin" });
        return;
      }
      const deletedUser = await user.remove();
      res.send({ message: "user deleted", deletedUser });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    // const user = await User.findById(userId)
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = req.body.isSeller || user.isSeller;
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      user.isAdmin =
        req.body.isAdmin === user.isAdmin ? user.isAdmin : req.body.isAdmin;

      const updatedUser = await user.save();
      res.send({ message: "User updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  })
);
export default userRouter;
