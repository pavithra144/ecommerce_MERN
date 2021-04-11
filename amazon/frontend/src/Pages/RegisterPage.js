import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../actions/userActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";

export default function RegisterPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //to redirect user after signing in
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  //orginal query string : ?redirect=shipping    [from cartPage]
  //the below log shows "shipping"
  // console.log( props.location.search.split("=")[1])
  //the below log gives "?redirect"
  // console.log( props.location.search.split("=")[0])

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;
  console.log(userInfo);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password or confrim Password didnt match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  useEffect(() => {
    //if user signed in, do redirect to shipping
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, userInfo, redirect]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>Create Account</div>
        <div>
          <label htmlFor="name">Name </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
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
          <label htmlFor="password">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <button className="primary" type="submit">
            Register{" "}
          </button>
        </div>
        {loading && <LoadingBox />}
        {error && (
          <MessageBox variant="danger">user already registered</MessageBox>
        )}

        <div>
          <label />
          <div>
            Already a Customer?{""}
            <Link to={`/signin?redirect=${redirect}`}> Sign in</Link>{" "}
          </div>
        </div>
      </form>
    </div>
  );
}
