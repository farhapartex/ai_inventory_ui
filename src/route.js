import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import OrderCreatePage from "./pages/order/NewOrder";
import OrdersPage from "./pages/order/OrderList";
import ProductListPage from "./pages/product/list";
import ProductCreatePage from "./pages/product/ProductCreate";
import ProductEditPage from "./pages/product/ProductEditPage";

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
    },
    {
        path: "/products/new",
        element: <ProductCreatePage />,
    },
    {
        path: "/products/:pageId",
        element: <ProductEditPage />,
    },
    {
        path: "/orders",
        element: <OrdersPage />
    },
    {
        path: "/orders/new",
        element: <OrderCreatePage />
    }
]