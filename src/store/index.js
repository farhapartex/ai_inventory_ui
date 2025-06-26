import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {
        auth: null,
    },
    devTools: process.env.NODE_ENV !== "production",
})