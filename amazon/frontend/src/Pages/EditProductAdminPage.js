import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { detailsProducts, updateProductAdmin } from "../actions/productActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const EditProductAdminPage = (props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  //if we need to get product ID from url/web page, user match.params.id
  const productId = props.match.params.id;
  console.log(productId);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  console.log(product);
  const updateProduct = useSelector((state) => state.updateProduct);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = updateProduct;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      props.history.push("/productlist");
    }
    //if product does not exists
    if (!product || product._id !== productId || successUpdate) {
      dispatch(detailsProducts(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
    }
  }, [dispatch, product, productId, successUpdate, props.history]);

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const data = await Axios.post("/api/uploads", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };
  console.log(image);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProductAdmin({
        _id: productId,
        name,
        price,
        image,
        category,
        countInStock,
        brand,
        description,
      })
    );
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit Product {productId}</h1>
        </div>
        {loadingUpdate && <LoadingBox />}
        {errorUpdate && <MessageBox variant="danger">{error}</MessageBox>}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="text"
                placeholder="enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <label htmlFor="image">Image</label>
              <input
                id="image"
                type="text"
                placeholder="enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <label htmlFor="imageFile">Upload File</label>
              <input
                type="file"
                id="imageFile"
                label="choose file"
                onChange={uploadFileHandler}
              />
              {loadingUpload && <LoadingBox />}
              {errorUpload && (
                <MessageBox variant="danger">{errorUpload}</MessageBox>
              )}
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <label htmlFor="countInStock">Count in stock</label>
              <input
                id="countInStock"
                type="text"
                placeholder="enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                type="text"
                placeholder="enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              <label htmlFor="description">Brand</label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder="enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label></label>
              <button className="primary" type="submit">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default EditProductAdminPage;
