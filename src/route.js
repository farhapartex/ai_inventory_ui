import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";

export const routes = [
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/login",
        element: <Login />,
    }
]