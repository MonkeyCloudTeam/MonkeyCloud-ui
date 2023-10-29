import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { SignInPage } from './pages/SignInPage/SignInPage'
import {SignUpPage} from './pages/SignUpPage/SignUpPage'
import {MainPage} from "./pages/MainPage/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/sign-in",
    element: <SignInPage />
  },
  {
    path:"/sign-up",
    element: <SignUpPage />
  },
  {
    path:"/main",
    element: <MainPage />
  }
]);

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
