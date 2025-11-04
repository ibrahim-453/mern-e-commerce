import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import {
  Package,
  Edit,
  Trash2,
  Plus,
  Search,
  Eye,
  ChevronDown,
  DollarSign,
  Archive,
} from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const limit = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/v1/product/dashboard/admin-products?startIndex=0&limit=${limit}`
        );
        if (res) {
          setProducts(res.data.data.products || []);
          if (res.data.data.products.length < limit) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(`Error Occurred While Fetching Products: ${error.message}`);
        toast.error(
          error.response?.data?.message ||
            "Error Occurred While Fetching Products"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleShowMore = async () => {
    const startIndex = products.length;
    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/product/dashboard/get-products?startIndex=${startIndex}&limit=${limit}`
      );
      if (res) {
        setProducts([...products, ...res.data.data.products]);
        if (res.data.data.products.length < limit) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(`Error Occurred While Fetching Products: ${error.message}`);
      toast.error(error.message || "Error Occurred While Fetching Products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await api.delete(
          `/api/v1/product/dashboard/delete-product/${productId}`
        );
        if (res) {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(`Error Occurred While Deleting Product: ${error.message}`);
        toast.error(error.message || "Error Occurred While Deleting Product");
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-6">
        <div className="p-6 bg-secondary rounded-full">
          <Package size={64} className="text-btn dark:text-btn-dark" />
        </div>
        <h3 className="sub-text text-center">No Products Found</h3>
        <p className="text-primary text-center">
          Start by adding your first product
        </p>
        <Link to="/dashboard/create-product" className="product-links">
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-btn dark:bg-btn-dark rounded-full">
            <Package size={28} className="text-white" />
          </div>
          <div>
            <h1 className="head-text text-2xl sm:text-3xl">Products</h1>
            <p className="text-primary text-sm">
              {products.length} product{products.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <Link to="/dashboard/create-product" className="product-links">
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
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
                  Image
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Price
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Stock
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p._id}
                  className="border-b bg-secondary hover:bg-bg-light dark:hover:bg-bg-dark transition-colors"
                >
                  <td className="px-4 py-4 text-primary font-medium">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-bg-secondary-dark dark:border-bg-secondary"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-primary font-semibold max-w-xs truncate">
                    {p.name}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-primary font-medium">
                        {p.mainCategory}
                      </span>
                      <span className="text-primary text-xs opacity-70">
                        {p.subCategory}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-primary font-semibold">
                    ${p.price}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.stock > 10
                          ? "bg-green-500 text-white"
                          : p.stock > 0
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/product/${p.slug}`)}
                        className="p-2 hover:bg-blue-500 hover:text-white rounded-md transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit-product/${p._id}`)
                        }
                        className="p-2 hover:bg-btn dark:hover:bg-btn-dark hover:text-white rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
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
      {loading && products.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3">
            <div className="loader"></div>
            <p className="text-primary">Loading more products...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
