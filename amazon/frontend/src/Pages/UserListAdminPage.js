import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAdmin, listUsersAdmin } from "../actions/userActions";
import { LoadingBox } from "../components/LoadingBox";
import { MessageBox } from "../components/MessageBox";
import { USER_DELETE_RESET, USER_DETAILS_FAIL, USER_DETAILS_RESET } from "../constants/userConstants";

const UserListAdminPage = (props) => {
  const userList = useSelector((state) => state.userList);
  const { users, loading, error } = userList;

  const deleteUser = useSelector((state) => state.deleteUser);
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = deleteUser;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listUsersAdmin());
    dispatch({type: USER_DETAILS_RESET})
  }, [dispatch, successDelete]);

  const deleteHandler = (user) => {
    if (window.confirm("are you sure to delete user?")) {
      dispatch(deleteUserAdmin(user._id));
    }
  };
  return (
    <div>
      {loadingDelete && <LoadingBox />}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {successDelete && (
        <MessageBox variant="success">User deleted Successfully</MessageBox>
      )}
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
              <th>EMAIL</th>
              <th>IS SELLER</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? "YES" : "NO"}</td>
                <td>{user.isAdmin ? "YES" : "NO"}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => props.history.push(`/user/${user._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(user)}
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

export default UserListAdminPage;
