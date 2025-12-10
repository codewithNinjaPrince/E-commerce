import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTimes, FaUpload } from "react-icons/fa";

const EditProduct = () => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("merchantToken");

  // ---------------- IMAGE STATES ----------------
  const [images, setImages] = useState(Array(10).fill(null));
  const [existingImages, setExistingImages] = useState([]);

  // ---------------- FORM FIELDS ----------------
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

  // ---------------- FETCH PRODUCT ----------------
  const fetchProduct = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/merchant/product/single`,
        { productId: id },
        { headers: { token } }
      );

      if (response.data.success) {
        const product = response.data.product;

        setBrandName(product.brandName);
        setName(product.name);
        setDescription(product.description);
        setActualPrice(product.actualPrice);
        setDiscountedPrice(product.discountedPrice);
        setOfferCode(product.offerCode);
        setReview(product.review);
        setNoOfPeopleReviewed(product.noOfPeopleReviewed);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setSizes(product.sizes);
        setBestseller(product.bestseller);

        setExistingImages(product.image);
      }
    } catch (err) {
      toast.error("Failed to load product");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // ---------------- IMAGE HANDLING ----------------
  const handleUpload = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...images];
    updated[idx] = file;
    setImages(updated);
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index) => {
    const updated = [...images];
    updated[index] = null;
    setImages(updated);
  };

  // ---------------- UPDATE PRODUCT ----------------
  const submitHandler = async (e) => {
    e.preventDefault();

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

      // EXISTING IMAGES
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
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading)
    return <div className="text-white p-6">Loading product details...</div>;

  return (
    <div
      className="
    w-full max-w-[1600px] mx-auto 
    p-4 sm:p-6 text-white 
    pt-[30px] sm:pt-[60px] lg:pt-[50px]
  "
    >
      {/* CENTER CONTENT SAME AS ADD PRODUCT UI */}

      <form
        onSubmit={submitHandler}
        className="w-full max-w-5xl bg-[#151515] border border-[#222] rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-8"
      >
        <h2 className="text-2xl font-bold">✏ Edit Product</h2>

        {/* ---------------- EXISTING IMAGES ---------------- */}
        <div>
          <p className="font-semibold text-lg mb-3">Existing Images</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {existingImages.map((img, i) => (
              <div
                key={i}
                className="relative border border-[#333] bg-[#0f0f0f] rounded-lg overflow-hidden aspect-square"
              >
                <img src={img} className="w-full h-full object-cover" />

                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute top-1 right-1 px-2 py-1 bg-black/80 text-xs rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- NEW IMAGES ---------------- */}
        <div>
          <p className="font-semibold text-lg mb-3">Upload New Images</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative border border-[#333] bg-[#0f0f0f] rounded-lg overflow-hidden aspect-square flex justify-center items-center"
              >
                {img ? (
                  <>
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
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
                      onChange={(e) => handleUpload(e, index)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* -------- BASIC FIELDS -------- */}
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

        {/* -------- DESCRIPTION -------- */}
        <div>
          <p className="mb-1">Description</p>
          <textarea
            className="input-box min-h-[120px] bg-[#0f0f0f] border border-[#333]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* -------- CATEGORY -------- */}
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

        {/* -------- PRICES -------- */}
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

        {/* -------- REVIEWERS -------- */}
        <div>
          <p className="mb-1">No. of People Reviewed</p>
          <input
            type="number"
            className="input-box max-w-sm bg-[#0f0f0f] border border-[#333]"
            value={noOfPeopleReviewed}
            onChange={(e) => setNoOfPeopleReviewed(e.target.value)}
          />
        </div>

        {/* -------- SIZES -------- */}
        <div>
          <p className="mb-1">Sizes</p>
          <div className="flex flex-wrap gap-3">
            {["S", "M", "L", "XL", "XXL"].map((sz) => (
              <div
                key={sz}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(sz)
                      ? prev.filter((x) => x !== sz)
                      : [...prev, sz]
                  )
                }
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

        {/* -------- BESTSELLER -------- */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={() => setBestseller(!bestseller)}
          />
          <span>Mark as Bestseller</span>
        </div>

        {/* -------- SUBMIT BUTTON -------- */}
        <button className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-semibold cursor-pointer">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
