// import React from "react";

// const UploadGuide = () => {
//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">

//       <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
//         📦 Product Upload Guide
//       </h1>

//       <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-xl p-5 space-y-6 text-sm md:text-base">

//         {/* Section 1 */}
//         <div>
//           <h2 className="text-lg font-semibold text-yellow-400 mb-2">
//             1. Upload Images
//           </h2>
//           <p className="text-gray-300 leading-relaxed">
//             Click on <b>Image 1</b> and select up to 10 images at once.  
//             All images will automatically be set in order.
//           </p>
//           <p className="text-gray-400 mt-1 italic">
//             Image 1 pe click karo → ek sath 10 photo select kar sakte ho.  
//             System unko automatic order me arrange kar dega.
//           </p>
//         </div>

//         {/* Section 2 */}
//         <div>
//           <h2 className="text-lg font-semibold text-yellow-400 mb-2">
//             2. Product Name
//           </h2>
//           <p className="text-gray-300">
//             Write a short, clean and clear product name.
//           </p>
//           <p className="text-gray-400 mt-1 italic">
//             Product ka chhota aur simple naam likho taaki customer easily samajh paye.
//           </p>
//         </div>

//         {/* Section 3 */}
//         <div>
//           <h2 className="text-lg font-semibold text-yellow-400 mb-2">
//             3. Price & Category
//           </h2>
//           <p className="text-gray-300">
//             Choose correct price and proper category for your product.
//           </p>
//           <p className="text-gray-400 mt-1 italic">
//             Galat price aur category se customer confuse hota hai.
//           </p>
//         </div>

//         {/* Section 4 */}
//         <div>
//           <h2 className="text-lg font-semibold text-yellow-400 mb-2">
//             4. Product Description
//           </h2>
//           <p className="text-gray-300">
//             Mention size, colour, material and quality clearly.
//           </p>
//           <p className="text-gray-400 mt-1 italic">
//             Size, colour aur material ka mention zaroor karo — customer ko clarity milti hai.
//           </p>
//         </div>

//         {/* Section 5 */}
//         <div>
//           <h2 className="text-lg font-semibold text-yellow-400 mb-2">
//             5. Final Submit
//           </h2>
//           <p className="text-gray-300">
//             Click on "Add Product" button after filling all details.
//           </p>
//           <p className="text-gray-400 mt-1 italic">
//             Sab fill karne ke baad bas ek baar "Add Product" dabao ✅
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UploadGuide;

import React from "react";

const UploadGuide = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        📦 Complete Product Upload Guide
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1 - Images */}
        <Section 
          title="1. Product Images Upload"
          eng="Click on Image 1. You can select up to 10 images at one time. Images will auto fill in order. Drag images to change order."
          hin="Image 1 pe click karo. Ek baar me 10 photo select kar sakte ho. System automatic order me laga dega. Agar order change karna ho to image drag karo."
          extra="Best Image Tips: White background photos use karo, clear aur bright photos lo, blur photo mat dalo."
        />

        {/* 2 - Brand Name */}
        <Section 
          title="2. Brand / Shop Name"
          eng="Enter your brand or shop name here."
          hin="Yaha apne dukan ya brand ka naam likho."
          extra="Example: Prince Fashion, Brawvly Store etc."
        />

        {/* 3 - Product Name */}
        <Section 
          title="3. Product Name"
          eng="Write your product name clearly. Example: Men's Cotton Oversized T-Shirt."
          hin="Product ka simple aur clearly samajh me aane wala naam likho."
          extra="Customer search kare to naam easily match ho jaye."
        />

        {/* 4 - Product Description */}
        <Section 
          title="4. Product Description"
          eng="Explain your product details like material, fitting, usage, care instructions."
          hin="Product ka pura detail likho jaise material, fitting, wash kaise kare, kaha use hota hai."
          extra="Example: Made with 100% cotton, soft fabric, perfect for summer."
        />

        {/* 5 - Category */}
        <Section 
          title="5. Category Selection"
          eng="Select correct category like Men/Women/Kids."
          hin="Apne product ke hisaab se sahi category choose karo."
        />

        {/* 6 - Sub Category */}
        <Section 
          title="6. Sub Category"
          eng="Choose correct type like Topwear, Bottomwear or Winterwear."
          hin="Product topwear hai, bottomwear hai ya winterwear hai – woh yaha select karo."
        />

        {/* 7 - Rating */}
        <Section 
          title="7. Rating"
          eng="Give product rating between 1 to 5. Example: 4.5"
          hin="Product ko rating do 1 se 5 ke beech me. Jaise: 4.5"
          extra="Agar new product hai, to normal rating like 4 ya 4.2 bhi de sakte ho."
        />

        {/* 8 - Actual Price */}
        <Section 
          title="8. Actual Price"
          eng="Enter the original price of the product."
          hin="Original MRP ya jo real price hai, woh yaha likho."
          extra="Example: 999"
        />

        {/* 9 - Discounted Price */}
        <Section 
          title="9. Discounted Price"
          eng="Enter your selling price after discount."
          hin="Jo price pe product bechna hai wo yaha likho."
          extra="Example: 699"
        />

        {/* 10 - Offer Code */}
        <Section 
          title="10. Offer Code"
          eng="Optional field. Enter coupon code if available."
          hin="Optional hai. Agar koi coupon code dena chahte ho to yaha likho."
        />

        {/* 11 - No of Reviews */}
        <Section 
          title="11. No Of People Reviewed"
          eng="Enter how many users have reviewed the product."
          hin="Kitne logon ne review kiya hai wo yaha likho."
          extra="Agar naya product hai to 0 bhi daal sakte ho."
        />

        {/* 12 - Product Sizes */}
        <Section 
          title="12. Size Selection"
          eng="Select all sizes available like S, M, L, XL, XXL."
          hin="Jo size available hai unn sab pe click karke select karo."
          extra="Selected size black ho jayega matlab wo activate ho gaya."
        />

        {/* 13 - Bestseller Mark */}
        <Section 
          title="13. Bestseller Option"
          eng="Tick this checkbox if product is best seller."
          hin="Agar product zyada bikta hai to isko bestseller me mark karo."
        />

        {/* 14 - Final Submission */}
        <Section 
          title="14. Add Product Button"
          eng="After filling all details, click on Add Product button."
          hin="Sab detail fill karne ke baad neeche 'Add Product' button pe click karo."
          extra="Uploading ke time loading dikhega, page tab tak mat close karna."
        />

      </div>
    </div>
  );
};

const Section = ({ title, eng, hin, extra }) => {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/5">
      <h2 className="text-lg md:text-xl font-semibold text-yellow-400 mb-2">
        {title}
      </h2>
      <p className="text-gray-200 leading-relaxed">{eng}</p>
      <p className="text-gray-400 italic mt-1">{hin}</p>
      {extra && <p className="text-green-400 text-sm mt-2">💡 {extra}</p>}
    </div>
  );
};

export default UploadGuide;

