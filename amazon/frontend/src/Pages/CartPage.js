import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../actions/cartActions";
import { MessageBox } from "../components/MessageBox";
import { Link } from "react-router-dom";

export default function CartPage(props) {
  const productId = props.match.params.id;
  console.log(props.history);

  //searching for "?qty=qty" value eg: ?qty=6
  const qty = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;

//the below clg shows the product id
  // console.log(props.location.search.split("=")[1]);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  //dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    if (productId) {
      dispatch(addTocart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  //remove cart
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  //checkout
  const checkOutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  };

  return (
    <div className="row top">
      <div className="col-2">
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <MessageBox>
            Your cart is empty <Link to="/">Go shopping</Link>{" "}
          </MessageBox>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.product}>
                <div className="row">
                  <div>
                    <img src={item.image} alt={item.name} className="small" />
                  </div>
                </div>
                <div className="min-30">
                  <Link to={`/product/${item.product}`}></Link>
                </div>
                <div>
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addTocart(item.product, Number(e.target.value)))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>${item.price}</div>
                <div>
                  <button onClick={() => removeFromCartHandler(item.product)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul>
            <li>
              <h2>
                Subtotal (
                {cartItems.reduce((accum, currVal) => accum + currVal.qty, 0)}
                items ): $
                {cartItems.reduce(
                  (accum, currVal) => accum + currVal.price * currVal.qty,
                  0
                )}
              </h2>
            </li>
            <li>
              <button
                type="button"
                onClick={checkOutHandler}
                className="primary block"
                disabled={cartItems.length === 0}
              >
                Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
