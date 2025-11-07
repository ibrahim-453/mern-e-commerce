import api from "../axiosInstance";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Package,
  ChevronDown,
  ShoppingBag,
  DollarSign,
  Archive,
} from "lucide-react";
import { toast } from "react-toastify";

function ProductByCategory() {
  const { mainCategoryName } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/v1/category/categories/${mainCategoryName}/products?startIndex=0&limit=${limit}`
        );
        if (res) {
          setProduct(res.data.data.products || []);
          if (res.data.data?.products.length < limit) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(`Product Fetching Error: ${error.message}`);
        toast.error(
          error.response?.data?.message || "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [mainCategoryName]);

  useEffect(() => {
    const fetchCategory = async () => {
      setCategoryLoading(true);
      try {
        const res = await api.get(
          `/api/v1/category/categories/${mainCategoryName}/subCategories`
        );
        if (res) {
          setSubCategory(res.data.data?.subCategory || []);
        }
      } catch (error) {
        console.log(`Sub Category Error: ${error.message}`);
        toast.error("Failed to fetch categories");
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategory();
  }, [mainCategoryName]);

  const handleShowMore = async () => {
    const startIndex = product.length;
    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/category/categories/${mainCategoryName}/products?startIndex=${startIndex}&limit=${limit}`
      );
      if (res) {
        setProduct([...product, ...res.data.data.products]);
        if (res.data.data.products.length < limit) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(`Product Fetching Error: ${error.message}`);
      toast.error("Failed to load more products");
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading && product.length === 0) {
    return (
      <div className="main-container min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container min-h-screen p-0">
      <div className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-btn dark:bg-btn-dark rounded-full">
              <ShoppingBag size={48} className="text-white" />
            </div>
            <h1 className="head-text">{mainCategoryName} Collection</h1>
            <p className="text-primary text-lg">
              Discover our exclusive {mainCategoryName.toLowerCase()} collection
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-12">
        {!categoryLoading && subCategory.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-row items-center gap-4 justify-center">
              <Link
                to={`/products/category/${mainCategoryName}`}
                className="btn-primary bg-secondary text-primary font-semibold px-5 py-2 hover:bg-btn hover:dark:bg-btn-dark hover:text-white"
              >
                All Products
              </Link>
              {subCategory.map((item, index) => (
                <Link
                  to={`/products/category/${mainCategoryName}/${item}`}
                  key={index}
                  className="btn-primary bg-btn dark:bg-btn-dark text-white font-semibold px-5 py-2 hover:bg-hover hover:dark:bg-hover-dark"
                >
                  {capitalizeFirst(item)}
                </Link>
              ))}
            </div>
          </div>
        )}

        {product.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Archive size={20} />
              <span className="font-semibold">
                {product.length} product{product.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}

        {product.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {product.map((item, index) => (
              <div
                key={index}
                className="group bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {item.images ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      src={item.images[0]}
                      alt={item.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={64} className="text-gray-400" />
                    </div>
                  )}

                  {item.stock <= 10 && item.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Low Stock
                    </div>
                  )}
                  {item.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-primary font-bold text-base md:text-lg line-clamp-2 min-h-[3rem]">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-primary opacity-70">
                      {capitalizeFirst(item.subCategory)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <DollarSign
                        size={18}
                        className="text-btn dark:text-btn-dark"
                      />
                      <span className="text-primary font-bold text-xl">
                        {item.price}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/product/category/${mainCategoryName}/${item.subCategory}/${item.slug}`
                        )
                      }
                      className="px-3 py-1 bg-btn dark:bg-btn-dark text-white text-sm rounded-md hover:bg-hover dark:hover:bg-hover-dark transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="p-6  bg-secondary rounded-full">
                <Package size={64} className="text-btn dark:text-btn-dark" />
              </div>
              <h3 className="sub-text text-center">No Products Found</h3>
              <p className="text-primary text-center">
                No products available in this category yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="product-links text-white font-semibold hover:bg-hover dark:hover:bg-hover-dark transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          )
        )}

        {showMore && !loading && product.length > 0 && (
          <div className="flex justify-center mt-8 md:mt-12">
            <button
              onClick={handleShowMore}
              className="product-links text-white font-semibold hover:bg-hover dark:hover:bg-hover-dark transition-all duration-300"
            >
              <ChevronDown size={20} />
              <span>Load More</span>
            </button>
          </div>
        )}

        {loading && product.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3">
              <div className="loader"></div>
              <p className="text-primary">Loading more products...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductByCategory;
