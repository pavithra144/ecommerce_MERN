import React, { useEffect, useState } from "react";
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
import UserListAdminPage from "./Pages/UserListAdminPage";
import UserEditAdminPage from "./Pages/UserEditAdminPage";
import SellerRoute from "./components/SellerRoute";
import SellerPage from "./Pages/SellerPage";
import SearchBox from "./components/SearchBox";
import SearchPage from "./Pages/SearchPage";
import { listProductCategories } from "./actions/productActions";
import { LoadingBox } from "./components/LoadingBox";
import { MessageBox } from "./components/MessageBox";
import MapPage from "./Pages/MapPage";

function App(props) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  //cartitems
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  //userInfo to display at header

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = productCategoryList;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);
  const signOutHandler = () => {
    dispatch(signOut());
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link className="brand" to="/">
              amazon
            </Link>
          </div>
          <div>
            <Route
              render={({ history }) => (
                <SearchBox history={history}> </SearchBox>
              )}
            ></Route>
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

            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#seller">
                  Seller<i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist/seller">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Orders</Link>
                  </li>
                </ul>
              </div>
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
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <aside className={sidebarIsOpen ? "open" : ""}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategory ? (
              <LoadingBox />
            ) : errorCategory ? (
              <MessageBox variant="danger">{errorCategory}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>
          <Route path="/seller/:id" component={SellerPage}></Route>
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
          <Route
            path="/search/name/:name?"
            component={SearchPage}
            exact
          ></Route>
          <Route
            path="/search/category/:category"
            component={SearchPage}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name"
            component={SearchPage}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
            component={SearchPage}
            exact
          ></Route>
          <PrivateRoute path="/profile" component={ProfilesPage}></PrivateRoute>
          <PrivateRoute path="/map" component={MapPage}></PrivateRoute>
          <AdminRoute
            path="/productlist"
            component={ProductListAdminPage}
            exact
          ></AdminRoute>
          <AdminRoute
            path="/productlist/pageNumber/:pageNumber"
            component={ProductListAdminPage}
            exact
          ></AdminRoute>
          <AdminRoute
            path="/orderlist"
            component={OrderListAdminPage}
            exact
          ></AdminRoute>
          <AdminRoute
            path="/userlist"
            component={UserListAdminPage}
          ></AdminRoute>
          <AdminRoute
            path="/user/:id/edit"
            component={UserEditAdminPage}
          ></AdminRoute>
          <SellerRoute
            path="/productlist/seller"
            component={ProductListAdminPage}
          ></SellerRoute>
          <SellerRoute
            path="/orderlist/seller"
            component={OrderListAdminPage}
          ></SellerRoute>
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
