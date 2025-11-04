import { useState, useRef } from "react";
import api from "../axiosInstance";
import { toast } from "react-toastify";
import {
  Upload,
  X,
  Package,
  ChevronLeftCircleIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    mainCategoryName: "",
    subCategoryName: "",
    stock: "",
    price: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const totalImages = files.length + images.length
    if ( totalImages > 3) {
      toast.error("You can upload maximum 3 images");
      return;
    }
    setImages([...images, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleReset = () => {
    setProduct({
      name: "",
      description: "",
      mainCategoryName: "",
      subCategoryName: "",
      stock: "",
      price: "",
    });
    setImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    for (const key in product) {
      formData.append(key, product[key]);
    }
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await api.post("/api/v1/product/create-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setProduct({
        name: "",
        description: "",
        mainCategoryName: "",
        subCategoryName: "",
        stock: "",
        price: "",
      });
      setImages([]);
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log(`Error occurred while creating product: ${error.message}`);
      toast.error(error.message || "Error occurred while creating product");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-3">
        <div className="product-links">
          <Package size={28} className="text-white" />
          <h3 className="sub-text">Create Product</h3>
        </div>
        <div
          onClick={() => navigate("/dashboard/products")}
          className="product-links"
        >
          <ChevronLeftCircleIcon size={28} className="text-white" />
          <Link className="sub-text">Back To Product</Link>
        </div>
      </div>
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
                placeholder="e.g Men, Women"
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
                placeholder="e.g T-Shirts, Jeans, Shoes"
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
              Product Images * (Max 3 Total)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="product-image"
            >
              <Upload size={40} className="text-btn dark:text-btn-dark" />
              <p className="text-primary text-center">Click to upload images</p>
              <p className="text-primary text-sm opacity-70">
                PNG, JPG or WEBP (Max 3 images)
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
              <div className="grid grid-cols-5 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="cross-btn"
                    >
                      <X size={16} />
                    </button>
                    <div className="image-no">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-auth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Product..." : "Create Product"}
            </button>
            <button
              onClick={handleReset}
              type="button"
              className="btn-primary px-6 py-2 bg-btn font-semibold text-white"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
