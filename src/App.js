import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  PageNotFound,
  Password,
  Profile,
  Recovery,
  Register,
  Reset,
  Username,
} from "./components";

// to use tailwind css, here okkkk!!!!!
// https://tailwindcss.com/docs/guides/create-react-app

// auth middleware ..
import { AuthorizeUser, IsUser } from "./middleware/auth";

const router = createBrowserRouter([
  { path: "/", element: <Username></Username> },
  { path: "/register", element: <Register></Register> },
  {
    path: "/password",
    element: (
      <IsUser>
        <Password></Password>,
      </IsUser>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile></Profile>
      </AuthorizeUser>
    ),
  },
  {
    path: "/recovery",
    element: (
      <IsUser>
        <Recovery></Recovery>
      </IsUser>
    ),
  },
  { path: "/reset", element: <Reset></Reset> },
  { path: "*", element: <PageNotFound></PageNotFound> },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
