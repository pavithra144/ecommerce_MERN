import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrderAdmin, listOrders } from "../actions/orderActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import { ORDER_DELETE_RESET } from "../constants/orderConstants";

const OrderListAdminPage = (props) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { error, orders, loading } = orderList;
  const deleteOrder = useSelector((state) => state.deleteOrder);
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = deleteOrder;

  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders());
  }, [dispatch, successDelete]);

  const deleteOrderHandler = (order) => {
    //todo
    if (window.confirm("Are you sure to delete?")) {
      dispatch(deleteOrderAdmin(order._id));
    }
  };
  return (
    <div>
      <h1> Order </h1>
      {loadingDelete && <LoadingBox />}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>{order.ispaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteOrderHandler(order)}
                  >
                    Delete
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

export default OrderListAdminPage;
