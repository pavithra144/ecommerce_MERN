import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductAdmin,
  deleteProductAdmin,
  listProducts,
} from "../actions/productActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import {
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_RESET,
  PRODUCT_CREATE_RESET,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";

const ProductListAdminPage = (props) => {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const createProduct = useSelector((state) => state.createProduct);
  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
    product: productCreated,
  } = createProduct;

  const deleteProduct = useSelector((state) => state.deleteProduct);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = deleteProduct;

  const dispatch = useDispatch();
  console.log(productCreated);

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${productCreated._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(listProducts());
  }, [dispatch, props.history, successCreate, productCreated, successDelete]);

  const deleteHandler = (product) => {
    if (window.confirm("Are you sure to Delete products?")) {
      dispatch(deleteProductAdmin(product._id));
    }
  };

  //create product
  const createProductHandler = () => {
    dispatch(createProductAdmin());
  };
  return (
    <div>
      <div className="row">
        <h1>Products</h1>
        <button
          type="button"
          className="primary"
          onClick={createProductHandler}
        >
          Create Product
        </button>
      </div>
      {loadingDelete && <LoadingBox />}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loadingCreate && <LoadingBox />}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() =>
                      props.history.push(`/product/${product._id}/edit`)
                    }
                  >
                    edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product)}
                  >
                    {" "}
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductListAdminPage;
