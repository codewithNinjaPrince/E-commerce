import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [loading, setLoading] = useState(false);

  // -------- ALL 10 image states ----------
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [image5, setImage5] = useState(false);
  const [image6, setImage6] = useState(false);
  const [image7, setImage7] = useState(false);
  const [image8, setImage8] = useState(false);
  const [image9, setImage9] = useState(false);
  const [image10, setImage10] = useState(false);

  const imageStates = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
  ];

  const setImageStates = [
    setImage1,
    setImage2,
    setImage3,
    setImage4,
    setImage5,
    setImage6,
    setImage7,
    setImage8,
    setImage9,
    setImage10,
  ];

  // -------- OTHER FIELDS --------
  const [brandName, setBrandName] = useState("");
  const [name, setName] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [review, setReview] = useState(0);
  const [noOfPeopleReviewed, setNoOfPeopleReviewed] = useState(0);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [dragIndex, setDragIndex] = useState(null);

  // ================= MULTIPLE IMAGE UPLOAD ================
  const handleMultiUpload = (e, startIndex) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    let current = startIndex;
    files.forEach((file) => {
      if (current < 10) {
        setImageStates[current](file);
        current++;
      }
    });
  };

  // ================= DRAG AND DROP REORDER =================
  const handleReorder = (from, to) => {
    if (from === null || from === to) return;

    const temp = [...imageStates];
    const swap = temp[from];
    temp[from] = temp[to];
    temp[to] = swap;

    temp.forEach((img, i) => setImageStates[i](img));
    setDragIndex(null);
  };

  const removeImage = (i) => {
    setImageStates[i](false);
  };

  // =========================================================
  //               RESET FORM (AFTER SUCCESS)
  // =========================================================
  const resetForm = () => {
    setBrandName("");
    setName("");
    setActualPrice("");
    setDiscountedPrice("");
    setOfferCode("");
    setReview(0);
    setNoOfPeopleReviewed(0);
    setDescription("");
    setPrice("");
    setCategory("Men");
    setSubCategory("Topwear");
    setBestseller(false);
    setSizes([]);

    // Reset all images
    setImageStates.forEach((fn) => fn(false));
  };

  // =========================================================
  //                 SUBMIT HANDLER
  // =========================================================
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("brandName", brandName);
      formData.append("name", name);
      formData.append("actualPrice", actualPrice);
      formData.append("discountedPrice", discountedPrice);
      formData.append("offerCode", offerCode);
      formData.append("review", review);
      formData.append("noOfPeopleReviewed", noOfPeopleReviewed);
      formData.append("description", description);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller.toString());

      // append all images
      imageStates.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product Added Successfully!");

        resetForm(); // <<< CLEAR EVERYTHING
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error uploading product");
    }

    setLoading(false);
  };

  // =========================================================

  return (
    <div className="w-full flex justify-center px-4 py-8">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 md:p-10 flex flex-col gap-6"
      >
        {/* ================= IMAGE UPLOAD GRID ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Upload Product Images</h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {imageStates.map((img, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleReorder(dragIndex, index)}
                className="relative border rounded-lg overflow-hidden aspect-square bg-gray-100 cursor-move"
              >
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="w-full h-full flex flex-col justify-center items-center text-xs cursor-pointer">
                    Image {index + 1}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMultiUpload(e, index)}
                    />
                  </label>
                )}

                {img && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded"
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
              className="input-box w-full"
              placeholder="Your Brand / Shop Name"
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium">Product Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-box w-full"
              placeholder="Product Name"
              required
            />
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div>
          <p className="mb-1 font-medium">Product Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-box min-h-[120px]"
            placeholder="Write product description..."
            required
          />
        </div>

        {/* ================= CATEGORY ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="mb-1 font-medium">Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-box w-full cursor-pointer"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className="mb-1 font-medium">Sub Category</p>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="input-box w-full cursor-pointer"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-1 font-medium">Rating</p>
            <input
              type="number"
              step="0.1"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="input-box w-full"
              placeholder="4.5"
              required
            />
          </div>
        </div>

        {/* ================= PRICE SECTION ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="mb-1 font-medium">Actual Price</p>
            <input
              type="number"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
              className="input-box w-full"
              placeholder="Original Price"
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium">Discounted Price</p>
            <input
              type="number"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              className="input-box w-full"
              placeholder="Discounted Price"
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium">Offer Code</p>
            <input
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
              className="input-box w-full"
              placeholder="EXAMPLE20"
            />
          </div>
        </div>

        {/* ================= PEOPLE REVIEWED ================= */}
        <div>
          <p className="mb-1 font-medium">No. of People Reviewed</p>
          <input
            type="number"
            value={noOfPeopleReviewed}
            onChange={(e) => setNoOfPeopleReviewed(e.target.value)}
            className="input-box w-full max-w-md"
            placeholder="40"
            required
          />
        </div>

        {/* ================= SIZES ================= */}
        <div>
          <p className="mb-1 font-medium">Product Sizes</p>
          <div className="flex flex-wrap gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((s) => s !== size)
                      : [...prev, size]
                  )
                }
                className={`px-4 py-1 rounded-md cursor-pointer transition ${
                  sizes.includes(size)
                    ? "bg-black text-white scale-105"
                    : "bg-gray-200 hover:bg-black hover:text-white"
                }`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* ================= BESTSELLER ================= */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller((prev) => !prev)}
            className="cursor-pointer w-4 h-4"
          />
          <label htmlFor="bestseller" className="cursor-pointer font-medium">
            Mark as Bestseller
          </label>
        </div>

        {/* ================= SUBMIT BUTTON ================= */}
        <button
          disabled={loading}
          className="bg-black text-white py-3 rounded-lg hover:scale-105 transition cursor-pointer"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black animate-spin rounded-full"></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Add;
