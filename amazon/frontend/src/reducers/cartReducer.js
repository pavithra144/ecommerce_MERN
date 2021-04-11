import {
  CART_ADD_ITEMS,
  CART_REMOVE_ITEMS,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants";
import { CART_EMPTY } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEMS:
      const newItem = action.payload;
      console.log(newItem);

      const existingItem = state.cartItems.find(
        (x) => x.product === newItem.product
      );
      console.log(existingItem);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existingItem.product ? newItem : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, newItem],
        };
      }

    case CART_REMOVE_ITEMS:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case CART_EMPTY:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};
