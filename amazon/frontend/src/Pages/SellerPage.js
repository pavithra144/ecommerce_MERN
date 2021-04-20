import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import { detailsUser } from "../actions/userActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";

const SellerPage = (props) => {
  const sellerId = props.match.params.id;

  const userDetailsProfile = useSelector((state) => state.userDetailsProfile);
  const { loading, error, user } = userDetailsProfile;

  const productList = useSelector((state) => state.productList);
  const {
    loading: loadingProduct,
    error: errorProduct,
    products,
  } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(detailsUser(sellerId));
    dispatch(listProducts({ seller: sellerId })); // getting only products of seller
  }, [dispatch, sellerId]);
  return (
    <div className="row top">
      {/* seller Info */}
      <div className="col-1">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <ul className="card card-body">
            <li>
              <div className="row start">
                <div>
                  <img
                    className="small"
                    src={user.seller.logo}
                    alt={user.seller.name}
                  />
                </div>
                <div>
                  <h1>{user.seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating
                rating={user.seller.rating}
                numReviews={user.seller.numReviews}
              />
            </li>
            <li>
              <Link href={`mailto:${user.email}`}>Contact seller</Link>
            </li>
            <li>{user.seller.description}</li>
          </ul>
        )}
      </div>
      {/* product of seller */}
      <div className="col-3">
        {loadingProduct ? (
          <LoadingBox />
        ) : errorProduct ? (
          <MessageBox variant="danger">{errorProduct}</MessageBox>
        ) : (
          <>
            {products.length === 0 && <MessageBox>No product found</MessageBox>}
            <div className="row center">
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerPage;
