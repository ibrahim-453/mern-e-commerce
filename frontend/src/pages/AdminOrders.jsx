import { Edit, PackageCheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../axiosInstance';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
      const [loading, setLoading] = useState(false);
      const { isAuthenticated } = useSelector((state) => state.auth);
      const [showMore, setShowMore] = useState(true);
      const navigate = useNavigate();
      const limit = 9;
    
      useEffect(() => {
        const fetchOrders = async () => {
          setLoading(true);
          try {
            const res = await api.get(
              `/api/v1/order/get-admin-orders?startIndex=0&limit=${limit}`
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
            `/api/v1/order/get-admin-orders?startIndex=${startIndex}&limit=${limit}`
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
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="loader"></div>
            <p className="text-primary">Loading Orders...</p>
          </div>
        </div>
      );
    }
  
    if (orders.length === 0 && !loading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-6">
          <div className="p-6 bg-secondary rounded-full">
            <PackageCheckIcon size={64} className="text-btn dark:text-btn-dark" />
          </div>
          <h3 className="sub-text text-center">No Orders Found</h3>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-btn dark:bg-btn-dark rounded-full">
              <PackageCheckIcon size={28} className="text-white" />
            </div>
            <div>
              <h1 className="head-text text-2xl sm:text-3xl">Orders</h1>
              <p className="text-primary text-sm">
                {orders.length} order{orders.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>
        </div>
  
        <div className="bg-secondary rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-btn dark:bg-btn-dark text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Sr. No
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Customer Name
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Customer Email
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Customer City
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Customer Country
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Total Price
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Total Items
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.orderId}
                    className="border-b bg-secondary hover:bg-bg-light dark:hover:bg-bg-dark transition-colors"
                  >
                    <td className="px-4 py-4 text-primary font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-4 text-primary font-semibold max-w-xs truncate">
                      {order.shippingAddress?.fullname}
                    </td>
                    <td className="px-4 py-4 text-primary font-semibold max-w-xs truncate">
                      {order.shippingAddress?.email}
                    </td>
                    <td className="px-4 py-4 text-primary font-semibold max-w-xs truncate">
                      {order.shippingAddress?.city}
                    </td>
                    <td className="px-4 py-4 text-primary font-semibold max-w-xs truncate">
                      {order.shippingAddress?.country}
                    </td>
                    <td className="px-4 py-4 text-primary font-semibold">
                      ${order.totalPrice}
                    </td>
                    <td className="px-4 py-4">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-4">
                      {order.orderStatus}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/change-order-status/${order.orderId}`)
                          }
                          className="p-2 hover:bg-btn dark:hover:bg-btn-dark hover:text-white rounded-md transition-colors"
                          title="Change Status"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {showMore && !loading && (
          <div className="flex justify-center pt-4">
            <button onClick={handleShowMore} className="product-links">
              <ChevronDown size={20} />
              <span>Show More</span>
            </button>
          </div>
        )}
        {loading && orders.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3">
              <div className="loader"></div>
              <p className="text-primary">Loading more orders...</p>
            </div>
          </div>
        )}
      </div>
    );
}

export default AdminOrders