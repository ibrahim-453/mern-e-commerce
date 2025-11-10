import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Lock, ArrowLeft, Eye, EyeClosed } from "lucide-react";
import usePassword from "../hooks/togglePassword";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { password, togglePassword } = usePassword();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/user/change-password", {
        newPassword,
      });
      toast.success(res.data.message || "Password changed successfully");
      navigate("/");
      setNewPassword("");
    } catch (error) {
      console.log(`Change Password Error: ${error.message}`);
      toast.error(error.response?.data?.message || "Change Password Failed");
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
            className="flex items-center gap-2 text-primary hover:text-btn dark:hover:text-btn-dark duration-300 self-start"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-semibold">
              Back to Home
            </span>
          </button>

          <div className="text-primary flex flex-col justify-center items-center gap-3 text-center px-2">
            <div className="p-4 rounded-full bg-btn dark:bg-btn-dark">
              <Lock size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Change Password</h2>
            <p className="text-sm sm:text-base opacity-70">
              Create a new secure password for your account
            </p>
          </div>

          <hr className="w-full border-bg-secondary-dark dark:border-bg-secondary" />

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-field">
              <label
                className="text-primary text-sm sm:text-base font-semibold"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <div className="relative w-full">
                <input
                  type={password ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input text-primary"
                  required
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-color dark:text-text-color-dark"
                  type="button"
                  onClick={togglePassword}
                >
                  {password ? (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <EyeClosed size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword}
              className="btn-auth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Changing Password...</span>
                </div>
              ) : (
                "Change Password"
              )}
            </button>
          </form>

          <p className="text-primary text-xs text-center opacity-70">
            Make sure to use a password you haven't used before
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
