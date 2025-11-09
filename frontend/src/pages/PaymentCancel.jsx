import { Navigate } from "react-router-dom";

function PaymentCancel() {
  return (
    <div className="main-container min-h-screen flex flex-col items-center justify-center">
      <h1 className="head-text text-red-600">Payment Cancelled</h1>
      <p className="text-primary mt-4">You can try checking out again.</p>
      <Navigate to="/">Back To Home</Navigate>
    </div>
  );
}

export default PaymentCancel;
