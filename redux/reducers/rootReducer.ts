import { combineReducers } from "@reduxjs/toolkit";
import addressReducer from "../slices/addressSlice";

const rootReducer = combineReducers({
    address : addressReducer
})

export default rootReducer;

