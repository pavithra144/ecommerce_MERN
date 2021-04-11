import React, { useEffect } from "react";
import { listProducts } from "../actions/productActions";
import Product from "../components/Product";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import { useSelector, useDispatch } from "react-redux";

export default function HomePage() {
  const dispatch = useDispatch();
  //useSelector gets object from our redux store
  const productList = useSelector((state) => state.productList); // getting state.productList from productReducers Object
  const { loading, error, products } = productList;
  console.log(products);
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  console.log(products);

  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="row center">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
