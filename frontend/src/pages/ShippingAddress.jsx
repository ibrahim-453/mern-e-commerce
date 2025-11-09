import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../axiosInstance";
import {
  MapPin,
  ArrowLeft,
  CreditCard,
  Truck,
  ShoppingBag,
  Check,
} from "lucide-react";

function ShippingAddress() {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    fullname: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/v1/order/create-checkout-session", {
        shippingAddress,
      });

      if (res.data?.data?.url) {
        window.location.href = res.data.data.url;
      }
    } catch (error) {
      console.log(`Checkout Error: ${error.message}`);
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container min-h-screen p-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-btn dark:hover:text-btn-dark transition-colors font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-btn dark:bg-btn-dark rounded-full">
                  <MapPin size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="head-text text-2xl sm:text-3xl">
                    Shipping Address
                  </h1>
                  <p className="text-primary text-sm opacity-70">
                    Enter your delivery details
                  </p>
                </div>
              </div>
              <form onSubmit={handleCheckout} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-field">
                    <label
                      htmlFor="fullname"
                      className="text-primary font-semibold"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={shippingAddress.fullname}
                      onChange={handleChange}
                      className="input text-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="input-field">
                    <label
                      htmlFor="phone"
                      className="text-primary font-semibold"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      className="input text-primary"
                      placeholder="+1 234 567 8900"
                      required
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label
                    htmlFor="street"
                    className="text-primary font-semibold"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleChange}
                    className="input text-primary"
                    placeholder="123 Main Street, Apt 4B"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-field">
                    <label
                      htmlFor="city"
                      className="text-primary font-semibold"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      className="input text-primary"
                      placeholder="New York"
                      required
                    />
                  </div>

                  <div className="input-field">
                    <label
                      htmlFor="state"
                      className="text-primary font-semibold"
                    >
                      State / Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleChange}
                      className="input text-primary"
                      placeholder="NY"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-field">
                    <label
                      htmlFor="postalCode"
                      className="text-primary font-semibold"
                    >
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleChange}
                      className="input text-primary"
                      placeholder="10001"
                      required
                    />
                  </div>

                  <div className="input-field">
                    <label
                      htmlFor="country"
                      className="text-primary font-semibold"
                    >
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      className="input text-primary"
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="PK">Pakistan</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="flex flex-col gap-6">
              <div className="bg-secondary rounded-lg shadow-md p-6">
                <h3 className="sub-text text-lg mb-4">Delivery Information</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-btn dark:bg-btn-dark rounded-lg flex-shrink-0">
                      <Truck size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-primary font-semibold text-sm">
                        Free Shipping
                      </p>
                      <p className="text-primary text-xs opacity-70">
                        On orders over $50
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-btn dark:bg-btn-dark rounded-lg flex-shrink-0">
                      <ShoppingBag size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-primary font-semibold text-sm">
                        Delivery Time
                      </p>
                      <p className="text-primary text-xs opacity-70">
                        3-5 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-btn dark:bg-btn-dark rounded-lg flex-shrink-0">
                      <Check size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-primary font-semibold text-sm">
                        Secure Checkout
                      </p>
                      <p className="text-primary text-xs opacity-70">
                        SSL encrypted payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard
                    size={20}
                    className="text-btn dark:text-btn-dark"
                  />
                  <h3 className="text-primary font-bold">Secure Payment</h3>
                </div>
                <p className="text-primary text-sm opacity-70 leading-relaxed">
                  Your payment information is processed securely. We do not
                  store credit card details nor have access to your credit card
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingAddress;
