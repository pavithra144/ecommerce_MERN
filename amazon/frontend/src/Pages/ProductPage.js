import React, { useEffect, useState } from "react";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import { detailsProducts } from "../actions/productActions";
import { createReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

export default function ProductPage(props) {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");

  const productCreateReview = useSelector((state) => state.productCreateReview);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productCreateReview;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  useEffect(() => {
    if (successReviewCreate) {
      window.alert("review submitted");
      setRating("");
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(detailsProducts(productId));
  }, [dispatch, productId, successReviewCreate]);
  const addToCartHandler = () => {
    //history = redirect user to cart screen
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert("Please enter comment and rating");
    }
  };
  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Link to="/">Back to home</Link>
          <div className="row top">
            <div className="col-2">
              <img
                className="large"
                src={product.image}
                alt={product.name}
              ></img>
            </div>
          </div>
          <div className="col-1">
            <ul>
              <li>
                <h1>{product.name}</h1>
              </li>
              <li>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </li>
              <li>${product.price}</li>
              <li>
                <p>{product.description}</p>
              </li>
            </ul>
          </div>
          <div className="col-1">
            <div className="card card-body">
              <ul>
                <li>
                  seller{" "}
                  <h2>
                    <Link to={`/seller/${product.seller._id}`}>
                      {product.seller.seller.name}
                    </Link>
                  </h2>
                  <Rating
                    rating={product.seller.seller.rating}
                    numReviews={product.seller.seller.numReviews}
                  />
                </li>
                <li>
                  <div className="row">
                    <div>Price</div>
                    <div className="price">${product.price}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div> status</div>
                    <div>
                      {product.countInStock > 0 ? (
                        <span className="success"> Instock</span>
                      ) : (
                        <span className="danger">Unavailable</span>
                      )}
                    </div>
                  </div>
                </li>
                {product.countInStock > 0 && (
                  <>
                    <li>
                      <div className="row">
                        <div>Qty</div>
                        <div>
                          <select
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={addToCartHandler}
                        className="primary block"
                      >
                        Add to Cart
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div>
            <h2>Reviews</h2>
            {product.reviews.length === 0 && (
              <MessageBox variant="danger">
                There is no reviews for this product
              </MessageBox>
            )}
            <ul>
              {product.reviews.map((review) => (
                <li key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" " />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h2>Write a customer review</h2>
                    </div>
                    <div>
                      <label htmlFor="rating">Rating</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1- Poor</option>
                        <option value="2">2- Fair</option>
                        <option value="3">3- Good</option>
                        <option value="4">4- Very Good</option>
                        <option value="5">5- Excellent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Comment</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button className="primary" type="submit">
                        Submit
                      </button>
                    </div>
                    <div>
                      {loadingReviewCreate && <LoadingBox />}
                      {errorReviewCreate && (
                        <MessageBox>{errorReviewCreate}</MessageBox>
                      )}
                    </div>
                  </form>
                ) : (
                  <MessageBox>
                    Please <Link to="/signin">Sign In </Link> to write a review
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
