import React, { useState } from "react";
import axios from "axios";
import API from "@/api";

const TransferForm = ({ refresh }) => {
  const [targetAccountNumber, setTargetAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!targetAccountNumber.trim()) {
      return alert("Enter recipient account number");
    }

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return alert("Enter a valid amount greater than 0");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/api/transactions/transfer",
        {
          amount: amt,
          targetAccountNumber: targetAccountNumber.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Transfer Successful");

      setTargetAccountNumber("");
      setAmount("");

      if (refresh) refresh();

    } catch (error) {
      console.error("Transfer error:", error.response?.data || error.message);
      alert(error.response?.data || "Transfer failed");
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
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="form-control mb-2"
      />

      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Processing..." : "Send Money"}
      </button>
    </form>
  );
};

export default TransferForm;