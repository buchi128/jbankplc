import React, { useState } from "react";
import API from "@/api";

const TransferForm = ({ refresh }) => {
  const [targetAccountNumber, setTargetAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    if (!targetAccountNumber.trim()) {
      return alert("Enter recipient account number");
    }

    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      return alert("Enter a valid amount greater than 0");
    }

    setLoading(true);
    try {
      
      const profile = await API.get('/accounts/me');
      const accountId = profile.data?.data?._id;

      if (!accountId) {
        alert("No active bank account profile reference located for this user.");
        setLoading(false);
        return;
      }

     
      await API.post(
        "/transactions/transfer",
        {
          accountId,
          type: 'transfer', 
          amount: amt,
          targetAccountNumber: targetAccountNumber.trim(),
          description: `Transfer to Acct: ${targetAccountNumber.trim()}`
        }
      );

      alert("Transfer Successful!");

      setTargetAccountNumber("");
      setAmount("");

      
      if (refresh) refresh();

    } catch (error) {
      console.error("Transfer error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.response?.data || "Transfer failed";
      alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleTransfer}>
      <h5>Transfer Money</h5>

      <input
        type="text"
        placeholder="Recipient Account Number"
        value={targetAccountNumber}
        onChange={(e) => setTargetAccountNumber(e.target.value)}
        className="form-control mb-2"
        disabled={loading}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="form-control mb-2"
        disabled={loading}
      />

      <button className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Processing..." : "Send Money"}
      </button>
    </form>
  );
};

export default TransferForm;
