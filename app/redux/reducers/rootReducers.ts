import { combineReducers } from "@reduxjs/toolkit";
import addressReducer from "../slices/addressSlice";
import authReducer from "../slices/authSlice";
import categoryReducer from "../slices/categorySlice";
import orderReducer from "../slices/orderSlice";
import productReducer from "../slices/productSlice";

const appReducer = combineReducers({
  auth: authReducer,
  address: addressReducer,
  category: categoryReducer,  
  order: orderReducer,
  products: productReducer
});

// Allow state to be undefined in the reducer signature.
const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === "auth/clearCredentials") {
    state = undefined; // Resets all slices to their initial state.
  }
  return appReducer(state, action);
};

export default rootReducer;