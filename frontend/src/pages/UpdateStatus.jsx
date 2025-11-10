import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function UpdateStatus() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/order/get-order/${orderId}`);
        if (res?.data?.data?.order) {
          setOrder(res.data.data.order);
          setStatus(res.data.data.order.orderStatus || "");
        }
      } catch (error) {
        console.log(`Orders Error: ${error.response?.data?.message}`);
        toast.error(error.response?.data?.message || "Failed to fetch order");
        navigate("/dashboard/orders");
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, [orderId, navigate]);

  const handleUpdateStatus = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    setUpdating(true);
    try {
      const res = await api.put(
        `/api/v1/order/update-order-status/${orderId}`,
        { status }
      );
      if (res) {
        toast.success(res.data.message || "Order status updated successfully");
        const updatedRes = await api.get(`/api/v1/order/get-order/${orderId}`);
        if (updatedRes?.data?.data?.order) {
          setOrder(updatedRes.data.data.order);
          setStatus(updatedRes.data.data.order.orderStatus);
        }
      }
    } catch (error) {
      console.log(`Orders Error: ${error.message}`);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (statusValue) => {
    const icons = {
      pending: <Clock size={20} className="text-yellow-500" />,
      processing: <Package size={20} className="text-blue-500" />,
      shipping: <Truck size={20} className="text-purple-500" />,
      delivered: <CheckCircle size={20} className="text-green-500" />,
      cancelled: <XCircle size={20} className="text-red-500" />,
    };
    return icons[statusValue?.toLowerCase()] || icons.pending;
  };

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      value: "processing",
      label: "Processing",
      icon: Package,
      color: "text-blue-500",
    },
    {
      value: "shipping",
      label: "Shipping",
      icon: Truck,
      color: "text-purple-500",
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-6 bg-secondary rounded-full">
            <Package size={64} className="text-btn dark:text-btn-dark" />
          </div>
          <h3 className="sub-text text-center">Order Not Found</h3>
          <button
            onClick={() => navigate("/dashboard/orders")}
            className="product-links text-white hover:bg-hover dark:hover:bg-hover-dark"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-btn dark:bg-btn-dark rounded-full">
            <RefreshCw size={28} className="text-white" />
          </div>
          <div>
            <h1 className="head-text text-2xl sm:text-3xl">
              Update Order Status
            </h1>
            <p className="text-primary text-sm">
              Manage order #{order.orderId}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/orders")}
          className="product-links text-white hover:bg-hover dark:hover:bg-hover-dark"
        >
          <ArrowLeft size={20} />
          <span>Back to Orders</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-secondary rounded-lg shadow-lg p-6">
            <h2 className="sub-text text-lg mb-6 flex items-center gap-2">
              <Package size={20} className="text-btn dark:text-btn-dark" />
              Order Status Management
            </h2>

            <div className="flex flex-col gap-6">
              <div className="input-field">
                <label className="text-primary font-semibold">Order ID</label>
                <input
                  type="text"
                  value={order.orderId}
                  disabled
                  className="input text-primary bg-bg-light dark:bg-bg-dark cursor-not-allowed opacity-75"
                />
              </div>

              <div className="bg-bg-light dark:bg-bg-dark rounded-lg p-4">
                <label className="text-primary text-sm font-semibold mb-3 block">
                  Current Status
                </label>
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.orderStatus)}
                  <span className="text-primary font-bold text-lg capitalize">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="input-field">
                <label className="text-primary font-semibold">
                  Update to New Status *
                </label>
                <select
                  className="input text-primary"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="">Select New Status</option>
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatus(option.value)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        status === option.value
                          ? "border-btn dark:border-btn-dark bg-btn dark:bg-btn-dark bg-opacity-10 scale-105"
                          : "border-bg-secondary-dark dark:border-bg-secondary hover:border-btn dark:hover:border-btn-dark"
                      }`}
                    >
                      <Icon size={18} className={option.color} />
                      <span className="text-primary text-sm font-semibold">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={updating || !status || status === order.orderStatus}
                className="btn-auth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Status...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    <span>Update Order Status</span>
                  </>
                )}
              </button>

              {status === order.orderStatus && status && (
                <p className="text-yellow-500 text-sm text-center">
                  ⚠️ Selected status is the same as current status
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="flex flex-col gap-4">
            <div className="bg-secondary rounded-lg shadow-md p-6">
              <h3 className="text-primary font-bold text-sm mb-4">
                Order Summary
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary opacity-70">Order ID:</span>
                  <span className="text-primary font-semibold">
                    {order.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary opacity-70">Total Amount:</span>
                  <span className="text-primary font-bold text-btn dark:text-btn-dark">
                    ${order.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary opacity-70">Items:</span>
                  <span className="text-primary font-semibold">
                    {order.items?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary opacity-70">Order Date:</span>
                  <span className="text-primary font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-btn dark:bg-btn-dark bg-opacity-10 border-2 border-btn dark:border-btn-dark rounded-lg p-6">
              <h3 className="text-primary font-bold text-sm mb-3">
                Status Update Info
              </h3>
              <div className="text-primary text-xs space-y-2 opacity-80">
                <p>• Changes take effect immediately</p>
                <p>• Customer will be notified via email</p>
                <p>• Update history is tracked</p>
                <p>• Be careful when changing status</p>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="bg-secondary rounded-lg shadow-md p-6">
                <h3 className="text-primary font-bold text-sm mb-3">
                  Customer Details
                </h3>
                <div className="text-primary text-xs space-y-2">
                  <p className="font-semibold">
                    {order.shippingAddress.fullname}
                  </p>
                  <p className="opacity-70">{order.shippingAddress.phone}</p>
                  <p className="opacity-70">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateStatus;
