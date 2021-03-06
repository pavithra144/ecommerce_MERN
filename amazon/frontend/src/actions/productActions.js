import Axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_SUCCESS,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_SUCCESS,
  PRODUCT_LIST_CATEGORY_REQUEST,
  PRODUCT_LIST_CATEGORY_SUCCESS,
  PRODUCT_LIST_CATEGORY_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
} from "../constants/productConstants";

export const listProducts = ({
  seller = "",
  name = " ",
  category = " ",
  min = 0,
  max = 0,
  rating = 0,
  order = "",
  pageNumber = "",
}) => async (dispatch) => {
  dispatch({
    type: PRODUCT_LIST_REQUEST,
  });
  try {
    // const { data } = await Axios.get(
    //   `/api/products?pageNumber=${pageNumber}&seller=${seller}&name=${name}&category=${category}&min=${min}&max=${max}&rating=${rating}&order=${order}`
    // );
    const { data } = await Axios.get(`/api/products?pageNumber=${pageNumber}`);
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    console.log(data);
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
};

export const listProductCategories = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_LIST_CATEGORY_REQUEST,
  });
  try {
    const { data } = await Axios.get(`/api/products/categories`);
    dispatch({ type: PRODUCT_LIST_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_CATEGORY_FAIL, payload: error.message });
  }
};

export const detailsProducts = (productId) => async (dispatch) => {
  dispatch({
    type: PRODUCT_DETAILS_REQUEST,
    payload: productId,
  });
  try {
    const { data } = await Axios.get(`/api/products/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createReview = (productId, review) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: PRODUCT_CREATE_REVIEW_REQUEST,
  });
  const {
    userSignIn: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      `/api/products/${productId}/reviews`,
      review,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS, payload: data.review });
    console.log(data);
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//admin duty (create product )
export const createProductAdmin = () => async (dispatch, getState) => {
  dispatch({
    type: PRODUCT_CREATE_REQUEST,
  });
  const {
    userSignIn: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      "/api/products",
      {},
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.product });
    console.log(data);
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProductAdmin = (product) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
  const {
    userSignIn: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/products/${product._id}`, product, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProductAdmin = (productId) => async (dispatch, getState) => {
  dispatch({ type: DELETE_PRODUCT_REQUEST, payload: productId });
  const {
    userSignIn: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.delete(`/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
