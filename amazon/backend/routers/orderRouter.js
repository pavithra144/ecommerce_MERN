import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModels.js";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

const orderRouter = express.Router();

orderRouter.get(
  "/myorders",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user_id });
    res.send(orders);
    console.log(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // '/' means /api/orders
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Your cart is empty" });
    }
    const order = new Order({
      seller: req.body.orderItems[0].seller,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      //To get who the user is ordering, we are using a middleware in utils named 'isAuth' above
      user: req.user._id,
    });

    const createdOrder = await order.save();
    res.status(201).send({ message: "New Order created", order: createdOrder });
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order not Found" });
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: "order paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

//admin view
orderRouter.get(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const sellerFilter = seller ? { seller } : {};
    const orders = await Order.find({ ...sellerFilter }).populate(
      "user",
      "name"
    ); //going to order model which has user field, which is in ref to user and so getting name from the user collection
    res.send(orders);
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deletedOrder = await order.remove();
      res.send({ message: "Order Deleted", order: deletedOrder });
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: "Order delivered", order: updatedOrder });
    } else {
      res.status.apply(404).send({ message: "Order not found" });
    }
  })
);
export default orderRouter;
