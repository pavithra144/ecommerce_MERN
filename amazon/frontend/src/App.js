import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import ProductPage from "./Pages/ProductPage";
import HomePage from "./Pages/HomePage";
import CartPage from "./Pages/CartPage";
import { useDispatch, useSelector } from "react-redux";
import SigninPage from "./Pages/SigninPage";
import { signOut } from "./actions/userActions";
import RegisterPage from "./Pages/RegisterPage";
import ShippingAddressPage from "./Pages/ShippingAddressPage";
import PaymentMethodPage from "./Pages/PaymentMethodPage";
import PlaceOrderPage from "./Pages/PlaceOrderPage";
import OrderDetailsPage from "./Pages/OrderDetailsPage";
import OrderHistoryPage from "./Pages/OrderHistoryPage";
import ProfilesPage from "./Pages/ProfilesPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProductListAdminPage from "./Pages/ProductListAdminPage";
import EditProductAdminPage from "./Pages/EditProductAdminPage";
import OrderListAdminPage from "./Pages/OrderListAdminPage";

function App(props) {
  //cartitems
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  //userInfo to display at header

  const userSignIn = useSelector((state) => state.userSignIn);

  const { userInfo } = userSignIn;

  const dispatch = useDispatch();

  const signOutHandler = () => {
    dispatch(signOut());
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              amazon
            </Link>
          </div>
          <div>
            <Link to="/cart">
              Cart
              <sup className="badge"> {cartItems.length}</sup>
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name}
                  <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">OrderHistory</Link>
                  </li>
                  <Link to="#signout" onClick={signOutHandler}>
                    Sign out
                  </Link>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  {" "}
                  Admin<i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Product</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Order</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <main>
          <Route path="/cart/:id?" component={CartPage}></Route>
          <Route exact path="/product/:id" component={ProductPage}></Route>
          <Route
            exact
            path="/product/:id/edit"
            component={EditProductAdminPage}
          ></Route>
          <Route path="/signin" component={SigninPage}></Route>
          <Route path="/register" component={RegisterPage}></Route>
          <Route path="/shipping" component={ShippingAddressPage}></Route>
          <Route path="/payment" component={PaymentMethodPage}></Route>
          <Route path="/placeorder" component={PlaceOrderPage}></Route>
          <Route path="/order/:id" component={OrderDetailsPage}></Route>
          <Route path="/orderhistory" component={OrderHistoryPage}></Route>
          <PrivateRoute path="/profile" component={ProfilesPage}></PrivateRoute>
          <AdminRoute
            path="/productlist"
            component={ProductListAdminPage}
          ></AdminRoute>
          <AdminRoute
            path="/orderlist"
            component={OrderListAdminPage}
          ></AdminRoute>
          <Route exact path="/" component={HomePage}></Route>
        </main>
        <footer className="row center">
          <p>@2020 all rights reserved</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
