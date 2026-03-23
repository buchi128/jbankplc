import { useState } from "react";
import axios from "axios";
import API  from "../api"

function Deposit() {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/api/transactions/deposit",
        { amount: Number(amount) }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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