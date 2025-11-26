// import React, { use, useEffect, useState } from "react";
// import { useContext } from "react";
// import { assets } from "../assets/assets";
// import { ShopContext } from "../context/ShopContext";
// import { useLocation } from "react-router-dom";

// const Searchbar = () => {
//   const { search, setSearch, showSearch, setShowSearch } =
//     useContext(ShopContext);
//   const [visible, setVisible] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     if (location.pathname.includes("collection")) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   }, [location, showSearch]);
//   return showSearch && visible ? (
//     <div className="border-t border-b bg-gray-50 text-center">
//       <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 outline-none bg-inherit text-sm"
//           type="text"
//           placeholder="Search"
//         />

//         <img className="w-4" src={assets.search_icon} alt="Search icon" />
//       </div>
//       <img
//         onClick={() => setShowSearch(false)}
//         className="inline w-3 cursor-pointer"
//         src={assets.cross_icon}
//         alt="Cross icon"
//       />
//     </div>
//   ) : null;
// };

// export default Searchbar;

// import React, { useContext, useEffect, useState, useRef } from "react";
// import { assets } from "../assets/assets";
// import { ShopContext } from "../context/ShopContext";
// import { useLocation, useNavigate } from "react-router-dom";

// const Searchbar = () => {
//   const { search, setSearch, showSearch, setShowSearch, products } =
//     useContext(ShopContext);

//   const [visible, setVisible] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const inputRef = useRef(null);

//   // Show search bar only on Collection page
//   useEffect(() => {
//     if (location.pathname.includes("collection")) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   }, [location]);

//   // Filter suggestions live
//   useEffect(() => {
//     if (search.trim().length === 0) {
//       setSuggestions([]);
//       return;
//     }

//     const query = search.toLowerCase();

//     const filtered = products.filter((p) =>
//       p.name.toLowerCase().includes(query) ||
//       p.brandName.toLowerCase().includes(query) ||
//       p.category.toLowerCase().includes(query) ||
//       p.subCategory.toLowerCase().includes(query)
//     );

//     setSuggestions(filtered.slice(0, 8)); // show only top 8
//   }, [search, products]);

//   const onSelectProduct = (id) => {
//     setShowSearch(false);
//     setSuggestions([]);
//     setSearch("");
//     navigate(`/product/${id}`);
//   };

//   if (!showSearch || !visible) return null;

//   return (
//     <div className="sticky top-[60px] z-40 bg-black/50 border-b shadow-sm py-3 px-4">
//       {/* Search Container */}
//       <div className="relative max-w-xl mx-auto">
//         <div className="flex items-center gap-3 border rounded-full px-4 py-2 shadow-sm bg-gray-200">
//           <input
//             ref={inputRef}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1 bg-transparent outline-none text-black text-sm"
//             type="text"
//             placeholder="Search for products, brands, categories..."
//           />
//           <img src={assets.search_icon} className="w-4 opacity-70 inverse brightness-50" />
//         </div>

//         {/* Close Button */}
//         <img
//           onClick={() => setShowSearch(false)}
//           src={assets.cross_icon}
//           className="w-3 absolute right-[-20px] top-3 cursor-pointer"
//         />

//         {/* Suggestion Box */}
//         {suggestions.length > 0 && (
//           <div className="absolute w-full mt-2 bg-white shadow-xl rounded-xl border z-50 max-h-80 overflow-y-auto animate-fadeIn">
//             {suggestions.map((item) => (
//               <div
//                 key={item._id}
//                 onClick={() => onSelectProduct(item._id)}
//                 className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
//               >
//                 <img
//                   src={item.image[0]}
//                   className="w-12 h-12 rounded-lg object-cover"
//                 />

//                 <div className="text-left">
//                   <p className="text-sm font-medium text-gray-800 line-clamp-1">
//                     {item.name}
//                   </p>
//                   <p className="text-xs text-gray-500">{item.brandName}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* No Results Found */}
//         {search.length > 0 && suggestions.length === 0 && (
//           <div className="absolute w-full mt-2 bg-white shadow-md rounded-xl border p-4 text-center text-gray-500 text-sm animate-fadeIn">
//             No products found 😔
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Searchbar;

import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { useLocation, useNavigate } from "react-router-dom";

const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch, products } =
    useContext(ShopContext);

  const [visible, setVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const boxRef = useRef(null);      // 🔥 wrapper ref
  const inputRef = useRef(null);

  // Show only on collections page
  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  // Live filtering
  useEffect(() => {
  if (search.trim().length === 0) {
    setSuggestions([]);
    return;
  }

  const query = search.toLowerCase();

  const filtered = products.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const brand = p.brandName?.toLowerCase() || "";
    const cat = p.category?.toLowerCase() || "";
    const sub = p.subCategory?.toLowerCase() || "";

    return (
      name.includes(query) ||
      brand.includes(query) ||
      cat.includes(query) ||
      sub.includes(query)
    );
  });

  setSuggestions(filtered.slice(0, 8));
}, [search, products]);


  // 🔥 Prevent closing when typing
  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  // 🔥 Select a suggested item
  const onSelectProduct = (id) => {
    navigate(`/product/${id}`);
    setShowSearch(false);
    setSearch("");
    setSuggestions([]);
  };

  // 🔥 Close dropdown only on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!showSearch || !visible) return null;

  return (
    <div className="sticky top-[60px] z-40 bg-black/50 border-b shadow-sm py-3 px-4">
      <div ref={boxRef} className="relative max-w-xl mx-auto select-none">

        {/* Search Input */}
        <div className="flex items-center gap-3 border rounded-full px-4 py-2 shadow-sm bg-gray-200">
          <input
            ref={inputRef}
            value={search}
            onClick={handleInputClick}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-black text-sm"
            type="text"
            placeholder="Search for products, brands, categories..."
          />
          <img src={assets.search_icon} className="w-4 opacity-70" />
        </div>

        {/* Close */}
        <img
          onClick={() => {
            setShowSearch(false);
            setSearch("");
            setSuggestions([]);
          }}
          src={assets.cross_icon}
          className="w-3 absolute right-[-20px] top-3 cursor-pointer"
        />

        {/* Suggestion List */}
        {suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-black shadow-xl rounded-xl border z-50 max-h-80 overflow-y-auto animate-fadeIn">
            {suggestions.map((item) => (
              <div
                key={item._id}
                onClick={() => onSelectProduct(item._id)}
                className="flex items-center gap-3 p-3 hover:bg-gray-500 hover:text-black border cursor-pointer transition"
              >
                <img
                  src={item.image[0]}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-white">{item.brandName}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {search.length > 0 && suggestions.length === 0 && (
          <div className="absolute w-full mt-2 bg-white shadow-md rounded-xl border p-4 text-center text-gray-500 text-sm animate-fadeIn">
            No matching products found 😔
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;


