// import React, { useContext, useEffect } from "react";
// import { useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [currentState, setCurrentState] = useState('Login');
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     try {
//       if (currentState === "Sign Up") {
//         // call the sign up Api
//         const response = await axios.post(backendUrl + "/api/user/register", {
//           name,
//           email,
//           password,
//         });
//         if (response.data.success) {
//           setToken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//         } else {
//           toast.error(response.data.message);
//         }
//       } else {
//         // call the login Api
//         const response = await axios.post(backendUrl + "/api/user/login", {email,password,});
//         if (response.data.success) {
//           setToken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//         } else {
//           toast.error(response.data.message);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(()=>{
//     if(token){
//       navigate('/')
//     }  
//   },[token])

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       action=""
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl">{currentState}</p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>
//       {currentState === "Login" ? (
//         ""
//       ) : (
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           type="text"
//           className="w-full px-3 py-2 border border-gray-800"
//           placeholder="Name"
//           required
//         />
//       )}
//       <input
//         onChange={(e) => setEmail(e.target.value)}
//         value={email}
//         type="email"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="Email"
//         required
//       />
//       <input
//         onChange={(e) => setPassword(e.target.value)}
//         value={password}
//         type="password"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="Password"
//         required
//       />
//       <div className="w-full flex justify-between text-sm mt-[-8px]">
//         <p className="cursor-pointer">Forgot your Password?</p>
//         {currentState === "Login" ? (
//           <p
//             onClick={() => setCurrentState("Sign Up")}
//             className="cursor-pointer"
//           >
//             Create account
//           </p>
//         ) : (
//           <p
//             onClick={() => setCurrentState("Login")}
//             className="cursor-pointer"
//           >
//             Login Here
//           </p>
//         )}
//       </div>
//       <button className="bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer">
//         {currentState === "Login" ? "Sign In" : "Sign Up"}
//       </button>
//     </form>
//   );
// };

// export default Login;

// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [currentState, setCurrentState] = useState("Login");
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // -------------------- SUBMIT --------------------
//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     try {
//       let apiUrl =
//         currentState === "Sign Up"
//           ? backendUrl + "/api/user/register"
//           : backendUrl + "/api/user/login";

//       const payload =
//         currentState === "Sign Up"
//           ? { name, email, password }
//           : { email, password };

//       const response = await axios.post(apiUrl, payload);

//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);
//         toast.success(
//           currentState === "Sign Up"
//             ? "Account created successfully!"
//             : "Logged in successfully!",
//           { position: "top-center" }
//         );
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong!");
//     }
//   };

//   useEffect(() => {
//     if (token) navigate("/");
//   }, [token]);

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col items-center w-[90%] sm:max-w-[420px] m-auto mt-14 gap-4
//       text-white bg-[#121212] p-8 rounded-2xl shadow-xl border border-white/10 cursor-pointer"
//     >
//       {/* ------------------- Title --------------------- */}
//       <div className="inline-flex items-center gap-3 mb-2 mt-4">
//         <p className="text-3xl font-semibold text-white">{currentState}</p>

//         <hr className="border-none h-[1.5px] w-10 bg-gray-500" />
//       </div>

//       {/* ------------------- Inputs --------------------- */}
//       {currentState === "Sign Up" && (
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           type="text"
//           className="w-full px-4 py-3 bg-[#1c1c1c] border border-gray-700 rounded-lg text-white
//           focus:ring-2 focus:ring-white/30 outline-none transition"
//           placeholder="Full Name"
//           required
//         />
//       )}

//       <input
//         onChange={(e) => setEmail(e.target.value)}
//         value={email}
//         type="email"
//         className="w-full px-4 py-3 bg-[#1c1c1c] border border-gray-700 rounded-lg text-white
//         focus:ring-2 focus:ring-white/30 outline-none transition"
//         placeholder="Email Address"
//         required
//       />

//       <input
//         onChange={(e) => setPassword(e.target.value)}
//         value={password}
//         type="password"
//         className="w-full px-4 py-3 bg-[#1c1c1c] border border-gray-700 rounded-lg text-white
//         focus:ring-2 focus:ring-white/30 outline-none transition"
//         placeholder="Password"
//         required
//       />

//       {/* ------------------- Bottom Links --------------------- */}
//       <div className="w-full flex justify-between text-sm mt-[-5px] text-gray-400">
//         <p className="cursor-pointer hover:text-white transition">
//           Forgot your Password?
//         </p>

//         {currentState === "Login" ? (
//           <p
//             onClick={() => setCurrentState("Sign Up")}
//             className="cursor-pointer hover:text-white transition"
//           >
//             Create account
//           </p>
//         ) : (
//           <p
//             onClick={() => setCurrentState("Login")}
//             className="cursor-pointer hover:text-white transition"
//           >
//             Login Here
//           </p>
//         )}
//       </div>

//       {/* ------------------- Button --------------------- */}
//       <button
//         type="submit"
//         className="bg-white text-black font-semibold px-10 py-3 mt-3 rounded-lg
//         hover:bg-gray-300 active:scale-95 transition cursor-pointer w-full text-center"
//       >
//         {currentState === "Login" ? "Sign In" : "Sign Up"}
//       </button>
//     </form>
//   );
// };

// export default Login;



import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);

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

        // ⭐ Immediately fetch cart after login!
        await getUserCart(response.data.token);


        toast.success(
          currentState === "Sign Up"
            ? "Account created 🎉"
            : "Welcome back 😎",
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
          {currentState === "Login"
            ? "Create account"
            : "Login Here"}
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

