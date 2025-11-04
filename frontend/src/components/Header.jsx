import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import { logout } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { toggleTheme } from "../redux/features/themeSlice";

function Header() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isProfile, setIsProfile] = useState(false);
  const handleLogout = async () => {
    try {
      const res = await api.post("/api/v1/auth/logout");
      toast.success(res.data.message);
      dispatch(logout());
      setIsOpen(false);
      navigate("/login")
    } catch (error) {
      console.log(`Logout Error : ${error.message}`);
      toast.error(error.message || "Logout Failed");
    }
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="header">
      <div className="content-wrapper">
        <div className="w-full flex justify-between items-center sm:w-auto">
          <h2
            onClick={() => navigate("/")}
            className="sub-text hover:text-btn cursor-pointer duration-300"
          >
            EZ-SHOP
          </h2>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              className="px-2 py-2 hover:bg-hover duration-300 rounded-md"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              className="px-2 py-2 dark:text-white hover:bg-hover duration-300 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <nav className="desktop-nav">
          <Link className="text-primary font-semibold btn-primary" to="/">
            Home
          </Link>
          <Link className="text-primary font-semibold btn-primary" to="/about">
            About
          </Link>
          <Link
            className="text-primary font-semibold btn-primary"
            to="/contact"
          >
            Contact
          </Link>
        </nav>
        <div className="hidden sm:flex sm:items-center sm:gap-4">
          {user && isAuthenticated && (
            <div className="relative group">
              <div
                className="flex items-center gap-1 cursor-pointer px-3 py-2 rounded-lg"
                onClick={() => setIsProfile(!isProfile)}
              >
                <span className="text-primary text-sm">{user.fullname}</span>
                <ChevronDown className="w-4 h-4 text-primary transition-transform duration-200 group-hover:rotate-180" />
              </div>
              {isProfile && (
                <div className="absolute bg-bg-light dark:bg-bg-dark right-0 top-full mt-1 w-48 border border-btn rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block  px-4 py-2 text-primary text-sm"
                    onClick={() => setIsProfile(false)}
                  >
                    Profile
                  </Link>
                  {
                    user.role === "admin" && (
                      <Link
                    to="/dashboard/stats"
                    className="block px-4 py-2 text-primary text-sm"
                    onClick={() => setIsProfile(false)}
                  >
                    Dashboard
                  </Link>
                    )
                  }
                </div>
              )}
            </div>
          )}
          <button
            className="px-2 py-2 hover:bg-hover duration-300 rounded-md"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <Moon
                className="text-black hover:text-white duration-300"
                size={20}
              />
            ) : (
              <Sun
                className="text-white hover:text-black duration-300"
                size={20}
              />
            )}
          </button>
          {user && isAuthenticated ? (
            <button
              className="text-primary font-semibold btn-primary"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                className="text-primary font-semibold btn-primary"
                to="/register"
              >
                Sign Up
              </Link>
              <Link
                className="text-primary font-semibold btn-primary"
                to="/login"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
        {isOpen && (
          <div className="mobile-menu">
            <Link
              className="text-primary font-semibold btn-primary text-center"
              to="/"
              onClick={handleNavClick}
            >
              Home
            </Link>
            <Link
              className="text-primary font-semibold btn-primary text-center"
              to="/about"
              onClick={handleNavClick}
            >
              About
            </Link>
            <Link
              className="text-primary font-semibold btn-primary text-center"
              to="/contact"
              onClick={handleNavClick}
            >
              Contact
            </Link>
            <hr className="border-text-color dark:border-text-color-dark" />
            {user && isAuthenticated ? (
              <button
                className="text-primary font-semibold btn-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  className="text-primary font-semibold btn-primary text-center"
                  to="/register"
                  onClick={handleNavClick}
                >
                  Sign Up
                </Link>
                <Link
                  className="text-primary font-semibold btn-primary text-center"
                  to="/login"
                  onClick={handleNavClick}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
