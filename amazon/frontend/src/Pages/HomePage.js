import React, { useEffect } from "react";
import { listProducts } from "../actions/productActions";
import { listTopSellers } from "../actions/userActions";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Product from "../components/Product";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  //useSelector gets object from our redux store
  const productList = useSelector((state) => state.productList); // getting state.productList from productReducers Object
  const { loading, error, products } = productList;
  console.log(products);

  const userTopSellerList = useSelector((state) => state.userTopSellerList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellersList,
  } = userTopSellerList;

  useEffect(() => {
    dispatch(listProducts({})); // {} means return all objects . no filter on products based on seller
    dispatch(listTopSellers());
  }, [dispatch]);

  return (
    <div>
      <h1>Top Sellers</h1>
      {loadingSellers ? (
        <LoadingBox />
      ) : errorSellers ? (
        <MessageBox variant="danger">{errorSellers}</MessageBox>
      ) : (
        <>
          {sellersList.length === 0 && (
            <MessageBox>sellers not found</MessageBox>
          )}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellersList.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
               {/* {seller.seller.description}  */}
               </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}

      <h1>Featured Products</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length == 0 && <MessageBox>products not found</MessageBox>}
          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
