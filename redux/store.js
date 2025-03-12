// import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
// import itemReducer from "./itemSlice";
import itemReducer from "./ItemSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        // items: itemReducer,
        items: itemReducer,
    },
});

export default store;
