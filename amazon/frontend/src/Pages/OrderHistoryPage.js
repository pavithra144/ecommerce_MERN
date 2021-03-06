import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOfMyOrders } from "../actions/orderActions";

import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";

export default function OrderHistoryPage(props) {
  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading, error, orders } = orderMyList;
  console.log(orders);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOfMyOrders());
  }, [dispatch]);
  return (
    <div>
      <h1> Order history</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <div>
                <h1>hi</h1>
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
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
                </td>
              </tr>
              </div>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
