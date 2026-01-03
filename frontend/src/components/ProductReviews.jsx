import { useContext, useEffect, useState } from "react";
import { FaStar, FaRegStar, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

/* ---------------- STAR RATING ---------------- */
const StarRating = ({ value, onChange, size = 20 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="cursor-pointer transition-transform hover:scale-110"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange && onChange(star)}
        >
          {star <= (hover || value) ? (
            <FaStar size={size} className="text-yellow-400" />
          ) : (
            <FaRegStar size={size} className="text-gray-400" />
          )}
        </span>
      ))}
    </div>
  );
};

/* ---------------- REVIEW CARD ---------------- */
const ReviewCard = ({ review }) => {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-[#121212]">
      <div className="flex justify-between items-start">
        <StarRating value={review.rating} />
        <span className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      {review.title && <h4 className="mt-2 font-semibold">{review.title}</h4>}

      <p className="text-sm text-gray-300 mt-1">{review.reviewText}</p>

      {review.verifiedPurchase && (
        <span className="inline-block mt-2 text-xs text-green-400">
          ✔ Verified Purchase
        </span>
      )}

      {review.merchantReply?.message && (
        <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Merchant Reply</p>
          <p className="text-sm">{review.merchantReply.message}</p>
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const ProductReviews = ({ productId }) => {
  const { backendUrl } = useContext(ShopContext);
  const token = localStorage.getItem("token");

  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("recent");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);


  /* FETCH REVIEWS */
  const loadReviews = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/review/get`, {
        productId,
        sort,
      });

      if (res.data.success) setReviews(res.data.reviews);
    } catch {
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    loadReviews();
  }, [sort, productId]);

  /* ADD REVIEW */
  const submitReview = async () => {
    // 🔴 Frontend validation
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (text.trim().length < 20) {
      toast.error("Review must be at least 20 characters");
      return;
    }

    if (!orderId) {
      toast.error("You can review this product only after delivery");
      // clear states
      setRating(0);
      setText("");
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        `${backendUrl}/api/review/add`,
        {
          productId,
          orderId,
          rating,
          reviewText: text,
        },
        { headers: { token } }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Unable to submit review");

        // 🔁 clear states on failure
        setRating(0);
        setText("");
        return;
      }

      // ✅ Success
      toast.success("Review submitted successfully");
      setRating(0);
      setText("");
      loadReviews();
    } catch (error) {
      toast.error("Something went wrong. Please try again");

      // 🔁 clear states on error
      setRating(0);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-2">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Ratings & Reviews</h3>

        <button
          className="flex items-center gap-2 text-sm cursor-pointer text-gray-300 hover:text-white"
          onClick={() => setSort(sort === "recent" ? "high" : "recent")}
        >
          Sort
          <FaChevronDown />
        </button>
      </div>

      {/* ADD REVIEW */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 mb-8">
        <p className="text-sm mb-2">Rate this product</p>
        <StarRating value={rating} onChange={setRating} size={26} />

        <textarea
          className="mt-3 w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm resize-none"
          rows={3}
          placeholder="Write your review (min 20 characters)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          disabled={submitting || !orderId}
          onClick={submitReview}
          className="mt-3 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium
             hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
        >
          Submit Review
        </button>

        {!orderId && (
          <p className="text-xs text-gray-400 mt-2">
            You can review this product after delivery
          </p>
        )}
      </div>

      {/* REVIEW LIST */}
      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet</p>
        ) : (
          reviews.map((r) => <ReviewCard key={r._id} review={r} />)
        )}
      </div>
    </section>
  );
};

export default ProductReviews;

// import { useEffect, useState } from "react";
// import { FaStar, FaRegStar, FaChevronDown } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ShopContext } from "../context/ShopContext";

// /* ---------------- STAR RATING ---------------- */
// const StarRating = ({ value, onChange, size = 20 }) => {
//   const [hover, setHover] = useState(0);

//   return (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <span
//           key={star}
//           className="cursor-pointer transition-transform hover:scale-110"
//           onMouseEnter={() => setHover(star)}
//           onMouseLeave={() => setHover(0)}
//           onClick={() => onChange && onChange(star)}
//         >
//           {star <= (hover || value) ? (
//             <FaStar size={size} className="text-yellow-400" />
//           ) : (
//             <FaRegStar size={size} className="text-gray-400" />
//           )}
//         </span>
//       ))}
//     </div>
//   );
// };

// /* ---------------- REVIEW CARD ---------------- */
// const ReviewCard = ({ review }) => {
//   return (
//     <div className="border border-white/10 rounded-xl p-4 bg-[#121212]">
//       <div className="flex justify-between items-start">
//         <StarRating value={review.rating} />
//         <span className="text-xs text-gray-400">
//           {new Date(review.createdAt).toLocaleDateString()}
//         </span>
//       </div>

//       {review.title && (
//         <h4 className="mt-2 font-semibold">{review.title}</h4>
//       )}

//       <p className="text-sm text-gray-300 mt-1">{review.reviewText}</p>

//       {review.verifiedPurchase && (
//         <span className="inline-block mt-2 text-xs text-green-400">
//           ✔ Verified Purchase
//         </span>
//       )}

//       {review.merchantReply?.message && (
//         <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10">
//           <p className="text-xs text-gray-400 mb-1">Merchant Reply</p>
//           <p className="text-sm">{review.merchantReply.message}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ---------------- MAIN COMPONENT ---------------- */
// const ProductReviews = ({ productId }) => {
//   const token = localStorage.getItem("token");

//   const [reviews, setReviews] = useState([]);
//   const [sort, setSort] = useState("recent");
//   const [rating, setRating] = useState(0);
//   const [text, setText] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   /* FETCH REVIEWS */
//   const loadReviews = async () => {
//     const res = await axios.post(`${backendUrl}/api/review/get`, {
//       productId,
//       sort,
//     });

//     if (res.data.success) setReviews(res.data.reviews);
//   };

//   useEffect(() => {
//     loadReviews();
//   }, [sort]);

//   /* ADD REVIEW */
//   const submitReview = async () => {
//     if (rating === 0 || text.length < 20) {
//       return toast.error("Minimum 1 star & 20 characters required");
//     }

//     try {
//       setSubmitting(true);
//       const res = await axios.post(
//         `${backendUrl}/api/review/add`,
//         { productId, rating, reviewText: text },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         toast.success("Review submitted");
//         setRating(0);
//         setText("");
//         loadReviews();
//       }
//     } catch {
//       toast.error("Unable to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="mt-12">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold">Ratings & Reviews</h3>

//         <button
//           className="flex items-center gap-2 text-sm cursor-pointer text-gray-300 hover:text-white"
//           onClick={() =>
//             setSort(sort === "recent" ? "high" : "recent")
//           }
//         >
//           Sort
//           <FaChevronDown />
//         </button>
//       </div>

//       {/* ADD REVIEW */}
//       <div className="bg-[#121212] border border-white/10 rounded-xl p-4 mb-8">
//         <p className="text-sm mb-2">Rate this product</p>
//         <StarRating value={rating} onChange={setRating} size={26} />

//         <textarea
//           className="mt-3 w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm resize-none"
//           rows={3}
//           placeholder="Write your review (min 20 characters)"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />

//         <button
//           disabled={submitting}
//           onClick={submitReview}
//           className="mt-3 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
//         >
//           Submit Review
//         </button>
//       </div>

//       {/* REVIEW LIST */}
//       <div className="grid gap-4">
//         {reviews.length === 0 ? (
//           <p className="text-gray-400 text-sm">No reviews yet</p>
//         ) : (
//           reviews.map((r) => <ReviewCard key={r._id} review={r} />)
//         )}
//       </div>
//     </section>
//   );
// };

// export default ProductReviews;
