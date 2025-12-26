import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

/* ================= CONSTANTS ================= */
const EMPTY_FORM = {
  name: "",
  phone: "",
  alternatePhone: "",
  email: "",
  houseNo: "",
  street: "",
  locality: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",
  type: "home",
};

const isValidIndianPhone = (value) => /^[6-9]\d{9}$/.test(value);
const isValidPincode = (value) => /^\d{6}$/.test(value);

const AddressForm = () => {
  const { addressId } = useParams();
  const isEdit = Boolean(addressId);

  const navigate = useNavigate();
  const { backendUrl, token } = useContext(ShopContext);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  /* ================= LOAD ADDRESS ================= */
  useEffect(() => {
    if (!isEdit) return;

    const loadAddress = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/address/get`, {
          headers: { token },
        });

        const addr = res.data.addresses.find((a) => a.addressId === addressId);

        if (!addr) {
          toast.error("Address not found");
          navigate(-1);
          return;
        }

        setForm(addr);
      } catch {
        toast.error("Failed to load address");
      }
    };

    loadAddress();
  }, [addressId]);

  /* ================= HANDLERS ================= */
  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!isValidIndianPhone(form.phone)) e.phone = "Enter Valid mobile number";
    if (form.alternatePhone && !isValidIndianPhone(form.alternatePhone))
      e.alternatePhone = "Invalid alternate number";
    if (!form.houseNo.trim()) e.houseNo = "House / Flat number required";
    if (!form.street.trim()) e.street = "Street is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!isValidPincode(form.pincode)) e.pincode = "Pincode must be 6 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setShowConfirm(true);
  };

  const saveAddress = async () => {
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`${backendUrl}/api/address/update/${addressId}`, form, {
          headers: { token },
        });
        toast.success("Address updated");
      } else {
        await axios.post(`${backendUrl}/api/address/add`, form, {
          headers: { token },
        });
        toast.success("Address added");
      }

      navigate("/address");
    } catch {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white">
      {/* ================= HEADER ================= */}
      {/* ================= FIXED HEADER (NAVBAR) ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>

          <h2 className="font-semibold text-lg">
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto px-4 py-6 pb-28 grid gap-4 pt-[72px]"
      >
        {/* NAME */}
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={onChange}
          error={errors.name}
        />

        {/* PHONE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            error={errors.phone}
          />
          <Input
            label="Alternate Phone"
            name="alternatePhone"
            value={form.alternatePhone}
            onChange={onChange}
            error={errors.alternatePhone}
          />
        </div>

        <Input
          label="Email (optional)"
          name="email"
          value={form.email}
          onChange={onChange}
        />

        <Input
          label="House / Flat No."
          name="houseNo"
          value={form.houseNo}
          onChange={onChange}
          error={errors.houseNo}
        />

        <Input
          label="Street"
          name="street"
          value={form.street}
          onChange={onChange}
          error={errors.street}
        />

        <Input
          label="Locality"
          name="locality"
          value={form.locality}
          onChange={onChange}
        />

        <Input
          label="Landmark"
          name="landmark"
          value={form.landmark}
          onChange={onChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={onChange}
            error={errors.city}
          />
          <Input
            label="Pincode"
            name="pincode"
            value={form.pincode}
            onChange={onChange}
            error={errors.pincode}
          />
        </div>

        <Input
          label="State"
          name="state"
          value={form.state}
          onChange={onChange}
          error={errors.state}
        />

        {/* TYPE */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {["home", "work"].map((t) => {
            const active = form.type === t;

            return (
              <label
                key={t}
                className={`
          flex items-center justify-center gap-3
          px-4 py-3
          rounded-xl
          border
          cursor-pointer
          transition-all
          select-none
          ${
            active
              ? "border-green-500 bg-green-500/10 text-green-400 scale-[0.97]"
              : "border-white/10 hover:border-white/30 "
          }
        `}
              >
                {/* hidden radio (still accessible) */}
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={active}
                  onChange={onChange}
                  className="hidden"
                />

                {/* icon */}
                <span className="text-lg">{t === "home" ? "🏠" : "🏢"}</span>

                {/* text */}
                <span className="capitalize font-medium">{t}</span>
              </label>
            );
          })}
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="mt-6 bg-green-600 text-black py-3 rounded-xl font-semibold hover:bg-green-500 transition disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Saving..." : isEdit ? "Update Address" : "Save Address"}
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-[#121212] rounded-2xl p-5 w-[90%] max-w-sm border border-white/10">
            <h3 className="text-lg font-semibold mb-2">
              {isEdit ? "Update address?" : "Save address?"}
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              {isEdit
                ? "Are you sure you want to update this address?"
                : "Are you sure you want to save this address?"}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveAddress}
                className="flex-1 py-2 rounded-xl bg-green-500 text-black font-medium hover:bg-green-600 transition cursor-pointer"
              >
                Yes, confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* ================= INPUT COMPONENT ================= */
const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1">
    <input
      {...props}
      placeholder={label}
      className={`
        w-full
        bg-[#121212]
        px-4 py-3
        rounded-xl
        border
        outline-none
        text-sm
        transition
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-white/10 focus:border-white/30"
        }
      `}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export default AddressForm;

// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
// import { toast } from "react-toastify";
// import { FaArrowLeft } from "react-icons/fa";

// const EMPTY_FORM = {
//   name: "",
//   phone: "",
//   alternatePhone: "",
//   email: "",
//   houseNo: "",
//   street: "",
//   locality: "",
//   landmark: "",
//   city: "",
//   district: "",
//   state: "",
//   pincode: "",
//   country: "India",
//   type: "home",
// };

// const AddressForm = () => {
//   const { addressId } = useParams(); // undefined for add
//   const isEdit = Boolean(addressId);

//   const navigate = useNavigate();
//   const { backendUrl, token } = useContext(ShopContext);

//   const [form, setForm] = useState(EMPTY_FORM);
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD ADDRESS (EDIT MODE) ================= */
//   useEffect(() => {
//     if (!isEdit) return;

//     const loadAddress = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/api/address/get`,  {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//         const addr = res.data.addresses.find(
//           (a) => a.addressId === addressId
//         );

//         if (!addr) {
//           toast.error("Address not found");
//           navigate(-1);
//           return;
//         }

//         setForm(addr);
//       } catch {
//         toast.error("Failed to load address");
//       }
//     };

//     loadAddress();
//   }, [addressId]);

//   /* ================= HANDLERS ================= */
//   const onChange = (e) => {
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);

//     try {
//       if (isEdit) {
//         await axios.put(
//           `${backendUrl}/api/address/update/${addressId}`,
//           form,
//           { headers: { token } }
//         );
//         toast.success("Address updated");
//       } else {
//         await axios.post(`${backendUrl}/api/address/add`, form, {
//           headers: { token },
//         });
//         toast.success("Address added");
//       }

//       navigate("/address");
//     } catch {
//       toast.error("Failed to save address");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="min-h-screen bg-black text-white">
//       {/* ================= HEADER ================= */}
//       <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
//         <FaArrowLeft
//           onClick={() => navigate(-1)}
//           className="cursor-pointer"
//         />
//         <h2 className="font-semibold">
//           {isEdit ? "Edit Address" : "Add New Address"}
//         </h2>
//       </div>

//       {/* ================= FORM ================= */}
//       <form
//         onSubmit={onSubmit}
//         className="px-4 py-5 flex flex-col gap-4 pb-24"
//       >
//         <input
//           required
//           name="name"
//           value={form.name}
//           onChange={onChange}
//           placeholder="Full Name"
//           className="input-box"
//         />

//         <div className="flex gap-3">
//           <input
//             required
//             name="phone"
//             value={form.phone}
//             onChange={onChange}
//             placeholder="Phone"
//             className="input-box"
//           />
//           <input
//             name="alternatePhone"
//             value={form.alternatePhone}
//             onChange={onChange}
//             placeholder="Alternate Phone"
//             className="input-box"
//           />
//         </div>

//         <input
//           name="email"
//           value={form.email}
//           onChange={onChange}
//           placeholder="Email (optional)"
//           className="input-box"
//         />

//         <input
//           required
//           name="houseNo"
//           value={form.houseNo}
//           onChange={onChange}
//           placeholder="House / Flat No."
//           className="input-box"
//         />

//         <input
//           required
//           name="street"
//           value={form.street}
//           onChange={onChange}
//           placeholder="Street"
//           className="input-box"
//         />

//         <input
//           name="locality"
//           value={form.locality}
//           onChange={onChange}
//           placeholder="Locality"
//           className="input-box"
//         />

//         <input
//           name="landmark"
//           value={form.landmark}
//           onChange={onChange}
//           placeholder="Landmark"
//           className="input-box"
//         />

//         <div className="flex gap-3">
//           <input
//             required
//             name="city"
//             value={form.city}
//             onChange={onChange}
//             placeholder="City"
//             className="input-box"
//           />
//           <input
//             required
//             name="pincode"
//             value={form.pincode}
//             onChange={onChange}
//             placeholder="Pincode"
//             className="input-box"
//           />
//         </div>

//         <input
//           required
//           name="state"
//           value={form.state}
//           onChange={onChange}
//           placeholder="State"
//           className="input-box"
//         />

//         {/* ================= ADDRESS TYPE ================= */}
//         <div className="flex gap-4 mt-2">
//           {["home", "work"].map((t) => (
//             <label key={t} className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="type"
//                 value={t}
//                 checked={form.type === t}
//                 onChange={onChange}
//               />
//               {t === "home" ? "Home" : "Work"}
//             </label>
//           ))}
//         </div>

//         {/* ================= SUBMIT ================= */}
//         <button
//           disabled={loading}
//           className="mt-6 bg-white text-black py-3 rounded-lg font-semibold disabled:opacity-60"
//         >
//           {loading ? "Saving..." : isEdit ? "Update Address" : "Save Address"}
//         </button>
//       </form>
//     </section>
//   );
// };

// export default AddressForm;
