import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditPrduct";
import ProductByCategory from "./pages/ProductByCategory";
import ProductBySubCategory from "./pages/ProductBySubCategory";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ShippingAddress from "./pages/ShippingAddress";
import VerifyToken from "./pages/VerifyToken";
import ChangePassword from "./pages/ChangePassword";
import UserOrders from "./pages/UserOrders";
import AdminOrders from "./pages/AdminOrders";
import UpdateStatus from "./pages/UpdateStatus";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route
            path="/products/category/:mainCategoryName"
            element={<ProductByCategory />}
          />
          <Route
            path="/products/category/:mainCategoryName/:subCategoryName"
            element={<ProductBySubCategory />}
          />
          <Route
            path="/product/category/:mainCategoryName/:subCategoryName/:productName"
            element={<SingleProduct />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/shipping-address" element={<ShippingAddress />} />
            <Route path="/verify-reset-token" element={<VerifyToken />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="/my-orders" element={<UserOrders />} />
            <Route element={<Dashboard />}>
              <Route path="/dashboard/stats" element={<Stats />} />
              <Route path="/dashboard/users" element={<AdminUsers />} />
              <Route path="/dashboard/products" element={<Products />} />
              <Route path="/dashboard/orders" element={<AdminOrders />} />
              <Route path="/dashboard/change-order-status/:orderId" element={<UpdateStatus />} />
              <Route
                path="/dashboard/create-product"
                element={<CreateProduct />}
              />
              <Route
                path="/dashboard/edit-product/:productId"
                element={<EditProduct />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
}

export default App;
