import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../axiosInstance";
import { Upload, X, Package, ChevronLeft, ChevronLeftCircleIcon } from "lucide-react";

function EditProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    mainCategoryName: "",
    subCategoryName: "",
    stock: "",
    price: "",
  });
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setFetchLoading(true);
      try {
        const res = await api.get(
          `/api/v1/product/dashboard/admin-products?productId=${productId}`
        );
        const productData = res.data.data.products[0];
        if (res) {
          setProduct({
            name: productData.name,
            description: productData.description,
            mainCategoryName: productData.mainCategory,
            subCategoryName: productData.subCategory,
            stock: productData.stock,
            price: productData.price,
          });
          setExistingImages(productData.images || []);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to load product details"
        );
        navigate("/dashboard/products");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const totalImages = existingImages.length + images.length + files.length;
    if (totalImages > 3) {
      toast.error("You can upload a maximum of 3 images");
      return;
    }

    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    const updatedExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedExistingImages);
  };

  const removeNewImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingImages.length + images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }
    images.forEach((img) => formData.append("images", img));
    formData.append("existingImages", JSON.stringify(existingImages));

    setLoading(true);
    try {
      const res = await api.put(
        `/api/v1/product/dashboard/edit-product/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res) {
        toast.success(res.data.message || "Product updated successfully");
        navigate("/dashboard/products");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-3">
        <div className="product-links">
          <Package size={28} className="text-white" />
          <h3 className="sub-text">Edit Product</h3>
        </div>
        <div
          onClick={() => navigate("/dashboard/products")}
          className="product-links"
        >
          <ChevronLeftCircleIcon size={28} className="text-white" />
          <Link className="sub-text">Back To Product</Link>
        </div>
      </div>
      {/* Form */}
      <div className="bg-secondary rounded-lg p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="input-field">
              <label htmlFor="name" className="text-primary font-semibold">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="input text-primary"
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="price" className="text-primary font-semibold">
                Price ($) *
              </label>
              <input
                type="number"
                placeholder="0.00"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="input text-primary"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="stock" className="text-primary font-semibold">
                Stock Quantity *
              </label>
              <input
                type="number"
                placeholder="0"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="input text-primary"
                min="0"
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="description" className="text-primary font-semibold">
              Description *
            </label>
            <textarea
              placeholder="Enter product description"
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="input text-primary min-h-32 resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-field">
              <label
                htmlFor="mainCategoryName"
                className="text-primary font-semibold"
              >
                Main Category *
              </label>
              <input
                id="mainCategoryName"
                name="mainCategoryName"
                value={product.mainCategoryName}
                onChange={handleChange}
                className="input text-primary"
                required
              ></input>
            </div>

            <div className="input-field">
              <label
                htmlFor="subCategoryName"
                className="text-primary font-semibold"
              >
                Sub Category *
              </label>
              <input
                type="text"
                placeholder="e.g., T-Shirts, Jeans, Shoes"
                id="subCategoryName"
                name="subCategoryName"
                value={product.subCategoryName}
                onChange={handleChange}
                className="input text-primary"
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label className="text-primary font-semibold">
              Product Images * (Max 3 total)
            </label>
            {existingImages.length > 0 && (
              <div>
                <p className="text-primary text-sm mb-3 opacity-70">
                  Existing Images ({existingImages.length})
                </p>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={image}
                        alt={`Existing ${index + 1}`}
                        className="preview-image"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="cross-btn"
                      >
                        <X size={16} />
                      </button>
                      <div className="image-no">Current #{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="product-image"
            >
              <Upload size={40} className="text-btn dark:text-btn-dark" />
              <p className="text-primary text-center">
                Click to upload new images
              </p>
              <p className="text-primary text-sm opacity-70">
                PNG, JPG or WEBP ({existingImages.length + images.length}/3
                images)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImage}
              className="hidden"
            />

            {imagePreviews.length > 0 && (
              <div>
                <p className="text-primary text-sm mb-3 mt-4 opacity-70">
                  New Images ({imagePreviews.length})
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="preview-image"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="cross-btn"
                      >
                        <X size={16} />
                      </button>
                      <div className="image-no">New #{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-auth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating Product..." : "Update Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              className="btn-primary px-6 py-2 bg-btn font-semibold text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
