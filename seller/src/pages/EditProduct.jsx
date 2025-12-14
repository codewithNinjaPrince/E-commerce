import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";

const EditProduct = () => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("merchantToken");
  const navigate = useNavigate();

  // ------------------------------------
  // STATES
  // ------------------------------------
  const [images, setImages] = useState(Array(10).fill(null)); // new images
  const [existingImages, setExistingImages] = useState([]); // already saved images

  const [brandName, setBrandName] = useState("");
  const [name, setName] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [review, setReview] = useState(0);
  const [noOfPeopleReviewed, setNoOfPeopleReviewed] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For drag reorder
  const [dragIndex, setDragIndex] = useState(null);
  const [dragType, setDragType] = useState(null); // "existing" or "new"

  // ------------------------------------
  // FETCH PRODUCT
  // ------------------------------------
  const fetchProduct = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/merchant/product/single`,
        { productId: id },
        { headers: { token } }
      );

      if (response.data.success) {
        const p = response.data.product;

        setBrandName(p.brandName);
        setName(p.name);
        setDescription(p.description);
        setActualPrice(p.actualPrice);
        setDiscountedPrice(p.discountedPrice);
        setOfferCode(p.offerCode);
        setReview(p.review);
        setNoOfPeopleReviewed(p.noOfPeopleReviewed);
        setCategory(p.category);
        setSubCategory(p.subCategory);
        setSizes(p.sizes);
        setBestseller(p.bestseller);

        setExistingImages(p.image);
      }
    } catch {
      toast.error("Failed to load product");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // ------------------------------------
  // IMAGE HANDLERS
  // ------------------------------------

  const handleUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const removeExistingImage = (i) => {
    const updated = [...existingImages];
    updated.splice(i, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (i) => {
    const updated = [...images];
    updated[i] = null;
    setImages(updated);
  };

  // DRAG START
  const handleDragStart = (index, type) => {
    setDragIndex(index);
    setDragType(type); // "existing" or "new"
  };

  // DRAG OVER
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // DROP (ONLY REORDER INSIDE SAME GROUP)
  const handleDrop = (dropIndex, type) => {
    if (dragType !== type) return; // cannot mix

    if (type === "existing") {
      const updated = [...existingImages];
      const moved = updated.splice(dragIndex, 1)[0];
      updated.splice(dropIndex, 0, moved);
      setExistingImages(updated);
    }

    if (type === "new") {
      const updated = [...images];
      const moved = updated.splice(dragIndex, 1)[0];
      updated.splice(dropIndex, 0, moved);
      setImages(updated);
    }
  };

  // ------------------------------------
  // SORT SIZES
  // ------------------------------------
  const sizeOrder = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const toggleSize = (sz) => {
    setSizes((prev) => {
      let updated = prev.includes(sz)
        ? prev.filter((x) => x !== sz)
        : [...prev, sz];

      updated.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
      return updated;
    });
  };

  // ------------------------------------
  // SUBMIT
  // ------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("productId", id);
      formData.append("brandName", brandName);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("actualPrice", actualPrice);
      formData.append("discountedPrice", discountedPrice);
      formData.append("offerCode", offerCode);
      formData.append("review", review);
      formData.append("noOfPeopleReviewed", noOfPeopleReviewed);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      // NEW images
      images.forEach((img) => {
        if (img) formData.append("images", img);
      });

      // EXISTING images
      formData.append("existingImages", JSON.stringify(existingImages));

      const response = await axios.post(
        `${backendUrl}/api/merchant/product/update`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product Updated Successfully!");
        setTimeout(() => {
          navigate("/products"); // ✅ change route if yours is different
        }, 200);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }

    setSaving(false);
  };

  if (loading)
    return <div className="text-white p-6">Loading product details...</div>;

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 text-white pt-[30px] sm:pt-[60px] lg:pt-[50px]">
      {/* LOADING OVERLAY */}
      {saving && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="w-full max-w-5xl bg-[#151515] border border-[#222] rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-8"
      >
        <h2 className="text-2xl font-bold">✏ Edit Product</h2>

        {/* EXISTING IMAGES */}
        <div>
          <p className="font-semibold text-lg mb-3">Existing Images</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {existingImages.map((img, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleDragStart(i, "existing")}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(i, "existing")}
                className="relative border border-[#333] rounded-lg overflow-hidden aspect-square cursor-pointer"
              >
                <img src={img} className="w-full h-full object-cover" />

                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute top-1 right-1 bg-black/80 px-2 py-1 text-xs rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* NEW IMAGES */}
        <div>
          <p className="font-semibold text-lg mb-3">Upload New Images</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                draggable={!!img}
                onDragStart={() => img && handleDragStart(i, "new")}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(i, "new")}
                className="relative border border-[#333] rounded-lg overflow-hidden aspect-square flex justify-center items-center cursor-pointer"
              >
                {img ? (
                  <>
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-black/80 px-2 py-1 text-xs rounded cursor-pointer"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer">
                    <FaUpload className="text-xl" />
                    <span className="text-xs">Add</span>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleUpload(e, i)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BASIC FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="mb-1">Brand Name</p>
            <input
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-1">Product Name</p>
            <input
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <p className="mb-1">Description</p>
          <textarea
            className="input-box min-h-[120px] bg-[#0f0f0f] border border-[#333]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="mb-1">Category</p>
            <select
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          <div>
            <p className="mb-1">Sub Category</p>
            <select
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-1">Rating</p>
            <input
              type="number"
              step="0.1"
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
        </div>

        {/* PRICES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="mb-1">Actual Price</p>
            <input
              type="number"
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-1">Discounted Price</p>
            <input
              type="number"
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-1">Offer Code</p>
            <input
              className="input-box bg-[#0f0f0f] border border-[#333]"
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
            />
          </div>
        </div>

        {/* REVIEWERS */}
        <div>
          <p className="mb-1">No. of People Reviewed</p>
          <input
            type="number"
            className="input-box max-w-sm bg-[#0f0f0f] border border-[#333]"
            value={noOfPeopleReviewed}
            onChange={(e) => setNoOfPeopleReviewed(e.target.value)}
          />
        </div>

        {/* SIZES */}
        <div>
          <p className="mb-1">Sizes</p>
          <div className="flex flex-wrap gap-3">
            {sizeOrder.map((sz) => (
              <div
                key={sz}
                onClick={() => toggleSize(sz)}
                className={`px-4 py-1 rounded cursor-pointer ${
                  sizes.includes(sz)
                    ? "bg-blue-600 text-white"
                    : "bg-[#222] text-gray-300 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {sz}
              </div>
            ))}
          </div>
        </div>

        {/* BESTSELLER */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={() => setBestseller(!bestseller)}
          />
          <span>Mark as Bestseller</span>
        </div>

        {/* SUBMIT */}
        <button
          disabled={saving}
          className={`bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-semibold cursor-pointer ${
            saving && "opacity-50 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
