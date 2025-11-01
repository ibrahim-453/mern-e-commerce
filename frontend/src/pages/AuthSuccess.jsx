// pages/AuthSuccess.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/features/authSlice";
import api from "../axiosInstance";

function AuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/v1/auth/me");
        dispatch(login({ user: res.data.data.safeUser }));
        navigate("/"); // go home after successful fetch
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [dispatch, navigate]);

  return <div>Logging you in with Google...</div>;
}

export default AuthSuccess;
