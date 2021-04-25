import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { prices, ratings } from "../utils";

const SearchPage = (props) => {
  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "newest",
    pageNumber = 1,
  } = useParams();
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, products, pages, page, error } = productList;
  debugger;
  console.log(pages);
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = productCategoryList;
  console.log(categories);

  useEffect(() => {
    dispatch(
      listProducts({
        name: name !== "all" ? name : " ",
        category: category !== "all" ? category : "",
        min,
        max,
        rating,
        order,
        pageNumber,
      })
    );
  }, [dispatch, name, category, min, max, rating, order, pageNumber]);
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
  };
  return (
    <div>
      <div className="row">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>{products.length}Results</div>
        )}
      </div>
      <div>
        Sort By{" "}
        <select
          value={order}
          onChange={(e) => {
            props.history.push(getFilterUrl({ order: e.target.value }));
          }}
        >
          <option value="newest">Newest arrivals</option>
          <option value="lowest">lowest to highest</option>
          <option value="highest">highest to lowest</option>
          <option value="toprated">Top rated</option>
        </select>
      </div>
      <div className="row top">
        <div className="col-1">
          <div>
            <h3>DEPARTMENTS</h3>
            {loadingCategory ? (
              <LoadingBox />
            ) : errorCategory ? (
              <MessageBox variant="danger">{errorCategory}</MessageBox>
            ) : (
              <ul>
                <li>
                  <Link
                    className={"all" === category ? "active" : ""}
                    to={getFilterUrl({ category: "all" })}
                  >
                    Any
                  </Link>
                </li>
                {categories.map((c) => (
                  <div>
                    <li key={c}></li>
                    <Link
                      className={c === category ? "active" : ""}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </div>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>PRICES</h3>
            <ul>
              {prices.map((price) => (
                <div>
                  <li key={price.name}></li>
                  <Link
                    to={getFilterUrl({ min: price.min, max: price.max })}
                    className={
                      `${price.min} -${price.max}` === `${min}-${max}`
                        ? "active"
                        : ""
                    }
                  >
                    {price.name}
                  </Link>
                </div>
              ))}
            </ul>
          </div>
          <div>
            <h3> customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <div>
                  <li key={r.name}></li>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "active" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating}>
                      {" "}
                    </Rating>
                  </Link>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-3">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.length === 0 && (
                <MessageBox>No product found</MessageBox>
              )}
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              <div className="row center pagination  ">
                {[...Array(pages).keys()].map((x) => {
                  debugger;
                  console.log(x);
                  console.log(pages);
                  return (
                    <Link
                      className={x + 1 === page ? "active" : ""}
                      key={x + 1}
                      to={getFilterUrl({ page: x + 1 })}
                    >
                      {x + 1}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
