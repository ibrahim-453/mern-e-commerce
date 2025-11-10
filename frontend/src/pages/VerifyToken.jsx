import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, ArrowLeft } from "lucide-react";

function VerifyToken() {
  const { state } = useLocation();
  const email = state?.email;
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/user/verify-token", {
        token,
      });
      toast.success(res.data.message);
      navigate("/change-password");
      setToken("");
    } catch (error) {
      console.log(`OTP Error: ${error.message}`);
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="content-wrapper justify-center">
        <div className="form-container">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-btn duration-300 self-start"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </button>

          <div className="text-primary flex flex-col justify-center items-center gap-3 text-center px-2">
            <div className="p-3 rounded-full bg-secondary">
              <Mail size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">Check Your Email</h2>
            <p className="text-sm sm:text-base">
              We've sent a verification code to
            </p>
            <p className="text-btn text-sm font-medium sm:text-base break-all">
              {email}
            </p>
            <p className="text-sm sm:text-base">
              Enter the 6-digit code below to verify your account
            </p>
          </div>

          <hr className="w-full border-bg-secondary dark:border-bg-secondary-dark" />
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-field">
              <label
                className="text-primary text-sm sm:text-base"
                htmlFor="token"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="token"
                name="token"
                value={token}
                onChange={(e) =>
                  setToken(e.target.value.replace(/\s/g, "").slice(0, 6))
                }
                placeholder="000000"
                maxLength="6"
                className="input text-center text-primary text-lg sm:text-xl tracking-widest font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || token.length !== 6}
              className="btn-auth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyToken;
