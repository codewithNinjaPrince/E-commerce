import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  // 10 IMAGE SLOTS (null initially)
  const [images, setImages] = useState(Array(10).fill(null));
  const [dragIndex, setDragIndex] = useState(null);

  // ================= MULTIPLE IMAGE SELECT =================
  const handleMultiUpload = (e, slotIndex) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const updated = [...images];
    let insertIndex = slotIndex;

    files.forEach((file) => {
      if (insertIndex < 10) {
        updated[insertIndex] = file;
        insertIndex++;
      }
    });

    setImages(updated);
  };

  // ================= DRAG & DROP REORDER =================
  const handleReorder = (from, to) => {
    if (from === null || from === to) return;

    const updated = [...images];
    const temp = updated[from];
    updated[from] = updated[to];
    updated[to] = temp;

    setImages(updated);
    setDragIndex(null);
  };

  // ================= REMOVE IMAGE =================
  const removeImage = (i) => {
    const updated = [...images];
    updated[i] = null;
    setImages(updated);
  };

  // ================= FORM STATES =================
  const [brandName, setBrandName] = useState("");
  const [name, setName] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [review, setReview] = useState(0);
  const [noOfPeopleReviewed, setNoOfPeopleReviewed] = useState(0);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  // RESET FORM
  const resetForm = () => {
    setBrandName("");
    setName("");
    setActualPrice("");
    setDiscountedPrice("");
    setDescription("");
    setOfferCode("");
    setReview(0);
    setNoOfPeopleReviewed(0);
    setCategory("Men");
    setSubCategory("Topwear");
    setSizes([]);
    setBestseller(false);
    setImages(Array(10).fill(null));
  };

  // ================= SUBMIT FORM =================
  const submitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("merchantToken");
      const formData = new FormData();

      formData.append("brandName", brandName);
      formData.append("name", name);
      formData.append("actualPrice", actualPrice);
      formData.append("discountedPrice", discountedPrice);
      formData.append("description", description);
      formData.append("offerCode", offerCode);
      formData.append("review", review);
      formData.append("noOfPeopleReviewed", noOfPeopleReviewed);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      images.forEach((img) => {
        if (img) formData.append("images", img);
      });

      const res = await axios.post(
        `${backendUrl}/api/merchant/product/add`,
        formData,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Product Added Successfully!");
        resetForm();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error uploading product");
    }

    setLoading(false);
  };

  // =======================================================================
  //                              UI STARTS HERE
  // =======================================================================
  return (
    <div
      className="
    w-full max-w-[1600px] mx-auto 
    p-4 sm:p-6 text-white 
    pt-[30px] sm:pt-[60px] lg:pt-[50px]
  "
    >
      <form
        onSubmit={submitProduct}
        className="w-full max-w-5xl bg-[#151515] border border-[#222] text-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-8"
      >
        {/* ================= IMAGE GRID ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Upload Product Images</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleReorder(dragIndex, index)}
                className="relative border border-[#333] bg-[#0f0f0f] rounded-lg overflow-hidden aspect-square cursor-move"
              >
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs cursor-pointer">
                    Image {index + 1}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMultiUpload(e, index)}
                    />
                  </label>
                )}

                {img && (
                  <button
                    onClick={() => removeImage(index)}
                    type="button"
                    className="absolute top-1 right-1 px-2 py-1 text-xs bg-black/80 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= BASIC INFO ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="mb-1 font-medium">Brand Name</p>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="input-box w-full bg-[#0f0f0f] border border-[#333]"
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium">Product Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-box w-full bg-[#0f0f0f] border border-[#333]"
              required
            />
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div>
          <p className="mb-1 font-medium">Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-box w-full min-h-[120px] bg-[#0f0f0f] border border-[#333]"
            required
          ></textarea>
        </div>

        {/* ================= CATEGORY ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="mb-1 font-medium">Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-box bg-[#0f0f0f] border border-[#333]"
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          <div>
            <p className="mb-1 font-medium">Sub Category</p>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="input-box bg-[#0f0f0f] border border-[#333]"
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-1 font-medium">Rating</p>
            <input
              type="number"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="input-box bg-[#0f0f0f] border border-[#333]"
              required
            />
          </div>
        </div>

        {/* ================= PRICE ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="mb-1 font-medium">Actual Price</p>
            <input
              type="number"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
              className="input-box bg-[#0f0f0f] border border-[#333]"
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium">Discounted Price</p>
            <input
              type="number"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              className="input-box bg-[#0f0f0f] border border-[#333]"
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium">Offer Code</p>
            <input
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
              className="input-box bg-[#0f0f0f] border border-[#333]"
              placeholder="SAVE20"
            />
          </div>
        </div>

        {/* ================= NO OF REVIEWERS ================= */}
        <div>
          <p className="mb-1 font-medium">No. of People Reviewed</p>
          <input
            type="number"
            value={noOfPeopleReviewed}
            onChange={(e) => setNoOfPeopleReviewed(e.target.value)}
            className="input-box bg-[#0f0f0f] border border-[#333] max-w-sm"
            required
          />
        </div>

        {/* ================= SIZES ================= */}
        <div>
          <p className="mb-1 font-medium">Sizes</p>
          <div className="flex flex-wrap gap-3">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(s)
                      ? prev.filter((x) => x !== s)
                      : [...prev, s]
                  )
                }
                className={`px-4 py-1 rounded-md ${
                  sizes.includes(s)
                    ? "bg-blue-600 text-white"
                    : "bg-[#222] text-gray-300 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ================= BESTSELLER ================= */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={() => setBestseller(!bestseller)}
            className="w-4 h-4"
          />
          <span className="font-medium">Mark as Bestseller</span>
        </div>

        {/* ================= BUTTON ================= */}
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold transition"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 animate-spin rounded-full"></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
