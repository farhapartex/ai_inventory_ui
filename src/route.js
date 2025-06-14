import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import OrderCreatePage from "./pages/order/NewOrder";
import OrdersPage from "./pages/order/OrderList";
import OrderDetailsController from "./pages/order/OrderDetailControllerPage.js";
import ProductListPage from "./pages/product/list";
import ProductCreatePage from "./pages/product/ProductCreate";
import ProductEditPage from "./pages/product/ProductEditPage";
import CustomersPage from "./pages/customer/ListPage.js";
import CustomerCreatePage from "./pages/customer/CustomerCreatePage.js";
import CustomerEditPage from "./pages/customer/CustomerEditPage.js";

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
    },
    {
        path: "/orders/:pageId",
        element: <OrderDetailsController />
    },
    {
        path: "/customers",
        element: <CustomersPage />
    },
    {
        path: "/customers/new",
        element: <CustomerCreatePage />
    },
    {
        path: "/customers/:pageId",
        element: <CustomerEditPage />
    },
]