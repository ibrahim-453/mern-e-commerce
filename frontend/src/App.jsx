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
import Users from "./pages/Users";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditPrduct";

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
          <Route element={<ProtectedRoute />}>
            <Route element={<Dashboard />}>
              <Route path="/dashboard/stats" element={<Stats />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/products" element={<Products />} />
              <Route path="/dashboard/create-product" element={<CreateProduct />} />
              <Route path="/dashboard/edit-product/:productId" element={<EditProduct />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
}

export default App;
