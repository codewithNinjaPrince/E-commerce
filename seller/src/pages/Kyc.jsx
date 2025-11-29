import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const Kyc = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("merchantToken");

  const [merchant, setMerchant] = useState(null);
  const [gstFile, setGstFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/profile`, { headers: { token } });
      if (res.data.success) setMerchant(res.data.merchant);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const submitKyc = async (e) => {
    e.preventDefault();
    if (!gstFile && !panFile && !aadhaarFront && !aadhaarBack) {
      return toast.error("Choose at least one file to upload");
    }

    try {
      setUploading(true);
      const fd = new FormData();
      if (gstFile) fd.append("gstFile", gstFile);
      if (panFile) fd.append("panFile", panFile);
      if (aadhaarFront) fd.append("aadhaarFront", aadhaarFront);
      if (aadhaarBack) fd.append("aadhaarBack", aadhaarBack);

      const res = await axios.post(`${backendUrl}/api/merchant/kyc`, fd, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("KYC uploaded. Verification in progress.");
        setGstFile(null);
        setPanFile(null);
        setAadhaarFront(null);
        setAadhaarBack(null);
        fetchProfile();
      } else {
        toast.error(res.data.message || "Upload failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload error");
    }
    setUploading(false);
  };

  return (
    <div className="flex bg-[#0f0f0f] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[250px] p-6">

        <h2 className="text-2xl font-bold mt-6">KYC & Verification</h2>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#151515] border border-[#222] rounded-xl p-6">
            <h3 className="font-semibold">Current Status</h3>
            <p className="text-gray-400 mt-2">Verified: <span className="font-medium">{merchant?.isVerified ? "Yes" : "No"}</span></p>
            <p className="text-gray-400 mt-1">GST: <span className="font-medium">{merchant?.gstNumber || "Not provided"}</span></p>
            <p className="text-gray-400 mt-1">PAN: <span className="font-medium">{merchant?.panNumber || "Not provided"}</span></p>
            <p className="text-gray-400 mt-1">Aadhaar: <span className="font-medium">{merchant?.aadhaarNumber || "Not provided"}</span></p>
          </div>

          <form onSubmit={submitKyc} className="bg-[#151515] border border-[#222] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Upload Documents</h3>

            <label className="text-sm text-gray-300">GST Certificate (optional)</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setGstFile(e.target.files[0])} className="block mt-2 mb-4" />

            <label className="text-sm text-gray-300">PAN (optional)</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setPanFile(e.target.files[0])} className="block mt-2 mb-4" />

            <label className="text-sm text-gray-300">Aadhaar Front</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setAadhaarFront(e.target.files[0])} className="block mt-2 mb-4" />

            <label className="text-sm text-gray-300">Aadhaar Back</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setAadhaarBack(e.target.files[0])} className="block mt-2 mb-6" />

            <button disabled={uploading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              {uploading ? "Uploading..." : "Upload Documents"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Kyc;
