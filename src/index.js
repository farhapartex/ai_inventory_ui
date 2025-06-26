import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { routes } from './route';
import { store } from './store';

const router = createBrowserRouter(routes);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
