//Middleware
import jwt, { decode } from "jsonwebtoken";

export const generateToken = (user) => {
  //signs electronically and gets encoded
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "somethingsecret",
    { expiresIn: "30d" }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  //if an authorizised user,
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // token => bearer xxxxxxx = shows(slices) only the xxxxxx part (token part)
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin token" });
  }
};
