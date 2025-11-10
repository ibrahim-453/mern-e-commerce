import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import { logout } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { toggleTheme } from "../redux/features/themeSlice";
import { resetCartCount, setCartCount } from "../redux/features/cartSlice";

function Header() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const {count} = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/v1/auth/logout");
      toast.success(res.data.message);
      dispatch(logout());
      setIsOpen(false);
      setIsProfile(false);
      navigate("/login");
    } catch (error) {
      console.log(`Logout Error : ${error.message}`);
      toast.error(error.message || "Logout Failed");
    }
  };

  const handleNavClick = () => setIsOpen(false);
  const handleResetToken = async()=>{
    try {
      const res = await api.post("/api/v1/user/reset-token")
      if(res){
        toast.success(res.data.message)
        setIsProfile(false)
        navigate("/verify-reset-token",{state:{email:user.email}})
      }
    } catch (error) {
      console.log(`Reset Error : ${error.message}`);
      toast.error("Token sending Failed" || error.message);
    }
  }

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await api.get("/api/v1/category/categories");
        if (res) setCategory(res.data.data?.categories || []);
      } catch (error) {
        console.log(`Category Error : ${error.message}`);
      }
    };
    getCategory();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await api.get("/api/v1/cart/my-cart");
        const total = res.data?.data?.cart?.totalItems || 0;
        dispatch(setCartCount({ count: total }));
      } catch {
        dispatch(setCartCount({ count: 0 }));
      }
    };

    if (isAuthenticated) fetchCartCount();
    else dispatch(resetCartCount());
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <header className="header">
        <div className="content-wrapper flex-row">
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-text-color dark:text-text-color-dark"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu size={22} />
            </button>

            <h2 onClick={() => navigate("/")} className="sub-text">
              EZ-SHOP
            </h2>
          </div>

          <div className="flex items-center gap-3 relative">
            {user && isAuthenticated && (
              <Link to="/cart" className="relative p-2 text-primary">
                <ShoppingCart size={20} />
                {count >=0  && (
                  <span className="cross-btn opacity-100 w-5 h-5 p-0 text-xs flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            )}

            <button
              className="p-2 text-text-color dark:text-text-color-dark"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user && isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfile(!isProfile)}
                  className="hidden sm:flex items-center gap-1 px-3"
                >
                  <span className="text-primary font-semibold">
                    {user.fullname}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary transition-transform duration-200 ${
                      isProfile ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfile && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <Link
                      className="block px-4 py-2 text-sm text-primary hover:bg-hover"
                      onClick={handleResetToken}
                    >
                      Change Password
                    </Link>
                    <Link
                      to="my-orders"
                      className="block px-4 py-2 text-sm text-primary hover:bg-hover"
                      onClick={() => setIsProfile(false)}
                    >
                      Order History
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/dashboard/stats"
                        className="block px-4 py-2 text-sm text-primary hover:bg-hover"
                        onClick={() => setIsProfile(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-hover"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/register"
                  className="btn-primary text-primary border border-btn"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="btn-primary text-primary border border-btn"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0  z-40" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-secondary shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-text-color dark:text-text-color-dark rounded-md"
          >
            <X size={22} />
          </button>
        </div>

        <div className="sm:hidden">
          {user && isAuthenticated && (
            <div className="p-4 border-b border-gray-300 dark:border-gray-700">
              <p className="font-semibold text-primary">{user.fullname}</p>
              <p className="text-sm opacity-70 text-primary">{user.email}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col p-4 gap-2">
          <Link
            to="/"
            className="btn-primary text-primary"
            onClick={handleNavClick}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="btn-primary text-primary"
            onClick={handleNavClick}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="btn-primary text-primary"
            onClick={handleNavClick}
          >
            Contact
          </Link>

          {category.length > 0 && (
            <>
              <hr className="my-2 border-gray-300 dark:border-gray-700" />
              <p className="text-xs font-bold opacity-70 mb-1 text-primary">
                CATEGORIES
              </p>
              {category.map((item, index) => (
                <Link
                  to={`/products/category/${item}`}
                  key={index}
                  className="capitalize btn-primary text-primary"
                  onClick={handleNavClick}
                >
                  {item}
                </Link>
              ))}
            </>
          )}

          <div className="sm:hidden">
            {user && isAuthenticated ? (
              <>
                <hr className="my-2 border-gray-300 dark:border-gray-700" />
                <Link
                  className="btn-primary text-primary"
                  onClick={handleResetToken}
                >
                  Change Password
                </Link>
                <Link
                  to="my-orders"
                  className="btn-primary text-primary"
                  onClick={handleNavClick}
                >
                  Order History
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/dashboard/stats"
                    className="btn-primary text-primary"
                    onClick={handleNavClick}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-primary text-left text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <hr className="my-2 border-gray-300 dark:border-gray-700" />
                <Link
                  to="/register"
                  className="btn-primary"
                  onClick={handleNavClick}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="btn-primary"
                  onClick={handleNavClick}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Header;
