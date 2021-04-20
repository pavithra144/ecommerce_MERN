import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

export default function SellerRoute({ component: Component, ...restProps }) {
  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;
  return (
    <Route
      {...restProps} // getting props from original route
      render={(props) =>
        userInfo && userInfo.isSeller ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="/signin"></Redirect>
        )
      }
    ></Route>
  );
}
