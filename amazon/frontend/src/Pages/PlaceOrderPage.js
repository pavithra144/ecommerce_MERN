import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";
import CheckOutSteps from "../components/CheckOutSteps";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";

export default function PlaceOrderPage(props) {
  const cart = useSelector((state) => state.cart);

  //if user didnt make payment,
  if (!cart.paymentMethod) {
    props.history.push("/payment");
  }

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;

  const toPrice = (num) => Number(num.toFixed(2));
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
  };

  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, order, props.history, success]);

  return (
    <div>
      <CheckOutSteps step1 step2 step3 step4 />
      <div className="row top"></div>
      <div className="col-2">
        <ul>
          <li>
            <div className="card card-body">
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {cart.shippingAddress.fullName}
                <br />
                <strong>Address:</strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
            </div>
          </li>
          <li>
            <div className="card card-body">
              <h2>Payment Method</h2>
              <p>{cart.paymentMethod}</p>
            </div>
            <li>
              <div className="card card-body">
                <h2>OrderItems</h2>
                <ul>
                  {cart.cartItems.map((item) => (
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
                <div>${cart.itemsPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="row">
              <div>
                Shipping
                <div>${cart.shippingPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="row">
              <div>
                Tax
                <div>${cart.taxPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="row">
              <div>
                Total <div>${cart.totalPrice.toFixed(2)}</div>
              </div>
            </div>
          </li>
          <li>
            <button
              type="button"
              onClick={placeOrderHandler}
              className="primary block"
              disabled={cart.cartItems.length === 0}
            >
              Place order
            </button>
          </li>
          {loading && <LoadingBox />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}
        </ul>
      </div>
    </div>
  );
}
