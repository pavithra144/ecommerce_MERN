import express from "express";
import mongoose from "mongoose";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import path from "path";
import dotenv from "dotenv";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/FileUploadRouter.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/amazon", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/uploads", uploadRouter);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb"); //sb = sandbox
});

app.get("/api/config/google", (req, res) => {
  res.send(process.env.GOOGLE_API || "");
});

const __dirname = path.resolve(); // returns current folder
app.use("/ uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("server is ready");
});
//err catcher - shows error message in frontend
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("server in port");
});
