import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { resetCartCount } from "../redux/features/cartSlice";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmOrder = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        toast.error("Invalid payment session");
        navigate("/");
        return;
      }
      try {
        const res = await api.post("/api/v1/order/confirm-payment", {
          sessionId,
        });
        setOrder(res.data.data.order);
        toast.success("Payment successful! Order confirmed.");
        dispatch(resetCartCount());
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Payment confirmation failed"
        );
      } finally {
        setLoading(false);
      }
    };
    confirmOrder();
  }, [searchParams, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
        <p className="ml-4 text-primary">Confirming payment...</p>
      </div>
    );

  return (
    <div className="main-container text-center min-h-screen flex flex-col items-center justify-center">
      {order ? (
        <>
          <h1 className="head-text text-green-600">Payment Successful!</h1>
          <p className="text-primary mt-2">
            Your order <strong>#{order.orderId}</strong> has been placed
            successfully.
          </p>
          <p className="text-primary mt-4">
            You’ll receive an email confirmation shortly.
          </p>
          <button onClick={() => navigate("/")} className="btn-auth mt-6">
            Back to Home
          </button>
        </>
      ) : (
        <h1 className="head-text text-red-600">Something went wrong!</h1>
      )}
    </div>
  );
}

export default PaymentSuccess;
