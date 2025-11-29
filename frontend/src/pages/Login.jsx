import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const location = useLocation;
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  const { token, setToken, navigate, backendUrl, getUserCart } =
    useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (currentState === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
      }

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // After successful login:
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate("/");
        }

        // ⭐ Immediately fetch cart after login!
        await getUserCart(response.data.token);

        toast.success(
          currentState === "Sign Up" ? "Account created 🎉" : "Welcome back 😎",
          { position: "top-center" }
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl">{currentState}</p>
        <hr className="h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800 cursor-text"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800 cursor-text"
        placeholder="Email"
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800 cursor-text"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm">
        <p className="cursor-pointer">Forgot your Password?</p>
        <p
          onClick={() =>
            setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
          }
          className="cursor-pointer"
        >
          {currentState === "Login" ? "Create account" : "Login Here"}
        </p>
      </div>

      {/* Button or loader */}
      <button
        className="bg-white text-black boder hover:bg-white/50 hover:text-white font-light px-8 py-2 mt-4 cursor-pointer flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <span>
              {currentState === "Login"
                ? "Signing you in..."
                : "Creating your account..."}
            </span>
          </>
        ) : currentState === "Login" ? (
          "Sign In"
        ) : (
          "Sign Up"
        )}
      </button>

      {/* Funny line under loader */}
      {loading && (
        <p className="text-gray-500 text-xs animate-pulse mt-2">
          Brewing your shopping universe... ☕🛒
        </p>
      )}
    </form>
  );
};

export default Login;
