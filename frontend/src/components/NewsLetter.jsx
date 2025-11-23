import React, { useState } from "react";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter a valid email");
    }

    try {
      const response = await fetch(
        "https://e-commerce-eight-blue-36.vercel.app/api/email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Subscribed successfully!");
      setEmail("");

    } catch (err) {
      toast.error("Server not responding. Try again later.");
    }
  };

  return (
    <div className="text-center cursor-pointer hover:scale-103 duration-100">
      <p className="text-2xl font-medium text-gray-800">Subscribe Now & Get Great Discounts</p>

      <p className="text-gray-400 mt-3">
         Get exclusive first looks, member-only deals, and content hand-picked just for you.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter Your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="bg-black text-white text-xs px-10 py-4"
          type="submit"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
