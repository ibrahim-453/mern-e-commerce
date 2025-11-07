import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import {
  Share2,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setCartCount } from "../redux/features/cartSlice";

function SingleProduct() {
  const { mainCategoryName, subCategoryName, productName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/v1/product/get-products?mainCategoryName=${mainCategoryName}&subCategoryName=${subCategoryName}&slug=${encodeURIComponent(
            productName
          )}`
        );
        if (res) {
          setProduct(res.data.data?.products[0]);
        }
      } catch (error) {
        console.log(`Product Fetching Error: ${error.message}`);
        toast.error(error.message || "Failed to fetch product");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [mainCategoryName, subCategoryName, productName]);

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await api.post(`/api/v1/cart/add-to-cart/${productId}`, {
        quantity: 1,
      });
      if (res) {
        toast.success(res.data.message);

        const cartRes = await api.get("/api/v1/cart/my-cart");
        const total = cartRes.data?.data?.cart?.totalItems || 0;

        dispatch(setCartCount({ count: total }));
      }
    } catch (error) {
      console.log(`Add To Cart Error: ${error.message}`);
      toast.error(error.response.data.message || "Failed to add product to cart");
    }
  };
  if (loading) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-6 bg-secondary rounded-full">
            <Package size={64} className="text-btn dark:text-btn-dark" />
          </div>
          <h3 className="sub-text">Product Not Found</h3>
          <button
            onClick={() => navigate("/")}
            className="product-links text-white hover:bg-hover dark:hover:bg-hover-dark"
          >
            <ArrowLeft size={20} />
            <span>Go to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container min-h-screen p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-btn dark:hover:text-btn-dark transition-colors font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col gap-4">
            <div className="relative bg-secondary rounded-lg overflow-hidden aspect-square group">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <ChevronRight size={24} />
                      </button>

                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedImage + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={96} className="text-gray-400" />
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-btn dark:border-btn-dark scale-105 shadow-lg"
                        : "border-bg-secondary-dark dark:border-bg-secondary hover:border-btn dark:hover:border-btn-dark"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-2 bg-btn dark:bg-btn-dark text-white text-sm font-semibold rounded-full">
                {product.mainCategory}
              </span>
              {product.subCategory && (
                <span className="px-4 py-2 bg-secondary text-primary text-sm font-semibold rounded-full">
                  {product.subCategory}
                </span>
              )}
            </div>

            <h1 className="head-text">{product.name}</h1>

            <div className="flex items-center gap-3 py-4 border-y border-bg-secondary-dark dark:border-bg-secondary">
              <span className="text-4xl sm:text-5xl font-bold text-btn dark:text-btn-dark">
                ${product.price}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {product.stock >= 10 ? (
                <>
                  <Check size={20} className="text-green-500" />
                  <span className="text-primary font-semibold">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <Check size={20} className="text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">
                    Low Stock ({product.stock} left)
                  </span>
                </>
              ) : (
                <>
                  <X size={20} className="text-red-500" />
                  <span className="text-red-500 font-semibold">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            <div className="bg-secondary rounded-lg p-4">
              <h3 className="sub-text text-lg mb-3">Description</h3>
              <p className="text-primary leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={product.stock === 0}
                className="flex-1 product-links text-white justify-center hover:bg-hover dark:hover:bg-hover-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ShoppingCart size={20} />
                <span className="font-semibold">Add to Cart</span>
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full border-2 border-btn dark:border-btn-dark text-btn dark:text-btn-dark hover:bg-btn hover:dark:bg-btn-dark hover:text-white transition-all"
              >
                <Share2 size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-bg-secondary-dark dark:border-bg-secondary">
              <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                <div className="p-2 bg-btn dark:bg-btn-dark rounded-lg flex-shrink-0">
                  <Truck size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm">
                    Free Shipping
                  </p>
                  <p className="text-primary text-xs opacity-70">
                    Orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                <div className="p-2 bg-btn dark:bg-btn-dark rounded-lg flex-shrink-0">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm">
                    Secure Payment
                  </p>
                  <p className="text-primary text-xs opacity-70">
                    100% protected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                <div className="p-2 bg-btn dark:bg-btn-dark rounded-lg flex-shrink-0">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm">
                    Easy Returns
                  </p>
                  <p className="text-primary text-xs opacity-70">
                    30-day policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
