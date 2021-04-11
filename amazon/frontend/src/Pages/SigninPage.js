import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signIn } from "../actions/userActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";

export default function SigninPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //to redirect user after signing in
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  //orginal query string : ?redirect=shipping    [from cartPage]
  //the below log shows "shipping"
  // console.log( props.location.search.split("=")[1])
  //the below log gives "?redirect"
  // console.log( props.location.search.split("=")[0])

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo, loading, error } = userSignIn;
  console.log(userSignIn);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signIn(email, password));
  };

  useEffect(() => {
    //if user signed in, do redirecting to shipping page
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, userInfo, redirect]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>Sign In</div>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <button className="primary" type="submit">
            Sign In{" "}
          </button>
        </div>
        {loading && <LoadingBox />}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label />
          <div>
            New Customer?{""}
            <Link to={`/register?redirect=${redirect}`}>
              {" "}
              Create new account
            </Link>{" "}
          </div>
        </div>
      </form>
    </div>
  );
}
