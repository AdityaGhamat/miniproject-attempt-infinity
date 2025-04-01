import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CollegeList from "@/components/CollegeList";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/college/:collegeId",
    element: <Dashboard />,
  },
  {
    path: "/college",
    element: <CollegeList />,
  },
]);

export default router;
