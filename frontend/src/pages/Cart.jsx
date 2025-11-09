import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import { resetCartCount, setCartCount } from "../redux/features/cartSlice";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/v1/cart/my-cart");
        if (res) setCart(res.data.data.cart);
      } catch (error) {
        console.log(`Cart Fetching Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleIncreaseQuantity = async (productId) => {
    try {
      const res = await api.put(`/api/v1/cart/update-cart/${productId}`, {
        action: "increase",
      });
      if (res) {
        setCart(res.data.data.cart);
        toast.info("Quantity increased");
        dispatch(setCartCount({ count: res.data.data.cart.totalItems }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to increase quantity");
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const res = await api.put(`/api/v1/cart/update-cart/${productId}`, {
        action: "decrease",
      });
      if (res) {
        setCart(res.data.data.cart);
        toast.info("Quantity decreased");
        dispatch(setCartCount({ count: res.data.data.cart.totalItems }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to decrease quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await api.delete(
        `/api/v1/cart/remove-from-cart/${productId}`
      );
      if (res) {
        setCart(res.data.data.cart);
        toast.warn("Product removed from cart");
        dispatch(setCartCount({ count: res.data.data.cart.totalItems }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove Product");
    }
  };

  if (loading) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container min-h-screen">
      {cart && cart.items?.length > 0 ? (
        <div className="sub-container">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b-2 border-bg-secondary-dark dark:border-bg-secondary pb-4">
              <h1 className="head-text">Shopping Cart</h1>
              <p className="text-primary">
                {cart.totalItems} {cart.totalItems === 1 ? "Item" : "Items"}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {cart.items?.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-secondary rounded-xl p-4 flex gap-4 shadow-md hover:shadow-lg transition-shadow sm:p-6"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg border-2 border-btn dark:border-btn-dark"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="sub-text mb-2">{item.product.name}</h3>
                      <p className="text-primary opacity-80">
                        Price: ${item.product.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-primary">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(item.product._id)
                            }
                            className="px-3 py-1 bg-gray-200 rounded-lg"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 bg-btn dark:bg-btn-dark text-white rounded-lg font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleIncreaseQuantity(item.product._id)
                            }
                            className="px-3 py-1 bg-gray-200 rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="sub-text">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-secondary rounded-xl p-6 shadow-lg sticky top-20">
              <h2 className="sub-text mb-6 border-b-2 border-bg-secondary-dark dark:border-bg-secondary pb-3">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-primary">Subtotal:</span>
                  <span className="text-primary font-semibold">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-primary">Shipping:</span>
                  <span className="text-primary font-semibold">Free</span>
                </div>

                <div className="border-t-2 border-bg-secondary-dark dark:border-bg-secondary pt-4">
                  <div className="flex justify-between items-center">
                    <span className="sub-text">Total:</span>
                    <span className="head-text text-2xl sm:text-3xl">
                      ${cart.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/shipping-address"
                className="btn-auth flex justify-center items-center px-5"
              >
                Proceed to Shipping Details
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 min-h-[60vh]">
          <div className="text-center">
            <h2 className="head-text mb-4">Your Cart is Empty</h2>
            <p className="text-primary mb-8">Add some items to get started!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
