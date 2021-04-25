import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { cartReducer } from "./reducers/cartReducer";
import orderCreateReducer, {
  orderDeleteReducerAdmin,
  orderDeliverReducerAdmin,
  orderDetailsReducer,
  orderListReducerAdmin,
  orderMyListReducer,
  orderPayReducer,
} from "./reducers/orderReducer";
import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
  productUpdateReducer,
  productDeleteReducer,
  productCategoryListReducer,
  productCreateReviewReducer,
} from "./reducers/productReducers";
import {
  userAddressMapReducer,
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userRegisterReducer,
  userSignInReducer,
  userTopSellerListReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/userReducer";

const initialState = {
  userSignIn: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    PaymentMethod: "PayPal",
  },
};

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userRegister: userRegisterReducer,
  userSignIn: userSignInReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderMyList: orderMyListReducer,
  userDetailsProfile: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  //admin view
  createProduct: productCreateReducer,
  updateProduct: productUpdateReducer,
  deleteProduct: productDeleteReducer,
  orderList: orderListReducerAdmin,
  deleteOrder: orderDeleteReducerAdmin,
  deliverOrder: orderDeliverReducerAdmin,
  userList: userListReducer,
  deleteUser: userDeleteReducer,
  updateUser: userUpdateReducer,
  userTopSellerList: userTopSellerListReducer,
  productCategoryList: productCategoryListReducer,
  productCreateReview: productCreateReviewReducer,
  useAddressGoogleMap: userAddressMapReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
