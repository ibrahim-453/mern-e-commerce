import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../axiosInstance";
import {
  Package,
  ShoppingBag,
  ChevronDown,
  Calendar,
  DollarSign,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showMore, setShowMore] = useState(true);
  const navigate = useNavigate();
  const limit = 9;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/v1/order/get-my-orders?startIndex=0&limit=${limit}`
        );
        if (res) {
          setOrders(res.data?.data?.orders || []);
          if (res.data?.data?.orders.length < limit) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(`Orders Error: ${error.message}`);
        toast.error(error.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const handleShowMore = async () => {
    const startIndex = orders.length;
    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/order/get-my-orders?startIndex=${startIndex}&limit=${limit}`
      );
      if (res) {
        setOrders((prev) => [...prev, ...res.data?.data?.orders]);
        if (res.data?.data?.orders.length < limit) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(`Orders Error: ${error.message}`);
      toast.error("Failed to load more orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-6 bg-secondary rounded-full">
            <ShoppingBag size={64} className="text-btn dark:text-btn-dark" />
          </div>
          <h3 className="sub-text text-center">Please Login</h3>
          <p className="text-primary text-center">
            You need to be logged in to view your orders
          </p>
          <button
            onClick={() => navigate("/login")}
            className="product-links text-white hover:bg-hover dark:hover:bg-hover-dark"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0 && !loading) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-6 bg-secondary rounded-full">
            <Package size={64} className="text-btn dark:text-btn-dark" />
          </div>
          <h3 className="sub-text text-center">No Orders Yet</h3>
          <p className="text-primary text-center">
            You haven't placed any orders yet. Start shopping!
          </p>
          <button
            onClick={() => navigate("/")}
            className="product-links text-white hover:bg-hover dark:hover:bg-hover-dark"
          >
            <ShoppingBag size={20} />
            <span>Start Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container min-h-screen p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-btn dark:bg-btn-dark rounded-full">
            <ShoppingBag size={28} className="text-white" />
          </div>
          <div>
            <h1 className="head-text text-2xl sm:text-3xl">My Orders</h1>
            <p className="text-primary text-sm">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-secondary rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-4 sm:p-6 bg-btn dark:bg-btn-dark bg-opacity-10 border-b-2 border-btn dark:border-btn-dark">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-primary font-bold text-lg">
                        Order #{order.orderId}
                      </span>
                      Order Status : {order.orderStatus}
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm opacity-70">
                      <Calendar size={16} />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-btn dark:bg-btn-dark text-white px-4 py-2 rounded-lg">
                    <DollarSign size={20} />
                    <span className="font-bold text-2xl">{order.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
                      <Package size={20} className="text-btn dark:text-btn-dark" />
                      Order Items ({order.items?.length || 0})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-bg-light dark:bg-bg-dark rounded-lg p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="w-20 h-20 bg-bg-secondary dark:bg-bg-secondary-dark rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={28} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-primary font-semibold text-sm line-clamp-2 mb-1">
                              {item.product?.name || "Product"}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-primary text-xs opacity-70">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-btn dark:text-btn-dark font-bold text-sm">
                                ${item.product?.price || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Order Details */}
                  <div className="lg:col-span-1">
                    <div className="flex flex-col gap-4">
                      {/* Customer Info */}
                      <div className="bg-bg-light dark:bg-bg-dark rounded-lg p-4">
                        <h3 className="text-primary font-bold text-sm mb-3 flex items-center gap-2">
                          <User size={16} className="text-btn dark:text-btn-dark" />
                          Customer Info
                        </h3>
                        <div className="flex flex-col gap-2 text-xs">
                          <div className="flex items-center gap-2 text-primary">
                            <User size={14} className="opacity-70" />
                            <span>{order.shippingAddress?.fullname || user?.fullname}</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary">
                            <Mail size={14} className="opacity-70" />
                            <span className="truncate">{order.shippingAddress?.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary">
                            <Phone size={14} className="opacity-70" />
                            <span>{order.shippingAddress?.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="bg-bg-light dark:bg-bg-dark rounded-lg p-4">
                          <h3 className="text-primary font-bold text-sm mb-3 flex items-center gap-2">
                            <MapPin size={16} className="text-btn dark:text-btn-dark" />
                            Shipping Address
                          </h3>
                          <div className="text-primary text-xs leading-relaxed opacity-80">
                            <p>{order.shippingAddress.street}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                            <p>{order.shippingAddress.postalCode}</p>
                            <p className="font-semibold mt-1">{order.shippingAddress.country}</p>
                          </div>
                        </div>
                      )}

                      {/* Payment Info */}
                      <div className="bg-bg-light dark:bg-bg-dark rounded-lg p-4">
                        <h3 className="text-primary font-bold text-sm mb-3 flex items-center gap-2">
                          <CreditCard size={16} className="text-btn dark:text-btn-dark" />
                          Payment
                        </h3>
                        <div className="flex flex-col gap-2 text-xs">
                          <div className="flex justify-between text-primary">
                            <span className="opacity-70">Subtotal:</span>
                            <span className="font-semibold">${order.totalPrice}</span>
                          </div>
                          <div className="flex justify-between text-primary">
                            <span className="opacity-70">Shipping:</span>
                            <span className="font-semibold text-green-500">Free</span>
                          </div>
                          <hr className="border-bg-secondary-dark dark:border-bg-secondary my-1" />
                          <div className="flex justify-between text-primary">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-btn dark:text-btn-dark text-base">
                              ${order.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      <div className="bg-btn dark:bg-btn-dark bg-opacity-10 border-2 border-btn dark:border-btn-dark rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck size={16} className="text-btn dark:text-btn-dark" />
                          <span className="text-primary font-bold text-sm">
                            Order Status
                          </span>
                        </div>
                        <p className="text-primary text-xs opacity-70">
                          {order.orderStatus === "delivered"
                            ? "Your order has been delivered successfully!"
                            : order.orderStatus === "shipping"
                            ? "Your order is on the way!"
                            : order.orderStatus === "processing"
                            ? "We're preparing your order for shipment."
                            : "Your order is being processed."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {showMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMore}
              className="product-links text-white hover:bg-hover dark:hover:bg-hover-dark"
            >
              <ChevronDown size={20} />
              <span>Load More Orders</span>
            </button>
          </div>
        )}

        {/* Loading More State */}
        {loading && orders.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3">
              <div className="loader"></div>
              <p className="text-primary">Loading more orders...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrders;