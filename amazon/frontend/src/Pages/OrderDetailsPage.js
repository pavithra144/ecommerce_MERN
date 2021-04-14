import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deliverOrderAdmin,
  detailsOrder,
  payOrder,
} from "../actions/orderActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import { PayPalButton } from "react-paypal-button-v2";
import {
  ORDER_CREATE_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

export default function OrderDetailsPage(props) {
  const [sdkReady, setSdkReady] = useState(false);
  const orderId = props.match.params.id;
  //11, 12 lines => accessing our store
  const orderDetails = useSelector((state) => state.orderDetails); // state.orderDetails comes from combineReducer object name in store.js
  const { loading, order, error } = orderDetails; // loading,order,error comes from orderReducer

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  const orderPay = useSelector((state) => state.orderPay);
  const {
    success: successPay,
    error: errorPay,
    loading: loadingPay,
  } = orderPay;

  const deliverOrder = useSelector((state) => state.deliverOrder);
  const {
    success: successDeliver,
    error: errorDeliver,
    loading: loadingDeliver,
  } = deliverOrder;

  const deliverOrderHandler = () => {
    // todo
    dispatch(deliverOrderAdmin(order._id));
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get("/api/config/paypal"); //here data contains clientId from server
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    console.log(order);
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_CREATE_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, order, orderId, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Order Summary : </h1>
      <p> Order Id: {order._id}</p>
      <div className="row top"></div>
      <div className="col-2">
        <ul>
          <li>
            <div className="card card-body">
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.shippingAddress.fullName}
                <br />
                <strong>Address:</strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at: {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </div>
          </li>
          <li>
            <div className="card card-body">
              <h2>Payment Method</h2>
              <p>{order.paymentMethod}</p>
              {order.isPaid ? (
                <MessageBox variant="success">{order.paidAt}</MessageBox>
              ) : (
                <MessageBox variant="danger">Not paid</MessageBox>
              )}
            </div>
            <li>
              <div className="card card-body">
                <h2>OrderItems</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          />
                        </div>
                      </div>
                      <div className="min-30">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>
                      <div>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </li>
        </ul>
      </div>
      <div className="col-1">
        <ul>
          <li>
            <h2>Order summary</h2>
          </li>
          <li>
            <div className="row">
              <div>
                Items
                <div>${order.itemsPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="row">
              <div>
                Shipping
                <div>${order.shippingPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="row">
              <div>
                Tax
                <div>${order.taxPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="row">
              <div>
                Total <div>${order.totalPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          {!order.isPaid && (
            <li>
              {!sdkReady ? (
                <LoadingBox />
              ) : (
                <>
                  {errorPay && (
                    <MessageBox variant="danger">{errorPay}</MessageBox>
                  )}
                  {loadingPay && <LoadingBox />}
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  ></PayPalButton>
                </>
              )}
            </li>
          )}
          {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <li>
              {loadingDeliver && <LoadingBox></LoadingBox>}
              {errorDeliver && (
                <MessageBox variant="danger">{errorDeliver}</MessageBox>
              )}

              <button
                type="button"
                className="primary block"
                onClick={deliverOrderHandler}
              >
                Deliver Order
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
