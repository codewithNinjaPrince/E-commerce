import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const Payments = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("merchantToken");

  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({ balance: 0, withdrawn: 0 });
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [bankDetails, setBankDetails] = useState({ accountName: "", accountNumber: "", ifsc: "", bankName: "", upi: "" });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/payments`, { headers: { token } });
      if (res.data.success) {
        setWallet(res.data.wallet || { balance: 0, withdrawn: 0 });
        setHistory(res.data.history || []);
        setBankDetails(res.data.bankDetails || {});
      } else {
        toast.error(res.data.message || "Failed to load payments");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  const requestWithdraw = async (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter valid amount");
    if (amt > (wallet.balance || 0)) return toast.error("Amount exceeds available balance");

    try {
      setWithdrawing(true);
      const res = await axios.post(`${backendUrl}/api/merchant/payments/withdraw`, { amount: amt }, { headers: { token } });
      if (res.data.success) {
        toast.success("Withdrawal request submitted");
        setAmount("");
        fetchPayments();
      } else {
        toast.error(res.data.message || "Withdraw failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
    setWithdrawing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#0f0f0f] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[250px] p-6">

        <h2 className="text-2xl font-bold mt-6">Payments & Earnings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-[#151515] border border-[#222] rounded-xl p-6">
            <p className="text-gray-400">Current Balance</p>
            <p className="text-3xl font-semibold mt-2">₹{wallet.balance ?? 0}</p>
            <p className="text-sm text-gray-400 mt-1">Withdrawn: ₹{wallet.withdrawn ?? 0}</p>

            <div className="mt-6">
              <h4 className="font-semibold">Payout method</h4>
              <p className="text-gray-300">{bankDetails.bankName || "Not set"}</p>
              <p className="text-gray-400 text-sm">{bankDetails.accountNumber ? `A/C: ${bankDetails.accountNumber}` : ""}</p>
              <p className="text-gray-400 text-sm">IFSC: {bankDetails.ifsc || ""}</p>
            </div>
          </div>

          <div className="bg-[#151515] border border-[#222] rounded-xl p-6 lg:col-span-2">
            <h3 className="font-semibold">Request Withdrawal</h3>

            <form onSubmit={requestWithdraw} className="mt-4 flex flex-col gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-dark max-w-sm"
                placeholder="Amount to withdraw"
              />
              <button disabled={withdrawing} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg w-max">
                {withdrawing ? "Requesting..." : "Request Withdrawal"}
              </button>
            </form>

            <h4 className="font-semibold mt-6">Payout History</h4>
            <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
              {history.length === 0 && <p className="text-gray-400">No payout history</p>}
              {history.map((h, i) => (
                <div key={i} className="flex justify-between items-center bg-[#0f0f0f] p-3 rounded">
                  <div>
                    <p className="font-medium">{h.type || "Payout"}</p>
                    <p className="text-sm text-gray-400">{new Date(h.date).toLocaleString()}</p>
                  </div>
                  <p className={`font-semibold ${h.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>₹{h.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;
