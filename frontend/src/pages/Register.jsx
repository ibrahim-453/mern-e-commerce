import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../axiosInstance";
import usePassword from "../hooks/togglePassword";
import { Eye, EyeClosed } from "lucide-react";
import GoogleAuth from "../components/GoogleAuth";

function Register() {
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { password, togglePassword } = usePassword();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/v1/auth/create-account", form);
      toast.success(res.data.message);
      navigate("/verify-email", { state: { email: form.email } });
      setForm({ fullname: "", email: "", password: "" });
    } catch (error) {
      console.log(`Register Error: ${error.message}`);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="sub-container">
        <div className="hidden lg:flex lg:flex-col lg:items-start lg:gap-3">
          <h3 className="head-text">Register NOW</h3>
          <h3 className="head-text">And</h3>
          <h3 className="head-text">Shop Your Favourite</h3>
          <h3 className="head-text">Clothes</h3>
        </div>

        {/* Mobile Hero Text - Visible only on mobile */}
        <div className="flex flex-col items-center gap-2 text-center lg:hidden">
          <h3 className="head-text">Register NOW</h3>
          <p className="text-primary text-lg">Shop Your Favourite Clothes</p>
        </div>

        {/* Form Container */}
        <div className="form-container">
          <h2 className="text-primary font-semibold text-xl text-center sm:text-2xl">
            Register
          </h2>
          <GoogleAuth />
          <div className="flex items-center gap-4 w-full">
            <hr className="w-full h-px text-primary" />
            <span className="text-primary text-xs sm:text-sm">or</span>
            <hr className="w-full h-px text-primary" />
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-field">
              <label
                className="text-primary text-sm sm:text-base"
                htmlFor="fullname"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                value={form.fullname}
                onChange={handleChange}
                name="fullname"
                className="input text-primary"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="input-field">
              <label
                className="text-primary text-sm sm:text-base"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                name="email"
                className="input text-primary"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-field">
              <label
                className="text-primary text-sm sm:text-base"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={password ? "text" : "password"}
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input text-primary"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-color dark:text-text-color-dark"
                  type="button"
                  onClick={togglePassword}
                >
                  {password ? (
                    <EyeClosed size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            <button className="btn-auth" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-primary font-light text-sm text-center sm:text-base">
            Already have an account?{" "}
            <button
              className="text-btn font-medium"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
