import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import ProductListPage from "./pages/product/list";

export const routes = [
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/products",
        element: <ProductListPage />,
    }
]