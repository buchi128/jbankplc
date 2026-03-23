import { useState } from "react";
import API from "@/api";

function Deposit() {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await API.post("/api/transactions/deposit", {
        amount: Number(amount),
      });

      alert("Deposit successful!");
      setAmount("");

    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Deposit failed");
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
}

export default Deposit;